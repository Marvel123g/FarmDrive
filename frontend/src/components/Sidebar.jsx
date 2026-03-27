import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useWindowSize } from "../hook/useWindowSize";
import { FiMenu, FiX } from "react-icons/fi";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState('farmer-dashboard');
  const [isOpen, setIsOpen] = useState(false);
  
  const { width } = useWindowSize(); // Fixed: Destructured width
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
      case "/payments":
        setActiveButton('payments');
        break;
      case "/":
        setActiveButton('logout');
        break;
      default:
        setActiveButton('farmer-dashboard');
        break;
    }
  }, [location]);

  // Helper to handle navigation and close menu on mobile
  const handleNav = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle Button (Only shows on mobile) */}
      {isMobile && (
        <div className="sidebar-mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </div>
      )}

      <aside className={`sideBar ${isMobile ? 'mobile-nav' : ''} ${isOpen ? 'open' : ''}`}>
        <nav>
          <button className={activeButton === 'farmer-dashboard' ? 'active' : ''} onClick={() => handleNav('/farmer-dashboard')}>Dashboard</button>
          <button className={activeButton === 'post-produce' ? 'active' : ''} onClick={() => handleNav('/post-produce')}>Post Produce</button>
          <button className={activeButton === 'my-produce' ? 'active' : ''} onClick={() => handleNav('/my-produce')}>My Produce</button>
          <button className={activeButton === 'deliveries' ? 'active' : ''} onClick={() => handleNav('/deliveries')}>Deliveries</button>
          <button className={activeButton === 'payments' ? 'active' : ''} onClick={() => handleNav('/payments')}>Payments</button>
          <button className={activeButton === 'logout' ? 'active' : ''} onClick={() => handleNav('/')}>Logout</button>
        </nav>
      </aside>
    </>
  )
}