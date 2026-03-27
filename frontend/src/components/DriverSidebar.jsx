import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useWindowSize } from '../hook/useWindowSize';

export default function DriverSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState('driver-dashboard');

  const { width } = useWindowSize();
  const isMobile = width <= 883;

  useEffect(() => {
    const path = location.pathname;
    if (path === '/driver-dashboard') setActiveButton('driver-dashboard');
    else if (path === '/marketplace') setActiveButton('marketplace');
    else if (path === '/driver-deliveries') setActiveButton('driver-deliveries');
    else if (path === '/earnings') setActiveButton('earnings');
    else if (path === '/') setActiveButton('logout');
  }, [location]);

  return (
    <aside className={`sideBar ${isMobile ? 'mobile-nav' : 'desktop-sidebar'}`}>
        <nav>
          <button className={activeButton === 'driver-dashboard' ? 'active' : ''} onClick={() => navigate('/driver-dashboard')}>Dashboard</button>
          <button className={activeButton === 'marketplace' ? 'active' : ''} onClick={() => navigate('/marketplace')}>Marketplace</button>
          <button className={activeButton === 'driver-deliveries' ? 'active' : ''} onClick={() => navigate('/driver-deliveries')}>Deliveries</button>
          <button className={activeButton === 'earnings' ? 'active' : ''} onClick={() => navigate('/earnings')}>Earnings</button>
          <button className={activeButton === 'logout' ? 'active' : ''} onClick={() => navigate('/')}>Logout</button>
        </nav>
    </aside>
  )
}