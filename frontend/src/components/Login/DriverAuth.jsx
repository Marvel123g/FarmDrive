import React, {useState} from 'react'

function DriverAuth({mode, setMode}) {
  // State to hold driver details and any validation errors
    const [driverDetails, setDriverDetails] = useState({
        firstname: "",
        surname: "",
        email: "",
        phone: "",
        password: "",
    });
    const [errors, setErrors] = useState({})


    // Function to handle changes in form fields and update state accordingly
    const handleChange = (e) => {
        setDriverDetails({ ...driverDetails, [e.target.name]: e.target.value });
    };


    // Function for handling login logic
    const handleLogin = async (e) => {
       let valid = true;
       e.preventDefault()

      //  Validation checks
       if (!driverDetails.email) {
        setErrors(prev => ({...prev, email: "Email is required"}))
        valid = false;
       }
       if (!driverDetails.password) {
        setErrors(prev => ({...prev, password: "Password is required"}))
        valid = false;
       }
        // If all validations pass, proceed with API call
       if (valid) {
          e.preventDefault();
          const res = await fetch("http://127.0.0.1:5000/api/v1/driver/auth/login", {
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({ driverDetails: driverDetails }),
            credentials: "include"
          });

        const data = await res.json();
        console.log("Login response:", data);}
    };

    // Function for handling sign-up logic
    const handleSignUp = async(e) => {
      let valid = true;
      e.preventDefault()

      //  Validation checks
      if (!driverDetails.firstname) {
        setErrors(prev => ({...prev, firstname: "First name is required"}))
        valid = false;
       }
      if (!driverDetails.surname) {
        setErrors(prev => ({...prev, surname: "Surname is required"}))
        valid = false;
      }
      if (!driverDetails.phone) {
        setErrors(prev => ({...prev, phone: "Phone number is required"}))
        valid = false;
      }
      if (!driverDetails.email) {
      setErrors(prev => ({...prev, email: "Email is required"}))
      valid = false;
      }
      if (!driverDetails.password) {
      setErrors(prev => ({...prev, password: "Password is required"}))
      valid = false;
      }

      // If all validations pass, proceed with API call
      if (valid) {
        const res = await fetch("http://127.0.0.1:5000/api/v1/driver/auth/signup", {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ "driverDetails": driverDetails }),
          credentials: "include"
        });
        const data = await res.json();
        console.log(data)
        setMode("login")
      }
    }
  return (
   <div className="authContainer">
      
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
  
    <form className="authPage" onSubmit={mode === "login" ? handleLogin : handleSignUp}>
      {mode === "signup" ? (
        <>
          {/* Sign up field for First Name  */}
          <div style={{flex: 1, display: "flex",flexDirection: 'column', gap: "10px"}}>
            <input
              type="text"
              placeholder="First Name"
              name="firstname"
              value={driverDetails.firstname}
              onChange={handleChange}
            />
            {errors.firstname && <span className="error" style={{textAlign: "start",color: "red", fontSize: "13px", marginTop: "3px"}}>{errors.firstname}</span>}
          </div>

          {/* Sign up field for Surname */}
          <div style={{flex: 1, display: "flex",flexDirection: 'column', gap: "10px"}}>
            <input
              type="text"
              placeholder="Surname"
              name="surname"
              value={driverDetails.surname}
              onChange={handleChange}
            />
            {errors.surname && <span className="error" style={{textAlign: "start",color: "red", fontSize: "13px", marginTop: "3px"}}>{errors.surname}</span>}
          </div>

          {/* Sign up field for Email address */}
          <div style={{flex: 1, display: "flex",flexDirection: 'column', gap: "10px"}}>
            <input
              type="text"
              placeholder="email"
              name="email"
              value={driverDetails.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error" style={{textAlign: "start",color: "red", fontSize: "13px", marginTop: "3px"}}>{errors.email}</span>}
          </div>

          {/* Sign up field for Phone number */}
          <div style={{flex: 1, display: "flex", flexDirection: "column"}}>
            <input
              type="tel"
              placeholder="Phone Number"
              name="phone"
              value={driverDetails.phone}
              onChange={handleChange}
            />
            {errors.phone && <span className="error" style={{textAlign: "start",color: "red", fontSize: "13px", marginTop: "3px"}}>{errors.phone}</span>}
          </div>

          {/* Sign up field for password */}
          <div style={{flex: 1, display: "flex", flexDirection: "column"}}>
            <input
              type="text"
              placeholder="password"
              name="password"
              value={driverDetails.password}
              onChange={handleChange}
            /> 
            {errors.password && <span className="error" style={{textAlign: "start",color: "red", fontSize: "13px", marginTop: "3px"}}>{errors.password}</span>}
          </div>
        </>
      ) : (
        <>

        {/* Login field for email */}
          <div style={{flex: 1, display: "flex", flexDirection: "column"}}>
            <input
              type="text"
              placeholder="email"
              name="email"
              value={driverDetails.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error" style={{textAlign: "start",color: "red", fontSize: "13px", marginTop: "3px"}}>{errors.email}</span>}
          </div>

          {/* Login field for password */}
          <div style={{flex: 1, display: "flex", flexDirection: "column"}}>
            <input
              type="text"
              name="password"
              placeholder="password"
              value={driverDetails.password}
              onChange={handleChange}
            />
            {errors.password && <span className="error" style={{textAlign: "start",color: "red", fontSize: "13px", marginTop: "3px"}}>{errors.password}</span>}
          </div>
        </>
      )}

        {/* Conditionally render submit button */}
        {mode === "login" ? (
            <button className='submitBtn' onClick={handleLogin}>Login as Driver</button>
        ) : (
            <button className='submitBtn' onClick={handleSignUp}>Create Driver Account</button>
        )}
    </form>
    </div>
  );
}

export default DriverAuth