import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState('farmer-dashboard');
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
      default:
        setActiveButton('dashboard');
        break;
    }
  }, [location]);
  return (
    <aside className='sideBar'>
        <nav>
          <button className={activeButton === 'farmer-dashboard' ? 'active' : ''} onClick={() => navigate('/farmer-dashboard')}>Dashboard</button>
          <button className={activeButton === 'post-produce' ? 'active' : ''} onClick={() => navigate('/post-produce')}>Post Produce</button>
          <button className={activeButton === 'my-produce' ? 'active' : ''} onClick={() => navigate('/my-produce')}>My Produce</button>
          <button className={activeButton === 'deliveries' ? 'active' : ''} onClick={() => navigate('/deliveries')}>Deliveries</button>
          <button className={activeButton === 'payments' ? 'active' : ''} onClick={() => navigate('/payments')}>Payments</button>
        </nav>
    </aside>
  )
}
