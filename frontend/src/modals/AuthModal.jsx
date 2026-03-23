import { useState } from "react";
import DriverAuth from "../components/Login/DriverAuth";
import FarmerAuth from "../components/Login/FarmerAuth";

export default function AuthModal({ type, onClose }) {
  const [mode, setMode] = useState("login"); 


  return (
    <div className='overlay'>
      <div className='modal'>
        <button className='closeBtn' onClick={onClose}>
          ✕
        </button>

        <div className='toggleWrapper'>
          <div
            className={`toggleIndicator ${
              mode === "signup" ? "moveRight" : ""
            }`}
          />

          <button
            className={mode === "login" ? "activeText" : ""}
            onClick={() => setMode("login")}
          >
            Login
          </button>

          <button
            className={mode === "signup" ? "activeText" : ""}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>
        </div>

        {type === "farmer" ? (
          <FarmerAuth key={mode} mode={mode} setMode={setMode} />
        ) : (
          <DriverAuth key={mode} mode={mode} setMode={setMode} />
        )}
      </div>
    </div>
  );
}
