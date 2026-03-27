import socket from '../components/Socket';
import React, { useEffect, useState } from 'react'
import DriverSidebar from '../components/DriverSidebar';
import ViewMap from '../modals/ViewMap';
import ViewFarmerLocation from '../modals/ViewFarmerLocation';
import ShowCompleteModal from '../modals/ShowCompleteModal';

export default function DriverDelivery() {

  // /api/v1/delivery?role=driver
  const [acceptedDelivery, setAcceptDelivery] = useState([])
  const [watchId, setWatchId] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [showFarmerLocation, setShowFarmerLocation] = useState(false)
  const [showCompleteModal, setShowCompleteModal] = useState(false)

  useEffect(() => {
    const fetchDriverDelivery = async() => {
      const res = await fetch("/api/v1/delivery?role=driver", {
        method: "GET",
        credentials: "include"
      })
      const data = await res.json()

      console.log(data.accepted_produce)
      setAcceptDelivery(data.accepted_produce)
    }

    fetchDriverDelivery()
  }, [])

  // FIXED: Now receives the entire delivery object
  // const handleStartDelivery = (delivery) => {
  //   console.log("Delivery object:", delivery);
  //   console.log("Delivery ID:", delivery.delivery_id);
  //   console.log("Pickup location:", delivery.pickup_location);
  //   console.log("Destination:", delivery.destination);
    
  //   if (watchId) return;

  //   socket.emit("join_delivery", { delivery_id: delivery.delivery_id });

  //   navigator.geolocation.getCurrentPosition((position) => {
  //     const { latitude, longitude } = position.coords;
  //     socket.emit("update_location", {
  //       delivery_id: delivery.delivery_id,  // FIXED: Use delivery.id
  //       lat: latitude,
  //       lng: longitude,
  //     });
  //     setCurrentPosition([latitude, longitude]);
  //   });

  //   const id = navigator.geolocation.watchPosition((pos) => {
  //     socket.emit("update_location", {
  //       delivery_id: delivery.delivery_id,  // FIXED: Use delivery.id instead of undefined deliveryId
  //       lat: pos.coords.latitude,
  //       lng: pos.coords.longitude,
  //     });
  //     setCurrentPosition([pos.coords.latitude, pos.coords.longitude]);
  //   });

  //   setWatchId(id);
  // };

  const handleStartDelivery = async (delivery) => { // Added async
    console.log("Starting delivery for ID:", delivery.delivery_id);
    
    if (watchId) return;

    try {
      // 1. Tell the Backend the trip has officially started
      // This triggers: DB Update + AI Geocoding + Farmer Socket Notification
      const res = await fetch("/api/v1/transit/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ delivery_id: delivery.delivery_id }),
        credentials: "include"
      });

      const result = await res.json();
      if (result.code !== 200) {
          alert("Error starting transit: " + result.message);
          return;
      }

      // 2. Join the Socket Room
      socket.emit("join_delivery", { delivery_id: delivery.delivery_id });

      // 3. Send initial location immediately
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit("update_location", {
          delivery_id: delivery.delivery_id,
          lat: latitude,
          lng: longitude,
        });
        setCurrentPosition([latitude, longitude]);
      });

      // 4. Start the Watcher for real-time tracking
      const id = navigator.geolocation.watchPosition((pos) => {
        socket.emit("update_location", {
          delivery_id: delivery.delivery_id,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setCurrentPosition([pos.coords.latitude, pos.coords.longitude]);
      });

      setWatchId(id);
      setSelectedDelivery(delivery);
      setShowMap(true);

    } catch (err) {
      console.error("Failed to start transit:", err);
    }
  };

  useEffect(() => {
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);


  const handleViewFarmerLocation = (delivery) => {
  console.log("Viewing Farmer Location for Delivery:", delivery.delivery_id);
  socket.emit("join_delivery", { delivery_id: delivery.delivery_id });
  setSelectedDelivery(delivery); 
  setShowFarmerLocation(true);
};

// const handleComplete = (id) => {
//   setShowCompleteModal(true)
//   setSelectedDelivery(id)
// }


  return (
    <div className="driverDelivery_wrapper">
      <DriverSidebar/>
      <div className="driver-delivery-container">
        {/* Header Section */}
        <div className="delivery-header">
          <div className="header-content">
            <div className="header-title">
              <h2>Driver Dashboard</h2>
              <p>Manage your deliveries and track routes</p>
            </div>
          </div>
        </div>

        {/* Deliveries Grid */}
        {acceptedDelivery?.length === 0 ? (
          <div className="empty-deliveries">
            <div className="empty-icon">🚚</div>
            <h3>No Deliveries Found</h3>
            <p>Browse the marketplace to find available deliveries</p>
            <button className="browse-btn">Browse Marketplace</button>
          </div>
        ) : (
          <div className="deliveries-grid">
            {acceptedDelivery?.map((delivery) => (
              <div key={delivery.delivery_id} className="delivery-card">
                <div className="card-content">
                  <div className="farmer-info">
                    <div>
                      <h4 className="farmer-name">{delivery.farmer_name}</h4>
                      <p className="farmer-phone">📞 {delivery.farmer_phone}</p>
                    </div>
                    <button className="contact-btn">
                      {delivery.status}
                    </button>
                  </div>

                  <h3 className="crop-name">{delivery.crop_name}</h3>
                  
                  <div className="price-info">
                    <span className="price-label">Agreed Price:</span>
                    <span className="price-value">{delivery.price}</span>
                  </div>

                  <div className="delivery-details">
                    <div className="detail-row">
                      <div className="detail-item">
                        <span className="detail-icon">📦</span>
                        <span>{delivery.quantity}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">📅</span>
                        <span>Accepted at: {delivery.accepted_at}</span>
                      </div>
                    </div>
                    <div className="detail-row">
                      <div className="detail-item">
                        <span className="detail-icon">📍</span>
                        <span>From: {delivery.pickup_location}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">🎯</span>
                        <span>To: {delivery.destination}</span>
                      </div>
                    </div>
                  </div>

                  <div className="card-description">
                    <p>{delivery.details}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="action-buttons">
                    <button className="action-btn map-btn" onClick={() => {
                        handleViewFarmerLocation(delivery); // FIXED: Pass the entire delivery object, not just id
                        setSelectedDelivery(delivery);
                        setShowFarmerLocation(true);
                      }}>
                      View Farmer Location
                    </button>
                    <button 
                      className="action-btn start-btn"
                      onClick={() => {
                        handleStartDelivery(delivery); // FIXED: Pass the entire delivery object, not just id
                        setSelectedDelivery(delivery);
                        setShowMap(true);
                      }}
                    >
                      Start Delivery
                    </button>
                    <button className="action-btn complete-btn" onClick={() => {
                    setSelectedDelivery(delivery); 
                    setShowCompleteModal(true);
                }}>
                  Complete Delivery
                </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showMap && selectedDelivery && (
        <div className="map-modal">
          <div className="map-container">
            <ViewMap 
              deliveryId={selectedDelivery.delivery_id}
              pickupLocation={selectedDelivery.pickup_location}
              destinationLocation={selectedDelivery.destination}
            />
            <button className="map_btn" onClick={() => setShowMap(false)}>
              Close Map
            </button>
          </div>
        </div>
      )}

      {showFarmerLocation && selectedDelivery && (
      <div className="map-modal">
        <div div className="map-container">
        <button className="close-btn" onClick={() => setShowFarmerLocation(false)}>×</button>
        
        <ViewFarmerLocation
          deliveryId={selectedDelivery.delivery_id}
          pickupLocation={selectedDelivery.pickup_location} 
          destinationLocation={selectedDelivery.destination}
        />
      </div>
    </div>
)}

{showCompleteModal && selectedDelivery && (
  <ShowCompleteModal 
    deliveryId={selectedDelivery.delivery_id || selectedDelivery} // Pass the ID explicitly
    onClose={() => setShowCompleteModal(false)} // Pass the close function
    onComplete={() => {
      setShowCompleteModal(false);
    }}
  />
)}
    </div>
  );
}