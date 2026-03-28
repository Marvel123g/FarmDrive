import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useWindowSize } from "../hook/useWindowSize";
import { FiMenu, FiX } from "react-icons/fi";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState('farmer-dashboard');
  const [isOpen, setIsOpen] = useState(false);
  
  const { width } = useWindowSize(); 
  const isMobile = width <= 600;

  useEffect(() => {
      switch (location.pathname) {
      case "/farmer-dashboard":
        setActiveButton('farmer-dashboard');
        break;
      case "/post-produce":
        setActiveButton('post-produce');
        break;
      case "/my-produce":
        setActiveButton('my-produce');
        break;
      case "/deliveries":
        setActiveButton('deliveries');
        break;
      case "/":
        setActiveButton('logout');
        break;
      default:
        setActiveButton('dashboard');
        break;
    }
  }, [location]);

  // Helper to handle navigation and close menu on mobile
  const handleNav = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    // 1. Set the correct endpoint
    const url = "/api/v1/farmer/auth/logout";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include" // REQUIRED to send the cookie to Flask
      });

      const data = await res.json();

      if (res.status === 200) {
        // 2. Redirect to the correct login page
        navigate("/");
        setIsOpen(false); 
      } else {
        console.error("Logout failed:", data.message);
      }
    } catch (err) {
      console.error("Network error during logout:", err);
    }
  };

  return (
    <>
      {/* 1. Only show the Menu icon on the main screen when closed */}
      {isMobile && !isOpen && (
        <div className="menu-toggle-icon" onClick={() => setIsOpen(true)} style={{position: 'fixed', top: '0px', right: '20px', zIndex: '10', cursor: 'pointer'}}>
          <FiMenu size={28} /> 
        </div>
      )}

      <aside className={`sideBar ${isMobile ? 'mobile-nav' : ''} ${isOpen ? 'open' : ''}`}>
        <nav>
          <button className={activeButton === 'farmer-dashboard' ? 'active' : ''} onClick={() => handleNav('/farmer-dashboard')}>Dashboard</button>
          <button className={activeButton === 'post-produce' ? 'active' : ''} onClick={() => handleNav('/post-produce')}>Post Produce</button>
          <button className={activeButton === 'my-produce' ? 'active' : ''} onClick={() => handleNav('/my-produce')}>My Produce</button>
          <button className={activeButton === 'deliveries' ? 'active' : ''} onClick={() => handleNav('/deliveries')}>Deliveries</button>
          <button className={activeButton === 'logout' ? 'active' : ''} onClick={() => handleLogout}>Logout</button>
        </nav>
      </aside>
    </>
  )
}