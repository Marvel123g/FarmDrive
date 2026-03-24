import { useState } from "react";
import NavBar from "./components/NavBar";
import LandingPage from "./components/LandingPage";
import Dashboard from "./farmerComponents/dashboard";
import PostProduce from "./farmerComponents/PostProduce";
import { Routes, Route } from "react-router-dom";
import DriverDashboard from "./driverComponents/driverDashboard";
import MyProduce from "./farmerComponents/MyProduce";
import Marketplace from "./driverComponents/Marketplace";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<><NavBar/><LandingPage/></>} />
        <Route path="/farmer-dashboard" element={<Dashboard />} />
        <Route path="/driver-dashboard" element={<DriverDashboard/>}/>
        <Route path="/post-produce" element={<PostProduce />} />
        <Route path="/my-produce" element={<MyProduce/>}/>
        <Route path="/marketplace" element={<Marketplace/>}/>
      </Routes>
    </>
  );
}

export default App;