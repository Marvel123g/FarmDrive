import React from 'react'
import {
  FaShieldAlt,
  FaLeaf,
  FaChartLine,
} from "react-icons/fa";

export default function WhySection() {
  return (
    <>
        <section className="why-section">
        <h2>Why Farmers & Drivers ❤️ FarmDrive</h2>
        <div className="cards-grid">
          <div className="card">
            <FaLeaf className="card-icon" />
            <h3>Post Produce Easily</h3>
            <p>Farmers list their fresh produce available for delivery.</p>
          </div>
          <div className="card">
            <FaChartLine className="card-icon" />
            <h3>Smart Match & Bidding</h3>
            <p>Get best rates & fastest drivers driven through AI matching.</p>
          </div>
          <div className="card">
            <FaShieldAlt className="card-icon" />
            <h3>Safe & Secure</h3>
            <p>Drivers collect payment quickly and safely after delivery.</p>
          </div>
        </div>
      </section>
    </>
  )
}
