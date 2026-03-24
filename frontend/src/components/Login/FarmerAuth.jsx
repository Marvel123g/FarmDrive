import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function FarmerAuth({ mode, setMode }) {
  // State to hold farmer details and any validation errors
  const [farmerDetails, setFarmerDetails] = useState({
    firstname: "",
    surname: "",
    farm_state: "",
    farm_city: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  // useNavigate hook for programmatic navigation after successful login
  const navigate = useNavigate();

// Function to handle changes in form fields and update state accordingly
  const handleChange = (e) => {
    setFarmerDetails({ ...farmerDetails, [e.target.name]: e.target.value });
  };

  // Function for handling login logic for farmers
  const handleLogin = async(e) => {
    let valid = true;
    e.preventDefault()

  //  Validation checks
    if (!farmerDetails.phone) {
    setErrors(prev => ({...prev, phone: "Phone Number is required"}))
    valid = false;
    }
    if (!farmerDetails.password) {
    setErrors(prev => ({...prev, password: "Password is required"}))
    valid = false;
    }

    // if all validations pass, proceed with API call
    if (valid) {
      e.preventDefault();
      const res = await fetch("http://127.0.0.1:5000/api/v1/farmer/auth/login", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ farmerDetails: farmerDetails }),
        credentials: "include"
      });

      const data = await res.json();
      console.log("Login response:", data);
      navigate("/farmer-dashboard")

    }
  };
  const handleSignUp = async(e) => {
    let valid = true;
    e.preventDefault()

    //  Validation checks
    if (!farmerDetails.firstname) {
      setErrors(prev => ({...prev, firstname: "First name is required"}))
      valid = false;
      }
    if (!farmerDetails.surname) {
      setErrors(prev => ({...prev, surname: "Surname is required"}))
      valid = false;
    }
    if (!farmerDetails.farm_state) {
      setErrors(prev => ({...prev, farm_state: "Farm state is required"}))
      valid = false;
    }
    if (!farmerDetails.farm_city) {
      setErrors(prev => ({...prev, farm_city: "Farm city is required"}))
      valid = false;
    }
    if (!farmerDetails.phone) {
      setErrors(prev => ({...prev, phone: "Phone number is required"}))
      valid = false;
    }
    if (!farmerDetails.password) {
    setErrors(prev => ({...prev, password: "Password is required"}))
    valid = false;
    }

    // If all validations pass, proceed with API call
    if (valid) {
      const res = await fetch("http://127.0.0.1:5000/api/v1/farmer/auth/signup", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ "farmerDetails": farmerDetails }),
        credentials: "include"
      });
      const data = await res.json();
      console.log(data)
      setMode("login")
    }
  };
  return (
    <div className="authContainer">
      {/* Decorative Images for authentication */}
      <img
        className="auth-img img1"
        src="https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=200"
        alt=""
      />
      <img
        className="auth-img img2"
        src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=200"
        alt=""
      />
      <img
        className="auth-img img3"
        src="https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=200"
        alt=""
      />
      <img
        className="auth-img img4"
        src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=200"
        alt=""
      />
      <form
        className="authPage"
        onSubmit={mode === "login" ? handleLogin : handleSignUp}
      >
        {mode === "signup" ? (
          <>
          {/* Sign up field for First Name */}
          <div style={{flex: 1, display: "flex",flexDirection: 'column', gap: "10px"}}>
            <input
              type="text"
              placeholder="First Name"
              name="firstname"
              value={farmerDetails.firstname}
              onChange={handleChange}
            />
            {errors.firstname && <span className="error" style={{textAlign: "start",color: "red", fontSize: "13px", marginTop: "3px"}}>{errors.firstname}</span>}
          </div>
            

            {/* Signup field for surname */}
          <div style={{flex: 1, display: "flex",flexDirection: 'column', gap: "10px"}}>
            <input
              type="text"
              placeholder="Surname"
              name="surname"
              value={farmerDetails.surname}
              onChange={handleChange}
            />
            {errors.surname && <span className="error" style={{textAlign: "start",color: "red", fontSize: "13px", marginTop: "3px"}}>{errors.surname}</span>}
          </div>
            
            {/* Signup field for Farm State */}
          <div style={{flex: 1, display: "flex",flexDirection: 'column', gap: "10px"}}>
            <input
              type="text"
              placeholder="Farm State"
              name="farm_state"
              value={farmerDetails.farm_state}
              onChange={handleChange}
            />
            {errors.farm_state && <span className="error" style={{textAlign: "start",color: "red", fontSize: "13px", marginTop: "3px"}}>{errors.farm_state}</span>}
          </div>

          {/* Signup field for Farm City */}
          <div style={{flex: 1, display: "flex",flexDirection: 'column', gap: "10px"}}>
             <input
              type="text"
              placeholder="Farm City"
              name="farm_city"
              value={farmerDetails.farm_city}
              onChange={handleChange}
            />
            {errors.farm_city && <span className="error" style={{textAlign: "start",color: "red", fontSize: "13px", marginTop: "3px"}}>{errors.farm_city}</span>}
          </div>

          {/* Signup field for phone number */}
          <div style={{flex: 1, display: "flex",flexDirection: 'column', gap: "10px"}}>
              <input
              type="tel"
              placeholder="Phone Number"
              name="phone"
              value={farmerDetails.phone}
              onChange={handleChange}
            />
            {errors.phone && <span className="error" style={{textAlign: "start",color: "red", fontSize: "13px", marginTop: "3px"}}>{errors.phone}</span>}
          </div>

          {/* Signup Field for Farmer password */}
          <div style={{flex: 1, display: "flex",flexDirection: 'column', gap: "10px"}}>
              <input
              type="text"
              placeholder="pasword"
              name="password"
              value={farmerDetails.password}
              onChange={handleChange}
            />
            {errors.password && <span className="error" style={{textAlign: "start",color: "red", fontSize: "13px", marginTop: "3px"}}>{errors.password}</span>}
          </div>
           
           
          {/* Decorative Image for authentication */}
          <img
            className="auth-img img5"
            src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=200"
            alt=""
          />
          </>
        ) : (
          <>
          {/* Login field for farmer phone number */}
          <div style={{flex: 1, display: "flex",flexDirection: 'column', gap: "10px"}}>
             <input
              type="text"
              placeholder="Phone Number"
              name="phone"
              value={farmerDetails.phone}
              onChange={handleChange}
            />
            {errors.phone && <span className="error" style={{textAlign: "start",color: "red", fontSize: "13px", marginTop: "3px"}}>{errors.phone}</span>}
          </div>

          {/* Login Field for Farmer password */}
          <div style={{flex: 1, display: "flex",flexDirection: 'column', gap: "10px"}}>
            <input
              type="text"
              name="password"
              placeholder="password"
              value={farmerDetails.password}
              onChange={handleChange}
            />
            {errors.password && <span className="error" style={{textAlign: "start",color: "red", fontSize: "13px", marginTop: "3px"}}>{errors.password}</span>}
          </div>
          </>
        )}
        

        {/* Conditionally render the button based on the mode */}
        {mode === "login" ? (
          <button className="submitBtn" onClick={handleLogin}>
            Login as Farmer
          </button>
        ) : (
          <button className="submitBtn" onClick={handleSignUp}>
            Create Farmer Account
          </button>
        )}
      </form>
      
    </div>
  );
}

export default FarmerAuth;
