import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar';
import ViewDrivers from '../modals/ViewDrivers';

export default function MyProduce() {
  const [myProduce, setMyProduce] = useState([])
  const[showDriverList, setShowDriverList] = useState(false)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const fetchProduce = async() => {
        const res = await fetch("/api/v1/produce?role=farmer", {
          credentials: "include"
        })
        const data = await res.json()
        console.log(data.produce)
        setMyProduce(data.produce)
        // console.log(myProduce)
    }

    fetchProduce()
  }, [])

  const handleViewDrivers = (currentProduce) => {
    setSelected(currentProduce)
    setShowDriverList(true)
  }

  const handleClose = () => {
    setSelected(null)
    setShowDriverList(false)
  }
  

  return (
    <div className="wrapper">
        <Sidebar/>
        <main className="my-produce-container">
            <div className="produce-header">
                <div className="header-content">
                <h2>My Produce Listings</h2>
                <p>Manage and track all your agricultural produce listings</p>
                </div>
                <button className="add-produce-btn">
                <span>+</span> Add New Produce
                </button>
            </div>

            {myProduce.length === 0 ? (
                <div className="empty-state">
                <div className="empty-icon">🌾</div>
                <h3>No Produce Listed Yet</h3>
                <p>Start by adding your first produce listing</p>
                <button className="primary-btn">Add Produce</button>
                </div>
            ) : (
                <div className="produce-grid">
                {myProduce.map((produce) => (
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
                        <h3>{produce.crop_name}</h3>
                        {/* <p className="price">{produce.posted_at}</p> */}
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
                            <p>{produce.pickup_location}</p>
                            </div>
                        </div>
                        
                        <div className="detail-item">
                            <span className="detail-icon">🎯</span>
                            <div>
                            <label>To</label>
                            <p>{produce.destination}</p>
                            </div>
                        </div>
                        
                        <div className="detail-item">
                            <span className="detail-icon">📅</span>
                            <div>
                            <label>Posted Date</label>
                            <p>{produce.posted_at}</p>
                            </div>
                        </div>
                        </div>
                        
                        <div className="card-description">
                        <p>{produce.details}</p>
                        </div>
                        
                        <div className="card-actions">
                        <button className="action-btn view-btn" onClick={() => handleViewDrivers(produce)}>View Drivers</button>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            )}
        </main>
        {showDriverList && (
          <ViewDrivers data={selected} onClose={handleClose}/>
        )}
     </div>
  );
}