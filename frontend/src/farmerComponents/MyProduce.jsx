import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar';

export default function MyProduce() {
  // Demo data for produce listings
  const [produceListings, setProduceListings] = useState([
    {
      id: 1,
      crop: "Fresh Tomatoes",
      quantity: "250kg",
      from: "Jos, Plateau",
      to: "Lagos, Lagos",
      price: "₦85,000",
      status: "active",
      date: "2024-03-24",
      description: "Fresh organic tomatoes, harvested yesterday. Well packaged in crates.",
      image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200"
    },
    {
      id: 2,
      crop: "Organic Onions",
      quantity: "500kg",
      from: "Kano, Kano",
      to: "Abuja, FCT",
      price: "₦120,000",
      status: "in-transit",
      date: "2024-03-22",
      description: "Premium quality red onions, sun-dried and ready for delivery.",
      image: "https://images.unsplash.com/photo-1508747703725-719777637510?w=200"
    },
    {
      id: 3,
      crop: "Green Bell Peppers",
      quantity: "150kg",
      from: "Kaduna, Kaduna",
      to: "Ibadan, Oyo",
      price: "₦95,000",
      status: "active",
      date: "2024-03-23",
      description: "Fresh green bell peppers, crisp and premium quality.",
      image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=200"
    },
  ]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'active':
        return 'status-active';
      case 'in-transit':
        return 'status-transit';
      case 'completed':
        return 'status-completed';
      case 'pending':
        return 'status-pending';
      default:
        return '';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'active':
        return '🟢';
      case 'in-transit':
        return '🚚';
      case 'completed':
        return '✅';
      case 'pending':
        return '⏳';
      default:
        return '';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'active':
        return 'Active';
      case 'in-transit':
        return 'In Transit';
      case 'completed':
        return 'Completed';
      case 'pending':
        return 'Pending';
      default:
        return status;
    }
  };

  useEffect(() => {
    const fetchProduce = async() => {
        const res = await fetch("http://127.0.0.1:5000/api/v1/produce?role=farmer")
        const data = res.json()
        console.log(data)
    }

    fetchProduce()
  }, [])
  

  return (
    <div className="wrapper">
        <Sidebar/>
        <div className="my-produce-container">
            <div className="produce-header">
                <div className="header-content">
                <h2>My Produce Listings</h2>
                <p>Manage and track all your agricultural produce listings</p>
                </div>
                <button className="add-produce-btn">
                <span>+</span> Add New Produce
                </button>
            </div>

            {produceListings.length === 0 ? (
                <div className="empty-state">
                <div className="empty-icon">🌾</div>
                <h3>No Produce Listed Yet</h3>
                <p>Start by adding your first produce listing</p>
                <button className="primary-btn">Add Produce</button>
                </div>
            ) : (
                <div className="produce-grid">
                {produceListings.map((produce) => (
                    <div key={produce.id} className="produce-card">
                    {/* <div className="card-image">
                        <img src={produce.image} alt={produce.crop} />
                        <div className={`status-badge ${getStatusColor(produce.status)}`}>
                        <span>{getStatusIcon(produce.status)}</span>
                        {getStatusText(produce.status)}
                        </div>
                    </div> */}
                    
                    <div className="card-content">
                        <div className="card-header">
                        <h3>{produce.crop}</h3>
                        <p className="price">{produce.price}</p>
                        </div>
                        
                        <div className="card-details">
                        <div className="detail-item">
                            <span className="detail-icon">📦</span>
                            <div>
                            <label>Quantity</label>
                            <p>{produce.quantity}</p>
                            </div>
                        </div>
                        
                        <div className="detail-item">
                            <span className="detail-icon">📍</span>
                            <div>
                            <label>From</label>
                            <p>{produce.from}</p>
                            </div>
                        </div>
                        
                        <div className="detail-item">
                            <span className="detail-icon">🎯</span>
                            <div>
                            <label>To</label>
                            <p>{produce.to}</p>
                            </div>
                        </div>
                        
                        <div className="detail-item">
                            <span className="detail-icon">📅</span>
                            <div>
                            <label>Posted Date</label>
                            <p>{new Date(produce.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                        </div>
                        
                        <div className="card-description">
                        <p>{produce.description}</p>
                        </div>
                        
                        <div className="card-actions">
                        <button className="action-btn edit-btn">Edit</button>
                        <button className="action-btn view-btn">View Details</button>
                        <button className="action-btn delete-btn">Delete</button>
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