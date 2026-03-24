import React from 'react'
import {
  FaCheckCircle,
  FaShieldAlt,
  FaLeaf,
  FaClock,
  FaChartLine,
} from "react-icons/fa";

export default function Hero({setRole}) {
    const heroImageUrl =
    "https://images.unsplash.com/photo-1464226184884-fa280b87c399?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";

  return (
    <>
        <section
            className="hero-section"
            style={{ backgroundImage: `url(${heroImageUrl})` }}
            id='hero'
            >
            <div className="hero-overlay"></div>
            <div className="hero-content">
                <h1>The Fast Lane for Farm Deliveries</h1>
                <p>
                Connect with verified drivers • Get fair prices • Deliver fresh
                produce — fast safely.
                </p>
                <div className="hero-buttons">
                <button className="btn btn-primary" onClick={() => setRole("farmer")}>
                    Join as a Farmer
                </button>
                <button className="btn btn-outline" onClick={() => setRole("driver")}>
                    Join as a Driver
                </button>
                </div>
                <div className="hero-features">
                <div className="feature">
                    <FaCheckCircle className="icon" />
                    <span>KYC Verified Drivers</span>
                </div>
                <div className="feature">
                    <FaClock className="icon" />
                    <span>Same-Day Delivery</span>
                </div>
                <div className="feature">
                    <FaShieldAlt className="icon" />
                    <span>100% Secure Payments</span>
                </div>
                </div>
            </div>
            </section>
    </>
  )
}
