import React from 'react'

export default function HowSection() {
  return (
    <>
        <section className="how-section" id='howItWorks'>
        <h2>How It Works</h2>
        <div className="steps-grid">
          <div className="step">
            <div className="step-number">1️⃣</div>
            <h3>Farmers List Produce</h3>
            <p>Farmers list their fresh produce available for delivery.</p>
          </div>
          <div className="step">
            <div className="step-number">2️⃣</div>
            <h3>Drivers Place Bids</h3>
            <p>
              Nearby verified drivers send offers while Farmers choose the
              best.
            </p>
          </div>
          <div className="step">
            <div className="step-number">3️⃣</div>
            <h3>Safe & Fast Delivery</h3>
            <p>Drivers collect and deliver produce safely.</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat">
            <h3>10K+</h3>
            <p>Verified Drivers</p>
          </div>
          <div className="stat">
            <h3>50K+</h3>
            <p>Deliveries/Month</p>
          </div>
          <div className="stat">
            <h3>98%</h3>
            <p>On-Time Rate</p>
          </div>
        </div>
      </section>
    </>
  )
}
