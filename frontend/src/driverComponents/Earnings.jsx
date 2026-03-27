import React, { useState, useEffect } from "react";
import DriverSidebar from "../components/DriverSidebar";

export default function Earnings() {
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [earning, setEarning] = useState([]);

  const [earnings] = useState({
    totalEarned: 342000,
    availableBalance: 127500,
    pendingBalance: 214500,
    thisMonth: 156000,
    lastMonth: 186000,
    totalDeliveries: 8,
  });

  const [transactions, setTransactions] = useState([
    {
      id: 1,
      description: "Tomatoes Delivery - Lagos",
      amount: 82000,
      date: "2024-03-24",
      status: "completed",
      type: "credit",
    },
    {
      id: 2,
      description: "Onions Delivery - Abuja",
      amount: 115000,
      date: "2024-03-22",
      status: "pending",
      type: "credit",
    },
    {
      id: 3,
      description: "Sweet Potatoes - PH",
      amount: 60000,
      date: "2024-03-20",
      status: "completed",
      type: "credit",
    },
    {
      id: 5,
      description: "Bell Peppers - Ibadan",
      amount: 90000,
      date: "2024-03-23",
      status: "pending",
      type: "credit",
    },
    {
      id: 6,
      description: "Cabbage Delivery - Kano",
      amount: 42000,
      date: "2024-03-21",
      status: "completed",
      type: "credit",
    },
  ]);

  const formatAmount = (amount) => {
    return `₦${amount.toLocaleString()}`;
  };

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch("/api/v1/driver/stats", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      console.log(data.data);
      setEarning(data.data);
    };

    fetchStats();
  }, []);

  const [bid, setBid] = useState([]);

  useEffect(() => {
    const fetchBids = async () => {
      const res = await fetch("/api/v1/produce/bids", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      console.log(data.bids);
      setBid(data.bids);
    };

    fetchBids();
  }, []);

  return (
    <div className="earnings_wrapper">
      <DriverSidebar />
      <div className="earnings-container">
        <div className="earnings-header">
          <h2>My Earnings</h2>
          <p>Track your delivery earnings</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card primary">
            <span className="stat-icon">💰</span>
            <div>
              <h3>Total Earned</h3>
              <p>₦{earning.total_earned_naira}</p>
            </div>
          </div>
          <div className="stat-card warning">
            <span className="stat-icon">⏳</span>
            <div>
              <h3>Pending Payment</h3>
              <p>{earning.awaiting_payment_naira}</p>
            </div>
          </div>
          <div className="stat-card info">
            <span className="stat-icon">📦</span>
            <div>
              <h3>Deliveries</h3>
              <p>{earning.total_deliveries}</p>
            </div>
          </div>
        </div>

        <main className="bid_section">
          <div className="header-title">
            <h2>Produce History</h2>
          </div>
          <div className="mini_container">
            {bid.map((item) => (
              <div className="bid_card" key={item.id}>
                <div className="info">
                  <div>
                    <h4 className="name">{item.farmer_name}</h4>
                    <p className="posted_at">Posted at {item.posted_at}</p>
                  </div>
                  <button className="status">{item.status}</button>
                </div>
                <div className="bid_footer">
                  <div className="detail-row">
                    <div className="detail-item">
                      <span>From: {item.pickup_location}</span>
                    </div>
                    <div className="detail-item">
                      <span>To: {item.destination}</span>
                    </div>
                  </div>
                  <div className="amount">₦{item.price}</div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
