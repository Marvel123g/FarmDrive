import React, { useState } from "react";
import ChoiceModal from "../modals/ChoiceModal";
import AuthModal from "../modals/AuthModal";
import { useWindowSize } from "../hook/useWindowSize";
import { FiMenu, FiX } from "react-icons/fi";

export default function NavBar() {
  const [showChoice, setShowChoice] = useState(false);
  const [role, setRole] = useState(null);
  const { width } = useWindowSize();
  const [isOpen, setIsOpen] = useState(false);

  const isMobile = width <= 600;

  const handleRoleSelection = (selectedRole) => {
    setShowChoice(false);
    setRole(selectedRole);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-content">
          <h1 className="logo">FarmDrive</h1>

          {/* DESKTOP VIEW */}
          {!isMobile && (
            <>
              <ul className="nav-links">
                <li><a href="#howItWorks">How It Works</a></li>
                <li><a href="#testimonies">Testimonies</a></li>
                <li><a href="#FAQ">FAQ</a></li>
              </ul>
              <button className="btn-primary" onClick={() => setShowChoice(true)}>
                Sign Up
              </button>
            </>
          )}

          {/* MOBILE TOGGLE */}
          {isMobile && (
            <div className="mobile-menu-icon" style={{ marginLeft: 'auto', cursor: 'pointer' }} onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
            </div>
          )}
        </div>

        {/* MOBILE DROPDOWN */}
        {isMobile && isOpen && (
          <div className="mobile-dropdown">
            <ul className="nav-links">
              <li><a href="#howItWorks" onClick={() => setIsOpen(false)}>How It Works</a></li>
              <li><a href="#testimonies" onClick={() => setIsOpen(false)}>Testimonies</a></li>
              <li><a href="#FAQ" onClick={() => setIsOpen(false)}>FAQ</a></li>
              <li>
                <button className="btn-primary" onClick={() => { setShowChoice(true); setIsOpen(false); }}>
                  Sign Up
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>

      {showChoice && (
        <ChoiceModal onClose={() => setShowChoice(false)} setRole={handleRoleSelection} />
      )}
      {role && (
        <AuthModal type={role} onClose={() => setRole(null)} />
      )}
    </>
  );
}