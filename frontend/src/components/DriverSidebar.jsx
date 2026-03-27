import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

export default function DriverSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState('driver-dashboard');
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
  return (
    <aside className='sideBar'>
        <nav>
          <button className={activeButton === 'driver-dashboard' ? 'active' : ''} onClick={() => navigate('/driver-dashboard')}>Dashboard</button>
          <button className={activeButton === 'marketplace' ? 'active' : ''} onClick={() => navigate('/marketplace')}>Marketplace</button>
          <button className={activeButton === 'driver-deliveries' ? 'active' : ''} onClick={() => navigate('/driver-deliveries')}>My Deliveries</button>
          <button className={activeButton === 'earnings' ? 'active' : ''} onClick={() => navigate('/earnings')}>Earnings</button>
          <button className={activeButton === 'logout' ? 'active' : ''} onClick={() => navigate('/')}>Logout</button>
        </nav>
    </aside>
  )
}