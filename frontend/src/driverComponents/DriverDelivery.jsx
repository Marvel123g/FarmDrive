import React, { useEffect, useState } from 'react'
import DriverSidebar from '../components/DriverSidebar';

export default function DriverDelivery() {
  const [activeTab, setActiveTab] = useState('accepted');
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  
  const [deliveries, setDeliveries] = useState([
    {
      id: 1,
      farmer: "Musa Ibrahim",
      farmerAvatar: "https://randomuser.me/api/portraits/men/1.jpg",
      farmerPhone: "+234 802 345 6789",
      crop: "Fresh Tomatoes",
      quantity: "250kg",
      from: "Jos, Plateau",
      to: "Lagos, Lagos",
      price: "₦85,000",
      bidAmount: "₦82,000",
      status: "accepted",
      statusCode: "accepted",
      date: "2024-03-24",
      pickupDate: "2024-03-25",
      deliveryDate: "2024-03-27",
      pickupTime: "08:00 AM",
      description: "Fresh organic tomatoes, harvested yesterday. Well packaged in crates.",
      image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400",
      distance: "520 km",
      duration: "8 hours",
      coordinates: {
        from: { lat: 9.8965, lng: 8.8583 },
        to: { lat: 6.5244, lng: 3.3792 }
      }
    },
    {
      id: 2,
      farmer: "Amina Bello",
      farmerAvatar: "https://randomuser.me/api/portraits/women/2.jpg",
      farmerPhone: "+234 803 456 7890",
      crop: "Organic Onions",
      quantity: "500kg",
      from: "Kano, Kano",
      to: "Abuja, FCT",
      price: "₦120,000",
      bidAmount: "₦115,000",
      status: "accepted",
      statusCode: "accepted",
      date: "2024-03-22",
      pickupDate: "2024-03-26",
      deliveryDate: "2024-03-28",
      pickupTime: "10:00 AM",
      description: "Premium quality red onions, sun-dried and ready for delivery.",
      image: "https://images.unsplash.com/photo-1508747703725-719777637510?w=400",
      distance: "230 km",
      duration: "4 hours",
      coordinates: {
        from: { lat: 12.0022, lng: 8.5919 },
        to: { lat: 9.0765, lng: 7.3986 }
      }
    },
    {
      id: 3,
      farmer: "John Okafor",
      farmerAvatar: "https://randomuser.me/api/portraits/men/3.jpg",
      farmerPhone: "+234 805 678 9012",
      crop: "Sweet Potatoes",
      quantity: "300kg",
      from: "Benue, Benue",
      to: "Port Harcourt, Rivers",
      price: "₦65,000",
      bidAmount: "₦60,000",
      status: "accepted",
      statusCode: "accepted",
      date: "2024-03-20",
      pickupDate: "2024-03-25",
      deliveryDate: "2024-03-26",
      pickupTime: "09:00 AM",
      description: "Freshly harvested sweet potatoes, carefully sorted.",
      image: "https://images.unsplash.com/photo-1596097635121-14a2b5b7e7b8?w=400",
      distance: "380 km",
      duration: "6 hours",
      coordinates: {
        from: { lat: 7.3369, lng: 8.7404 },
        to: { lat: 4.8156, lng: 7.0498 }
      }
    },
    {
      id: 4,
      farmer: "Grace Mensah",
      farmerAvatar: "https://randomuser.me/api/portraits/women/4.jpg",
      farmerPhone: "+234 806 789 0123",
      crop: "Green Bell Peppers",
      quantity: "150kg",
      from: "Kaduna, Kaduna",
      to: "Ibadan, Oyo",
      price: "₦95,000",
      bidAmount: "₦90,000",
      status: "in-progress",
      statusCode: "in-progress",
      date: "2024-03-23",
      pickupDate: "2024-03-24",
      deliveryDate: "2024-03-26",
      pickupTime: "07:00 AM",
      description: "Fresh green bell peppers, crisp and premium quality.",
      image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400",
      distance: "310 km",
      duration: "5.5 hours",
      coordinates: {
        from: { lat: 10.5105, lng: 7.4165 },
        to: { lat: 7.3775, lng: 3.9470 }
      }
    }
  ]);

  // /api/v1/delivery?role=driver

  useEffect(() => {
    const fetchDriverDelivery = async() => {
      const res = await fetch("/api/v1/delivery?role=driver", {
        method: "GET",
        credentials: "include"
      })

      const data = await res.json()

      console.log(data)
    }

    fetchDriverDelivery()
  }, [])
  

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

      {/* Tabs */}
      <div className="delivery-tabs">
        <button 
          className={`tab-btn ${activeTab === 'accepted' ? 'active' : ''}`}
          onClick={() => setActiveTab('accepted')}
        >
          🚚 Active Deliveries
        </button>
        <button 
          className={`tab-btn ${activeTab === 'applied' ? 'active' : ''}`}
          onClick={() => setActiveTab('applied')}
        >
          📋 Applied Deliveries
        </button>
      </div>

      {/* Deliveries Grid */}
      {deliveries.length === 0 ? (
        <div className="empty-deliveries">
          <div className="empty-icon">🚚</div>
          <h3>No Deliveries Found</h3>
          <p>Browse the marketplace to find available deliveries</p>
          <button className="browse-btn">Browse Marketplace</button>
        </div>
      ) : (
        <div className="deliveries-grid">
          {deliveries.map((delivery) => (
            <div key={delivery.id} className="delivery-card">

              <div className="card-content">
                <div className="farmer-info">
                  {/* <img src={delivery.farmerAvatar} alt={delivery.farmer} className="farmer-avatar" /> */}
                  <div>
                    <h4 className="farmer-name">{delivery.farmer}</h4>
                    <p className="farmer-phone">📞 {delivery.farmerPhone}</p>
                  </div>
                  <button 
                    className="contact-btn"
                    onClick={() => handleContactFarmer(delivery.farmerPhone)}
                  >
                    Contact
                  </button>
                </div>

                <h3 className="crop-name">{delivery.crop}</h3>
                
                <div className="price-info">
                  <span className="price-label">Agreed Price:</span>
                  <span className="price-value">{delivery.bidAmount}</span>
                </div>

                <div className="delivery-details">
                  <div className="detail-row">
                    <div className="detail-item">
                      <span className="detail-icon">📦</span>
                      <span>{delivery.quantity}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">📅</span>
                      <span>Pickup: {new Date(delivery.pickupDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-item">
                      <span className="detail-icon">📍</span>
                      <span>From: {delivery.from}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">🎯</span>
                      <span>To: {delivery.to}</span>
                    </div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-item">
                      <span className="detail-icon">🕐</span>
                      <span>Pickup Time: {delivery.pickupTime}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">⏱️</span>
                      <span>Est. Duration: {delivery.duration}</span>
                    </div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-item">
                      <span className="detail-icon">📏</span>
                      <span>Distance: {delivery.distance}</span>
                    </div>
                  </div>
                </div>

                <div className="card-description">
                  <p>{delivery.description}</p>
                </div>

                {/* Action Buttons */}
                <div className="action-buttons">
                  {activeTab === 'accepted' && (
                    <>
                      {delivery.statusCode === 'accepted' && (
                        <button 
                          className="action-btn start-btn"
                          onClick={() => handleStartDelivery(delivery.id)}
                        >
                          🚛 Start Delivery
                        </button>
                      )}
                      {delivery.statusCode === 'in-progress' && (
                        <>
                          <button 
                            className="action-btn map-btn"
                            onClick={() => handleViewMap(delivery)}
                          >
                            🗺️ View Map
                          </button>
                          <button 
                            className="action-btn complete-btn"
                            onClick={() => handleCompleteDelivery(delivery.id)}
                          >
                            ✅ Complete Delivery
                          </button>
                        </>
                      )}
                    </>
                  )}
                  
                  {activeTab === 'applied' && (
                    <>
                      <button 
                        className="action-btn map-btn"
                        onClick={() => handleViewMap(delivery)}
                      >
                        🗺️ View Route
                      </button>
                      <button className="action-btn pending-btn" disabled>
                        ⏳ Waiting for Approval
                      </button>
                    </>
                  )}
                  
                  <button 
                    className="action-btn details-btn"
                    onClick={() => handleViewMap(delivery)}
                  >
                    📍 Route Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
   </div>
  );
}