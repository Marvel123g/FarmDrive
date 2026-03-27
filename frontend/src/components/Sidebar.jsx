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
      case "/payments":
        setActiveButton('payments');
        break;
      case "/":
        setActiveButton('logout');
        break;
      default:
        setActiveButton('dashboard');
        break;
    }
  }, [location]);

  return (
    <>
      {/* 1. Only show the Menu icon on the main screen when closed */}
      {isMobile && !isOpen && (
        <div className="menu-toggle-icon" onClick={() => setIsOpen(true)} style={{position: 'fixed', top: '0px', right: '20px', zIndex: '10', cursor: 'pointer'}}>
          <FiMenu size={28} /> 
        </div>
      )}

      <aside className={`sideBar ${isMobile ? 'mobile-sidebar' : ''} ${isOpen ? 'open' : ''}`}>
          {/* 2. Show the Close icon INSIDE the sidebar when open */}
          {isMobile && isOpen && (
            <div className="close-sidebar" onClick={() => setIsOpen(false)} style={{alignSelf: 'flex-end', cursor: 'pointer', marginBottom: '20px'}}>
              <FiX size={28} color="#fff" />
            </div>
          )}

          <nav>
            <button className={activeButton === 'farmer-dashboard' ? 'active' : ''} onClick={() => {navigate('/farmer-dashboard'); setIsOpen(false);}}>Dashboard</button>
            <button className={activeButton === 'post-produce' ? 'active' : ''} onClick={() => {navigate('/post-produce'); setIsOpen(false);}}>Post Produce</button>
            <button className={activeButton === 'my-produce' ? 'active' : ''} onClick={() => {navigate('/my-produce'); setIsOpen(false);}}>My Produce</button>
            <button className={activeButton === 'deliveries' ? 'active' : ''} onClick={() => {navigate('/deliveries'); setIsOpen(false);}}>Deliveries</button>
            <button className={activeButton === 'payments' ? 'active' : ''} onClick={() => {navigate('/payments'); setIsOpen(false);}}>Payments</button>
            <button className={activeButton === 'logout' ? 'active' : ''} onClick={() => {navigate('/'); setIsOpen(false);}}>Logout</button>
          </nav>
      </aside>
    </>
  )
}