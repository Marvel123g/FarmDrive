import React, { useState } from 'react'
import Sidebar from '../components/Sidebar';

export default function Payment() {
  const [paymentDetails, setPaymentDetails] = useState({
    fullName: '',
    email: '',
    amount: '',
    phone: '',
    reference: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [recentPayments, setRecentPayments] = useState([
    {
      id: 1,
      farmer: "Musa Ibrahim",
      crop: "Fresh Tomatoes",
      amount: "₦85,000",
      date: "2024-03-20",
      status: "completed",
      reference: "PAY-20240320-001"
    },
    {
      id: 2,
      farmer: "Amina Bello",
      crop: "Organic Onions",
      amount: "₦115,000",
      date: "2024-03-18",
      status: "completed",
      reference: "PAY-20240318-002"
    },
    {
      id: 3,
      farmer: "John Okafor",
      crop: "Sweet Potatoes",
      amount: "₦60,000",
      date: "2024-03-15",
      status: "pending",
      reference: "PAY-20240315-003"
    }
  ]);

  const handleChange = (e) => {
    setPaymentDetails({
      ...paymentDetails,
      [e.target.name]: e.target.value
    });
  };

  const generateReference = () => {
    return `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!paymentDetails.fullName.trim()) {
      setPaymentError("Please enter your full name");
      setTimeout(() => setPaymentError(null), 3000);
      return;
    }
    
    if (!paymentDetails.email.trim() || !paymentDetails.email.includes('@')) {
      setPaymentError("Please enter a valid email address");
      setTimeout(() => setPaymentError(null), 3000);
      return;
    }
    
    if (!paymentDetails.amount || paymentDetails.amount <= 0) {
      setPaymentError("Please enter a valid amount");
      setTimeout(() => setPaymentError(null), 3000);
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      const newReference = generateReference();
      const newPayment = {
        id: recentPayments.length + 1,
        farmer: "Payment to Farmer",
        crop: "Produce Payment",
        amount: `₦${parseInt(paymentDetails.amount).toLocaleString()}`,
        date: new Date().toISOString().split('T')[0],
        status: "completed",
        reference: newReference
      };
      
      setRecentPayments([newPayment, ...recentPayments]);
      setPaymentSuccess({
        message: "Payment Successful!",
        reference: newReference,
        amount: paymentDetails.amount
      });
      
      // Reset form
      setPaymentDetails({
        fullName: '',
        email: '',
        amount: '',
        phone: '',
        reference: ''
      });
      
      setIsProcessing(false);
      
      // Clear success message after 5 seconds
      setTimeout(() => setPaymentSuccess(null), 5000);
    }, 2000);
  };

  const formatAmount = (amount) => {
    return `₦${parseInt(amount).toLocaleString()}`;
  };

  return (
   <div className="payment_Wrapper">
    <Sidebar/>
     <div className="payment-container">
      {/* Header Section */}
      <div className="payment-header">
        <div className="header-content">
          <div className="header-title">
            <h2>Make a Payment</h2>
            <p>Secure payment for your produce deliveries</p>
          </div>
          <div className="secure-badge">
            <span className="lock-icon">🔒</span>
            <span>Secure Payment</span>
          </div>
        </div>
      </div>

      <div className="payment-grid">
        {/* Payment Form Section */}
        <div className="payment-form-section">
          <div className="form-card">
            <h3>Payment Details</h3>
            
            {/* Success Message */}
            {paymentSuccess && (
              <div className="success-message">
                <div className="success-icon">✅</div>
                <div className="success-content">
                  <h4>{paymentSuccess.message}</h4>
                  <p>Reference: {paymentSuccess.reference}</p>
                  <p>Amount: ₦{parseInt(paymentSuccess.amount).toLocaleString()}</p>
                </div>
              </div>
            )}
            
            {/* Error Message */}
            {paymentError && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                <p>{paymentError}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {/* Full Name Field */}
              <div className="input-group">
                <label>
                  <span className="label-icon">👤</span>
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={paymentDetails.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              {/* Email Field */}
              <div className="input-group">
                <label>
                  <span className="label-icon">📧</span>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={paymentDetails.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              {/* Amount Field */}
              <div className="input-group amount-input">
                <label>
                  <span className="label-icon">💰</span>
                  Amount (NGN)
                </label>
                <div className="amount-wrapper">
                  <span className="currency-symbol">₦</span>
                  <input
                    type="number"
                    name="amount"
                    placeholder="Enter amount"
                    value={paymentDetails.amount}
                    onChange={handleChange}
                    required
                    min="100"
                    step="1000"
                  />
                </div>
              </div>
    
              
              {/* Payment Summary */}
              <div className="payment-summary">
                <h4>Payment Summary</h4>
                <div className="summary-row">
                  <span>Amount</span>
                  <span>{paymentDetails.amount ? `₦${parseInt(paymentDetails.amount).toLocaleString()}` : '₦0'}</span>
                </div>
                <div className="summary-row">
                  <span>Payment For</span>
                  <span>Crop Name</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>{paymentDetails.amount ? `₦${parseInt(paymentDetails.amount).toLocaleString()}` : '₦0'}</span>
                </div>
              </div>
              
              {/* Submit Button */}
              <button 
                type="submit" 
                className="submit-payment-btn"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span className="spinner"></span>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <span>💸</span>
                    Pay Now
                  </>
                )}
              </button>
              
              <p className="secure-note">
                <span>🔒</span> Your payment information is encrypted and secure
              </p>
            </form>
          </div>
        </div>
        
        {/* Recent Payments Section */}
        <div className="recent-payments-section">
          <div className="recent-card">
            <h3>Recent Transactions</h3>
            {recentPayments.length === 0 ? (
              <div className="empty-transactions">
                <span>📭</span>
                <p>No recent transactions</p>
              </div>
            ) : (
              <div className="transactions-list">
                {recentPayments.map((payment) => (
                  <div key={payment.id} className="transaction-item">
                    <div className="transaction-icon">
                      {payment.status === 'completed' ? '✅' : '⏳'}
                    </div>
                    <div className="transaction-details">
                      <div className="transaction-title">
                        <h4>{payment.farmer}</h4>
                        <span className={`transaction-status ${payment.status}`}>
                          {payment.status === 'completed' ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                      <p className="transaction-crop">{payment.crop}</p>
                      <p className="transaction-reference">{payment.reference}</p>
                      <p className="transaction-date">{new Date(payment.date).toLocaleDateString()}</p>
                    </div>
                    <div className="transaction-amount">
                      <strong>{payment.amount}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
   </div>
  );
}