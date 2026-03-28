import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useWindowSize } from "../hook/useWindowSize"; 
import { FiMenu } from "react-icons/fi";

export default function DriverSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState('driver-dashboard');
  const [isOpen, setIsOpen] = useState(false);
  
  const { width } = useWindowSize(); 
  const isMobile = width <= 600;

  useEffect(() => {
    switch (location.pathname) {
      case "/driver-dashboard":
        setActiveButton('driver-dashboard');
        break;
      case "/marketplace":
        setActiveButton('marketplace');
        break;
      case "/driver-deliveries":
        setActiveButton('driver-deliveries');
        break;
      case "/earnings":
        setActiveButton('earnings');
        break;
      case "/":
        setActiveButton('logout');
        break;
      default:
        setActiveButton('driver-dashboard');
        break;
    }
  }, [location]);

  // Helper to handle navigation and close menu on mobile
  const handleNav = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    const url = "/api/v1/driver/auth/logout";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include" 
      });

      if (res.status === 200) {
        navigate("/");
        setIsOpen(false); 
      } else {
        const data = await res.json();
        console.error("Logout failed:", data.message);
      }
    } catch (err) {
      console.error("Network error during logout:", err);
    }
  };

  return (
    <>
      {/* Menu icon shows only on mobile when the sidebar is closed */}
      {isMobile && !isOpen && (
        <div 
          className="menu-toggle-icon" 
          onClick={() => setIsOpen(true)} 
          style={{position: 'fixed', top: '20px', right: '20px', zIndex: '10', cursor: 'pointer'}}
        >
          <FiMenu size={28} /> 
        </div>
      )}

      {/* Close overlay for mobile when menu is open */}
      {isMobile && isOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setIsOpen(false)}
          style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.2)', zIndex: '9'}}
        />
      )}

      <aside className={`sideBar ${isMobile ? 'mobile-nav' : ''} ${isOpen ? 'open' : ''}`}>
        <nav>
          <button 
            className={activeButton === 'driver-dashboard' ? 'active' : ''} 
            onClick={() => handleNav('/driver-dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={activeButton === 'marketplace' ? 'active' : ''} 
            onClick={() => handleNav('/marketplace')}
          >
            Marketplace
          </button>
          <button 
            className={activeButton === 'driver-deliveries' ? 'active' : ''} 
            onClick={() => handleNav('/driver-deliveries')}
          >
            My Deliveries
          </button>
          <button 
            className={activeButton === 'earnings' ? 'active' : ''} 
            onClick={() => handleNav('/earnings')}
          >
            Earnings
          </button>
          <button 
            className={activeButton === 'logout' ? 'active' : ''} 
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>
      </aside>
    </>
  );
}
