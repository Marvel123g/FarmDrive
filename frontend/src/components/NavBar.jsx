import React, { useState } from "react";
import ChoiceModal from "../modals/ChoiceModal";
import AuthModal from "../modals/AuthModal";

export default function NavBar() {
  const [showChoice, setShowChoice] = useState(false);
  const [role, setRole] = useState(null);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-content">
          <h1 className="logo">FarmDrive</h1>

          <ul className="nav-links">
            <li><a href="#howItWorks">How It Works</a></li>
            <li><a href="#testimonies">Testimonies</a></li>
            <li><a href="#FAQ">FAQ</a></li>
          </ul>

          <button className="btn-primary" onClick={() => setShowChoice(true)}>
            Sign Up
          </button>
        </div>
      </nav>

      {showChoice && (
        <ChoiceModal
          onClose={() => { setShowChoice(false);}}
          setRole={setRole}
        />
      )}
      {role && (
        <AuthModal type={role} onClose={() => setRole(null)} />
      )}
    </>
  );
}