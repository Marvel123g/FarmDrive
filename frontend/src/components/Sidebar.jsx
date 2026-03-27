import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useWindowSize } from '../hook/useWindowSize';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState('farmer-dashboard');

  const { width } = useWindowSize();
  const isMobile = width <= 883;

  useEffect(() => {
    const path = location.pathname;
    if (path === '/farmer-dashboard') setActiveButton('farmer-dashboard');
    else if (path === '/post-produce') setActiveButton('post-produce');
    else if (path === '/my-produce') setActiveButton('my-produce');
    else if (path === '/deliveries') setActiveButton('deliveries');
    else if (path === '/payments') setActiveButton('payments');
    else if (path === '/') setActiveButton('logout');
    else setActiveButton('dashboard');
  }, [location]);

  return (
    <aside className={`sideBar ${isMobile ? 'mobile-nav' : 'desktop-sidebar'}`}>
        <nav>
          <button className={activeButton === 'farmer-dashboard' ? 'active' : ''} onClick={() => navigate('/farmer-dashboard')}>Dashboard</button>
          <button className={activeButton === 'post-produce' ? 'active' : ''} onClick={() => navigate('/post-produce')}>Post</button>
          <button className={activeButton === 'my-produce' ? 'active' : ''} onClick={() => navigate('/my-produce')}>Produce</button>
          <button className={activeButton === 'deliveries' ? 'active' : ''} onClick={() => navigate('/deliveries')}>Deliveries</button>
          <button className={activeButton === 'payments' ? 'active' : ''} onClick={() => navigate('/payments')}>Payments</button>
          <button className={activeButton === 'logout' ? 'active' : ''} onClick={() => navigate('/')}>Logout</button>
        </nav>
    </aside>
  )
}