import React, { useEffect, useState } from 'react'
import DriverSidebar from '../components/DriverSidebar';

export default function Marketplace() {

  const [produceList, setProduceList] = useState([])
  const [driverPrice, setDriverPrice] = useState({})
  const [driverLocation, setDriverLocation] = useState({lat: null, lng: null})
  const [showInputField, setShowInputField] = useState({})


  useEffect(() => {
    const fetchProduce = async() => {
        const res = await fetch("/api/v1/produce?role=driver", {
          credentials: "include"
        })
        const data = await res.json()

        console.log(data.produce)
        setProduceList(data.produce)
    }
    fetchProduce()
  }, [])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setDriverLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        })
      })
    }
  }, [])
  

  const handleSubmit = async(produceId) => {
    const price = driverPrice[produceId]
    const res = await fetch("/api/v1/price", {
      method: "POST",
      headers: {"Content-Type" : "application/json"},
      body: JSON.stringify({  priceDetails: {
        produce_id: produceId,
        price: price
      }, "driverLocation": driverLocation}),
      credentials: "include"
    })
    const data = await res.json()
     if(data.code === 201){
          alert(data.message)
        }

    console.log({price, driverLocation})
    console.log(data)
  }
  
  const toggleInputField = (id) => {
    setShowInputField({
      ...showInputField,
      [id]: !showInputField[id]
    });
  };

  const handlePriceChange = (id, value) => {
    setDriverPrice(prev => ({
      ...prev,
      [id]: value
    }));
  };

  return (
   <div className="marketPlace_wrapper">
    <DriverSidebar/>
     <div className="marketplace-container">
      {/* Header Section */}
      <div className="marketplace-header">
        <div className="header-content">
          <div className="header-title">
            <h2>Fresh Produce Marketplace</h2>
            <p>Connect directly with farmers and get the best prices</p>
          </div>
          <div className="stats-summary">
            <div className="stat-badge">
              <span className="stat-icon">🌾</span>
              <span>{produceList.length} Listings Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Produce Grid */}
      {produceList?.length === 0 ? (
        <div className="empty-marketplace">
          <div className="empty-icon">🌱</div>
          <h3>No Produce Available</h3>
          <p>Check back later for fresh produce listings</p>
        </div>
      ) : (
        <div className="marketplace-grid">
          {produceList?.map((produce) => (
            <div key={produce.id} className="produce-card">
              <div >
                <div className="availability-badge">Available Now</div>
              </div>
              
              <div className="card-content">
                <div className="farmer-info">
                    <h4 className="farmer-name">{produce.farmer_name}</h4>
                </div>

                <h3 className="crop-name">{produce.crop_name}</h3>
                
                <div className="card-details">
                  <div className="detail-row">
                    <div className="detail-item">
                      <span className="detail-icon">📦</span>
                      <span>{produce.quantity}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">📍</span>
                      <span>{produce.pickup_location}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">🎯</span>
                      <span>{produce.destination}</span>
                    </div>
                  </div>
                </div>

                <div className="card-description">
                  <p>{produce.details}</p>
                </div>


                <div className="bid-section">
                  {!showInputField[produce.id] ? (
                    <button 
                      className="bid-btn"
                      onClick={() => toggleInputField(produce.id)}
                    >
                      💰 Make Offer
                    </button>
                  ) : (
                    <div className="bid-input-container">
                      <div className="bid-input-group">
                        <span className="currency">₦</span>
                        <input
                          type="number"
                          placeholder="Enter your offer"
                          value={driverPrice[produce.id] || ""}
                          onChange={(e) => handlePriceChange(produce.id, e.target.value)}
                          className="bid-input"
                          autoFocus
                        />
                      </div>
                      <div className="bid-actions">
                        <button 
                          className="submit-bid-btn"
                          onClick={() => handleSubmit(produce.id)}
                        >
                          Submit
                        </button>
                        <button 
                          className="cancel-bid-btn"
                          onClick={() => toggleInputField(produce.id)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
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