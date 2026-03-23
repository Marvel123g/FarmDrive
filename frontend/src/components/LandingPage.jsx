import React,{useState} from "react";
import {
  FaCheckCircle,
  FaShieldAlt,
  FaLeaf,
  FaClock,
  FaChartLine,
} from "react-icons/fa";
import AuthModal from "../modals/AuthModal";
import Testimony from "../HomePageComponents/Testimony";
import FAQ from "../HomePageComponents/FAQ";

export default function LandingPage() {

  const [role, setRole] = useState(null);

  const heroImageUrl =
    "https://images.unsplash.com/photo-1464226184884-fa280b87c399?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";

  return (
    <div className="landing-page">
      
      <section
        className="hero-section"
        style={{ backgroundImage: `url(${heroImageUrl})` }}
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


      <section className="how-section">
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


      <Testimony />


      <FAQ />

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
    </div>
  );
}