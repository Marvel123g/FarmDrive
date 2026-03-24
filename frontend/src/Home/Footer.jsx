
import React, { useState }  from 'react'
import AuthModal from '../modals/AuthModal'

export default function Footer({role, setRole}) {
    //  
  return (
    <>
        
      <section className="cta-section">
        <h2>Ready to Move Your Produce Faster?</h2>
        <p>Join 10,000+ farmers & drivers already delivering better with FarmRelay</p>
        <div className="cta-buttons">
          <button className="btn btn-light" onClick={() => setRole("farmer")}>🚜 I'm a Farmer - Get Started</button>
          <button className="btn btn-outline" onClick={() => setRole("driver")}>🚚 I'm a Driver - Join Now</button>
        </div>
        <p className="cta-note">Free to join · No Setup Fees · Instant Draft · Built for Speed</p>
      </section>


      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-col">
            <h4>🛒 FarmDrive</h4>
            <p>Bringing Farmers & Drivers for Efficient Delivery</p>
          </div>
          <div className="footer-col">
            <h4>Platform</h4>
            <a href="#">How It Works</a>
            <a href="#">For Farmers</a>
            <a href="#">For Drivers</a>
            <a href="#">Safety</a>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Contact</a>
            <a href="#">Blog</a>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Driver Guidelines</a>
          </div>
        </div>
        <hr />
        <p>© {new Date().getFullYear()} FarmRelay. All rights reserved.</p>
      </footer>

      {role && <AuthModal type={role} onClose={() => setRole(null)} />}
    </>
  )
}
