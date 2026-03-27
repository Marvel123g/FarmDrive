// import { useState } from "react";

// export default function Payment({ isOpen, onClose }) {
//   const [amount, setAmount] = useState("");

//   if (!isOpen) return null;

//   const makePayment = () => {
//     const ref = "TXN_" + Date.now();
//     const amountInKobo = Math.round(Number(amount) * 100);

//     window.webpayCheckout({
//       merchant_code: "MX6072",
//       pay_item_id: "9405967",
//       txn_ref: ref,
//       amount: amountInKobo,
//       currency: 566,
//       site_redirect_url: window.location.href,
//       mode: "TEST",

//       onComplete: (res) => {
//         if (res?.resp === "00") {
//           alert("✅ Payment Successful");
//           onClose();
//         } else {
//           alert("❌ Payment Failed");
//         }
//       },
//     });
//   };

//   return (
//     <div className="paymentModal_overlay" onClick={onClose}>
//       <div
//         className="paymentModal_card"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <button className="close_btn" onClick={onClose}>
//           ✕
//         </button>

//         <h2>Make Payment</h2>
//         <p className="subtitle">Secure checkout for your delivery</p>

//         <div className="input_group">
//           <label>Amount</label>

//           <div className="amount_input">
//             <span>₦</span>
//             <input
//               type="number"
//               placeholder="Enter amount"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//             />
//           </div>
//         </div>

//         <button className="pay_btn" onClick={makePayment}>
//           💳 Pay Now
//         </button>

//         <p className="secure_note">🔒 Secured by Interswitch</p>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import these!

export default function Payment() {
  // 1. Get the ID from the URL (/payment/DEL-123)
  const { deliveryId } = useParams(); 
  const navigate = useNavigate();

  const [deliveryData, setDeliveryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 2. Fetch data immediately since the page just loaded
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/pay/${deliveryId}`, {
          method: "GET",
          credentials: "include",
        });
        const result = await res.json();
        if (result.status === "SUCCESS") {
          setDeliveryData(result.data);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError("Network error: Failed to load details.");
      } finally {
        setLoading(false);
      }
    };

    if (deliveryId) fetchDetails();
  }, [deliveryId]);

  // 3. UI logic
  return (
    <div className="payment-page-container">
      <div className="payment-card">
        <h3>Confirm Payment</h3>
        {/* Navigation back instead of just closing a modal */}
        <button onClick={() => navigate(-1)}>Back to Dashboard</button>

        {loading ? (
          <p>Loading proof of delivery...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : (
          <div className="payment-details">
            <p><strong>Status:</strong> {deliveryData?.status}</p>
            <p><strong>Completed:</strong> {deliveryData?.date}</p>
            
            <div className="proof-images">
              <img src={deliveryData?.image_one} alt="Proof 1" style={{width: '200px'}} />
              <img src={deliveryData?.image_two} alt="Proof 2" style={{width: '200px'}} />
            </div>

            <div className="payment-summary">
              <h4>Total Due: ₦{deliveryData?.price?.toLocaleString()}</h4>
              <button className="pay-now-btn">Pay Driver Now</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
