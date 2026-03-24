import React, { useState } from "react";

function FarmerAuth({ mode, setMode }) {
  const [farmerDetails, setFarmerDetails] = useState({
    firstname: "",
    surname: "",
    farm_state: "",
    farm_city: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setFarmerDetails({ ...farmerDetails, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Logging in with:", farmerDetails);
  };
  const handleSignUp = (e) => {
    e.preventDefault();
    console.log("Signing up with:", farmerDetails);
  };
  return (
    <div className="authContainer">
      {/* <div className="auth-images"> */}
  <div className="imgWrapper img1">
    <img
      className="auth-img"
      src="https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=200"
      alt="produce"
    />
  </div>

  {/* <div className="imgWrapper img2">
    <img
      className="auth-img"
      src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=200"
      alt="farm"
    />
  </div>

  <div className="imgWrapper img3">
    <img
      className="auth-img"
      src="https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=200"
      alt="vegetables"
    />
  </div>

  <div className="imgWrapper img4">
    <img
      className="auth-img"
      src="https://images.unsplash.com/photo-1498575207490-8f0c1d8e8b3d?w=200"
      alt="crops"
    />
  </div> */}
{/* </div> */}
      <form
        className="authPage"
        onSubmit={mode === "login" ? handleLogin : handleSignUp}
      >
        {mode === "signup" ? (
          <>
            <input
              type="text"
              placeholder="First Name"
              name="firstname"
              value={farmerDetails.firstname}
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Surname"
              name="surname"
              value={farmerDetails.surname}
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Farm State"
              name="farm_state"
              value={farmerDetails.farm_state}
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Farm City"
              name="farm_city"
              value={farmerDetails.farm_city}
              onChange={handleChange}
            />
            <input
              type="tel"
              placeholder="Phone Number"
              name="phone"
              value={farmerDetails.phone}
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="pasword"
              name="password"
              value={farmerDetails.password}
              onChange={handleChange}
            />
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Phone Number"
              name="phone"
              value={farmerDetails.phone}
              onChange={handleChange}
            />

            <input
              type="text"
              name="password"
              placeholder="password"
              value={farmerDetails.password}
              onChange={handleChange}
            />
          </>
        )}

        {mode === "login" ? (
          <button className="submitBtn" onClick={handleLogin}>
            Login as Farmer
          </button>
        ) : (
          <button className="submitBtn" onClick={handleSignUp}>
            Create Farmer Account
          </button>
        )}
        {/* <button type="submit" className={styles.submitBtn}>
        {mode === "login" ? "Login as Driver" : "Create Driver Account"}
      </button> */}
      </form>
    </div>
  );
}

export default FarmerAuth;
