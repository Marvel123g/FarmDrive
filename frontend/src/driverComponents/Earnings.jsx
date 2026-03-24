import React, { useState } from 'react'
import DriverSidebar from '../components/DriverSidebar';

export default function Earnings() {
  const [withdrawAmount, setWithdrawAmount] = useState('');
   
  const [earnings] = useState({
    totalEarned: 342000,
    availableBalance: 127500,
    pendingBalance: 214500,
    thisMonth: 156000,
    lastMonth: 186000,
    totalDeliveries: 8
  });

  const [transactions, setTransactions] = useState([
    { id: 1, description: "Tomatoes Delivery - Lagos", amount: 82000, date: "2024-03-24", status: "completed", type: "credit" },
    { id: 2, description: "Onions Delivery - Abuja", amount: 115000, date: "2024-03-22", status: "pending", type: "credit" },
    { id: 3, description: "Sweet Potatoes - PH", amount: 60000, date: "2024-03-20", status: "completed", type: "credit" },
    { id: 5, description: "Bell Peppers - Ibadan", amount: 90000, date: "2024-03-23", status: "pending", type: "credit" },
    { id: 6, description: "Cabbage Delivery - Kano", amount: 42000, date: "2024-03-21", status: "completed", type: "credit" }
  ]);


  const formatAmount = (amount) => {
    return `₦${amount.toLocaleString()}`;
  };

  return (
    <div className="earnings_wrapper">
      <DriverSidebar/>
      <div className="earnings-container">
      <div className="earnings-header">
        <h2>My Earnings</h2>
        <p>Track your delivery earnings and withdrawals</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <span className="stat-icon">💰</span>
          <div>
            <h3>Total Earned</h3>
            <p>{formatAmount(earnings.totalEarned)}</p>
          </div>
        </div>
        <div className="stat-card warning">
          <span className="stat-icon">⏳</span>
          <div>
            <h3>Pending Payment</h3>
            <p>{formatAmount(earnings.pendingBalance)}</p>
          </div>
        </div>
        <div className="stat-card info">
          <span className="stat-icon">📦</span>
          <div>
            <h3>Deliveries</h3>
            <p>{earnings.totalDeliveries}</p>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="transactions-section">
        <h3>Transaction History</h3>
        <div className="transactions-list">
          {transactions.map(transaction => (
            <div key={transaction.id} className="transaction-item">
              <div className="transaction-info">
                <span className="transaction-icon">{transaction.type === 'credit' ? '📥' : '📤'}</span>
                <div>
                  <p className="transaction-desc">{transaction.description}</p>
                  <span className="transaction-date">{new Date(transaction.date).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="transaction-amount">
                <span className={transaction.type === 'credit' ? 'credit' : 'debit'}>
                  {transaction.type === 'credit' ? '+' : '-'} {formatAmount(transaction.amount)}
                </span>
                <span className={`transaction-status ${transaction.status}`}>
                  {transaction.status === 'completed' ? '✓' : '⏳'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
}