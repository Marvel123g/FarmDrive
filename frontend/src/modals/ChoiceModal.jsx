import React from 'react'
import DriverAuth from '../components/Login/DriverAuth'

export default function ChoiceModal({onClose, setRole}) {
    const handleRoleClick = (role) => {
        setRole(role);
        onClose();
    };
return (
    <>
    <div className="overlay">
    <div className="choice-modal">
        <button className="close-btn" onClick={onClose}>
        ✕
        </button>

        <h2>Continue As</h2>
        <p>Select your role to get started</p>

        <div className="choiceButtons">
        <button onClick={() => setRole("farmer")}>
            🌾 I am a Farmer
        </button>

        <button onClick={() => handleRoleClick("driver")}>
            🚚 I am a Driver
        </button>
        </div>
    </div>
    </div>
    </>
)
}
