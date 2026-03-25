import React, { useEffect, useState } from 'react'
import DriverSidebar from '../components/DriverSidebar';

export default function Marketplace() {
  const [produceListings, setProduceListings] = useState([
    {
      id: 1,
      farmer: "Musa Ibrahim",
      farmerAvatar: "https://randomuser.me/api/portraits/men/1.jpg",
      crop: "Fresh Tomatoes",
      quantity: "250kg",
      from: "Jos, Plateau",
      to: "Lagos, Lagos",
      price: "₦85,000",
      status: "available",
      date: "2024-03-24",
      description: "Fresh organic tomatoes, harvested yesterday. Well packaged in crates.",
      image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400",
      ratings: 4.8,
      deliveries: 23
    },
    {
      id: 2,
      farmer: "Amina Bello",
      farmerAvatar: "https://randomuser.me/api/portraits/women/2.jpg",
      crop: "Organic Onions",
      quantity: "500kg",
      from: "Kano, Kano",
      to: "Abuja, FCT",
      price: "₦120,000",
      status: "available",
      date: "2024-03-22",
      description: "Premium quality red onions, sun-dried and ready for delivery.",
      image: "https://images.unsplash.com/photo-1508747703725-719777637510?w=400",
      ratings: 4.9,
      deliveries: 45
    },
    {
      id: 3,
      farmer: "John Okafor",
      farmerAvatar: "https://randomuser.me/api/portraits/men/3.jpg",
      crop: "Sweet Potatoes",
      quantity: "300kg",
      from: "Benue, Benue",
      to: "Port Harcourt, Rivers",
      price: "₦65,000",
      status: "available",
      date: "2024-03-20",
      description: "Freshly harvested sweet potatoes, carefully sorted.",
      image: "https://images.unsplash.com/photo-1596097635121-14a2b5b7e7b8?w=400",
      ratings: 4.7,
      deliveries: 18
    },
    {
      id: 4,
      farmer: "Grace Mensah",
      farmerAvatar: "https://randomuser.me/api/portraits/women/4.jpg",
      crop: "Green Bell Peppers",
      quantity: "150kg",
      from: "Kaduna, Kaduna",
      to: "Ibadan, Oyo",
      price: "₦95,000",
      status: "available",
      date: "2024-03-23",
      description: "Fresh green bell peppers, crisp and premium quality.",
      image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400",
      ratings: 4.9,
      deliveries: 31
    },
    {
      id: 5,
      farmer: "Emeka Nwosu",
      farmerAvatar: "https://randomuser.me/api/portraits/men/5.jpg",
      crop: "Cassava Tubers",
      quantity: "1000kg",
      from: "Oyo, Oyo",
      to: "Lagos, Lagos",
      price: "₦180,000",
      status: "available",
      date: "2024-03-21",
      description: "High-quality cassava tubers, suitable for processing.",
      image: "https://images.unsplash.com/photo-1596097635121-14a2b5b7e7b8?w=400",
      ratings: 4.6,
      deliveries: 12
    },
    {
      id: 6,
      farmer: "Fatima Suleiman",
      farmerAvatar: "https://randomuser.me/api/portraits/women/6.jpg",
      crop: "Fresh Cabbage",
      quantity: "200kg",
      from: "Jos, Plateau",
      to: "Kano, Kano",
      price: "₦45,000",
      status: "available",
      date: "2024-03-24",
      description: "Crisp and fresh cabbage, perfect for salads and cooking.",
      image: "https://images.unsplash.com/photo-1594282486551-05bec4b3b49d?w=400",
      ratings: 4.8,
      deliveries: 27
    }
  ]);

  const [bidAmounts, setBidAmounts] = useState({});
  const [showBidInput, setShowBidInput] = useState({});
  const [successMessage, setSuccessMessage] = useState(null);
  const [produceList, setProduceList] = useState({})


  useEffect(() => {
    const fetchProduce = async() => {
        const res = await fetch("http://127.0.0.1:5000/api/v1/produce?role=driver", {
          credentials: "include"
        })
        const data = await res.json()

        console.log(data)
    }


    fetchProduce()
  }, [])
  

  const handleBidChange = (id, value) => {
    setBidAmounts({
      ...bidAmounts,
      [id]: value
    });
  };
  

  const handleBidSubmit = (produce) => {
    const bidAmount = bidAmounts[produce.id];
    if (!bidAmount || bidAmount <= 0) {
      alert("Please enter a valid bid amount");
      return;
    }
    
    console.log(`Bid placed: ${bidAmount} for ${produce.crop}`);
    setSuccessMessage(`✅ Bid of ${bidAmount} placed for ${produce.crop}!`);
    setTimeout(() => setSuccessMessage(null), 3000);
    
    // Reset bid input
    setBidAmounts({
      ...bidAmounts,
      [produce.id]: ''
    });
    setShowBidInput({
      ...showBidInput,
      [produce.id]: false
    });
  };

  const toggleBidInput = (id) => {
    setShowBidInput({
      ...showBidInput,
      [id]: !showBidInput[id]
    });
  };

  const formatPrice = (price) => {
    return price;
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
              <span>{produceListings.length} Listings Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Produce Grid */}
      {produceListings.length === 0 ? (
        <div className="empty-marketplace">
          <div className="empty-icon">🌱</div>
          <h3>No Produce Available</h3>
          <p>Check back later for fresh produce listings</p>
        </div>
      ) : (
        <div className="marketplace-grid">
          {produceListings.map((produce) => (
            <div key={produce.id} className="produce-card">
              <div >
                {/* <img src={produce.image} alt={produce.crop} /> */}
                <div className="availability-badge">Available Now</div>
              </div>
              
              <div className="card-content">
                <div className="farmer-info">
                    <h4 className="farmer-name">{produce.farmer}</h4>
                </div>

                <h3 className="crop-name">{produce.crop}</h3>
                
                <div className="card-details">
                  <div className="detail-row">
                    <div className="detail-item">
                      <span className="detail-icon">📦</span>
                      <span>{produce.quantity}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">📍</span>
                      <span>{produce.from}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">🎯</span>
                      <span>{produce.to}</span>
                    </div>
                  </div>
                </div>

                <div className="card-description">
                  <p>{produce.description}</p>
                </div>

                {/* Bid Section */}
                <div className="bid-section">
                  {!showBidInput[produce.id] ? (
                    <button 
                      className="bid-btn"
                      onClick={() => toggleBidInput(produce.id)}
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
                          value={bidAmounts[produce.id] || ''}
                          onChange={(e) => handleBidChange(produce.id, e.target.value)}
                          className="bid-input"
                          autoFocus
                        />
                      </div>
                      <div className="bid-actions">
                        <button 
                          className="submit-bid-btn"
                          onClick={() => handleBidSubmit(produce)}
                        >
                          Submit
                        </button>
                        <button 
                          className="cancel-bid-btn"
                          onClick={() => toggleBidInput(produce.id)}
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