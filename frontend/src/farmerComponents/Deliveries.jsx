import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar';
import { CalendarCheck, CalendarClock, Clipboard, MapPin, Navigation, Package } from 'lucide-react';

export default function Deliveries() {
  const [accpetedProduce, setAcceptedProduce] = useState([])
    useEffect(() => {
      const fetchDriverDeliveries = async() => {
        const res = await fetch("/api/v1/delivery?role=farmer", {
          method: "GET",
          credentials: "include"
        })
        const data = await res.json()

        console.log("delivery",data)
        setAcceptedProduce(data. active_deliveries)
      }

      fetchDriverDeliveries()
    }, [])
    

  return (
   <div className="delivery_Wrapper">
    <Sidebar/>
         <div className="deliveries-container">
      {/* Header Section */}
      <div className="deliveries-header">
        <div className="header-content">
          <div className="header-title">
            <h2>My Deliveries</h2>
            <p>Track and manage all your produce deliveries</p>
          </div>
        </div>
      </div>


      {/* Deliveries Grid */}
      {accpetedProduce?.length === 0 ? (
        <div className="empty-deliveries">
          <div className="empty-icon">🚚</div>
          <h3>No Deliveries Found</h3>
          <p>You haven't accepted any produce deliveries yet</p>
          <button className="browse-btn">Browse Marketplace</button>
        </div>
      ) : (
        <div className="deliveries-grid">
          {accpetedProduce?.map((delivery) => (
            <div key={delivery.delivery_id} className="delivery-card">
              <div className="card-header">
                <div className="delivery-status">
                  <span className={`status-badge`}>
                    {delivery.status}
                  </span>
                </div>
              </div>

              <div className="card-content">
                <h3 className="crop-name">{delivery.crop_name}</h3>
                <div className="price-info">
                  <span className="price-label">Agreed Price:</span>
                  <span className="price-value">₦{delivery.price}</span>
                </div>

                {/* Farmer Info */}
                <div className="info-section">
                  <div className="info-title"><Clipboard/> Produce Details</div>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-icon"><Package/></span>
                      <div>
                        <label>Quantity</label>
                        <p>{delivery.quantity}</p>
                      </div>
                    </div>
                    <div className="info-item">
                      <span className="info-icon"><MapPin/></span>
                      <div>
                        <label>From</label>
                        <p>{delivery.pickup_location}</p>
                      </div>
                    </div>
                    <div className="info-item">
                      <span className="info-icon"><Navigation/></span>
                      <div>
                        <label>To</label>
                        <p>{delivery.destination}</p>
                      </div>
                    </div>
                    <div className="info-item">
                      <span className="info-icon"><CalendarCheck/></span>
                      <div>
                        <label>Accepted at</label>
                        <p>{delivery.accepted_at}</p>
                      </div>
                    </div>
                  </div>
                </div>
 if(data.code === 201){
          alert(data.message)
        }
                {/* Driver Info */}
                <div className="driver-section">
                  <div className="info-title">👨‍✈️ Driver Information</div>
                  <div className="driver-info">
                    <img src={delivery.driver_image} alt={delivery.driver_image} className="driver-avatar" />
                    <div className="driver-details">
                      <h4>{delivery.driver_name}</h4>
                      <p className="driver-phone">📞{delivery.driver_phone}</p>
                    </div>
                    {/* <button className="contact-btn">Contact Driver</button> */}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="action-buttons">
                  <button className="action-btn details-btn" onClick={() => alert("Tracking Feature will be added later")}>View/Track</button>
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