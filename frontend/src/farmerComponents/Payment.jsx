import { useState } from "react";

export default function Payment({ isOpen, onClose }) {
  const [amount, setAmount] = useState("");

  if (!isOpen) return null;

  const makePayment = () => {
    const ref = "TXN_" + Date.now();
    const amountInKobo = Math.round(Number(amount) * 100);

    window.webpayCheckout({
      merchant_code: "MX6072",
      pay_item_id: "9405967",
      txn_ref: ref,
      amount: amountInKobo,
      currency: 566,
      site_redirect_url: window.location.href,
      mode: "TEST",

      onComplete: (res) => {
        if (res?.resp === "00") {
          alert("✅ Payment Successful");
          onClose();
        } else {
          alert("❌ Payment Failed");
        }
      },
    });
  };

  return (
    <div className="paymentModal_overlay" onClick={onClose}>
      <div
        className="paymentModal_card"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close_btn" onClick={onClose}>
          ✕
        </button>

        <h2>Make Payment</h2>
        <p className="subtitle">Secure checkout for your delivery</p>

        <div className="input_group">
          <label>Amount</label>

          <div className="amount_input">
            <span>₦</span>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>

        <button className="pay_btn" onClick={makePayment}>
          💳 Pay Now
        </button>

        <p className="secure_note">🔒 Secured by Interswitch</p>
      </div>
    </div>
  );
}