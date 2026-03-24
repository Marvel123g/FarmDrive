import React, { useState } from 'react'
import Sidebar from '../components/Sidebar';

export default function Deliveries() {
  const [deliveries, setDeliveries] = useState([
    {
      id: 1,
      farmer: "Musa Ibrahim",
      farmerAvatar: "https://randomuser.me/api/portraits/men/1.jpg",
      driver: "David Okafor",
      driverAvatar: "https://randomuser.me/api/portraits/men/7.jpg",
      driverPhone: "+234 802 345 6789",
      crop: "Fresh Tomatoes",
      quantity: "250kg",
      from: "Jos, Plateau",
      to: "Lagos, Lagos",
      price: "₦85,000",
      bidAmount: "₦82,000",
      status: "in-transit",
      statusCode: "transit",
      date: "2024-03-24",
      pickupDate: "2024-03-25",
      deliveryDate: "2024-03-27",
      description: "Fresh organic tomatoes, harvested yesterday. Well packaged in crates.",
      image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400",
      tracking: {
        currentLocation: "Benin City, Edo",
        lastUpdate: "2024-03-24 14:30",
        estimatedArrival: "2024-03-27 10:00"
      }
    },
    {
      id: 2,
      farmer: "Amina Bello",
      farmerAvatar: "https://randomuser.me/api/portraits/women/2.jpg",
      driver: "Michael Adebayo",
      driverAvatar: "https://randomuser.me/api/portraits/men/8.jpg",
      driverPhone: "+234 803 456 7890",
      crop: "Organic Onions",
      quantity: "500kg",
      from: "Kano, Kano",
      to: "Abuja, FCT",
      price: "₦120,000",
      bidAmount: "₦115,000",
      status: "completed",
      statusCode: "completed",
      date: "2024-03-22",
      pickupDate: "2024-03-26",
      deliveryDate: "2024-03-28",
      description: "Premium quality red onions, sun-dried and ready for delivery.",
      image: "https://images.unsplash.com/photo-1508747703725-719777637510?w=400",
      tracking: null
    },
    {
      id: 3,
      farmer: "Grace Mensah",
      farmerAvatar: "https://randomuser.me/api/portraits/women/4.jpg",
      driver: "Chidi Okonkwo",
      driverAvatar: "https://randomuser.me/api/portraits/men/10.jpg",
      driverPhone: "+234 806 789 0123",
      crop: "Green Bell Peppers",
      quantity: "150kg",
      from: "Kaduna, Kaduna",
      to: "Ibadan, Oyo",
      price: "₦95,000",
      bidAmount: "₦90,000",
      status: "in-transit",
      statusCode: "transit",
      date: "2024-03-23",
      pickupDate: "2024-03-24",
      deliveryDate: "2024-03-26",
      description: "Fresh green bell peppers, crisp and premium quality.",
      image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400",
      tracking: {
        currentLocation: "Ogbomoso, Oyo",
        lastUpdate: "2024-03-24 10:15",
        estimatedArrival: "2024-03-26 14:00"
      }
    },
  ]);

  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const getStatusIcon = (status) => {
    switch(status) {
      case 'in-transit':
        return '🚚';
      case 'completed':
        return '✅';
      default:
        return '📦';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'in-transit':
        return 'In Transit';
      case 'pending':
        return 'Pending Pickup';
      case 'completed':
        return 'Completed';
      case 'delayed':
        return 'Delayed';
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'in-transit':
        return 'status-transit';
      case 'pending':
        return 'status-pending';
      case 'completed':
        return 'status-completed';
      case 'delayed':
        return 'status-delayed';
      default:
        return '';
    }
  };

  const filteredDeliveries = activeFilter === "all" 
    ? deliveries 
    : deliveries.filter(d => d.statusCode === activeFilter);


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

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button 
          className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All Deliveries
        </button>
        <button 
          className={`filter-tab ${activeFilter === 'transit' ? 'active' : ''}`}
          onClick={() => setActiveFilter('transit')}
        >
          🚚 In Transit
        </button>
        <button 
          className={`filter-tab ${activeFilter === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveFilter('completed')}
        >
          ✅ Completed
        </button>
      </div>

      {/* Deliveries Grid */}
      {filteredDeliveries.length === 0 ? (
        <div className="empty-deliveries">
          <div className="empty-icon">🚚</div>
          <h3>No Deliveries Found</h3>
          <p>You haven't accepted any produce deliveries yet</p>
          <button className="browse-btn">Browse Marketplace</button>
        </div>
      ) : (
        <div className="deliveries-grid">
          {filteredDeliveries.map((delivery) => (
            <div key={delivery.id} className="delivery-card">
              <div className="card-header">
                <div className="delivery-status">
                  <span className={`status-badge ${getStatusColor(delivery.statusCode)}`}>
                    {getStatusIcon(delivery.status)} {getStatusText(delivery.status)}
                  </span>
                </div>
              </div>

              <div className="card-content">
                <h3 className="crop-name">{delivery.crop}</h3>
                <div className="price-info">
                  <span className="price-label">Agreed Price:</span>
                  <span className="price-value">{delivery.bidAmount}</span>
                </div>

                {/* Farmer Info */}
                <div className="info-section">
                  <div className="info-title">📋 Produce Details</div>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-icon">📦</span>
                      <div>
                        <label>Quantity</label>
                        <p>{delivery.quantity}</p>
                      </div>
                    </div>
                    <div className="info-item">
                      <span className="info-icon">📍</span>
                      <div>
                        <label>From</label>
                        <p>{delivery.from}</p>
                      </div>
                    </div>
                    <div className="info-item">
                      <span className="info-icon">🎯</span>
                      <div>
                        <label>To</label>
                        <p>{delivery.to}</p>
                      </div>
                    </div>
                    <div className="info-item">
                      <span className="info-icon">📅</span>
                      <div>
                        <label>Pickup Date</label>
                        <p>{new Date(delivery.pickupDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Driver Info */}
                <div className="driver-section">
                  <div className="info-title">👨‍✈️ Driver Information</div>
                  <div className="driver-info">
                    <img src={delivery.driverAvatar} alt={delivery.driver} className="driver-avatar" />
                    <div className="driver-details">
                      <h4>{delivery.driver}</h4>
                      <p className="driver-phone">📞 {delivery.driverPhone}</p>
                    </div>
                    <button className="contact-btn">Contact Driver</button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="action-buttons">
                  <button className="action-btn details-btn">View/Track</button>
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