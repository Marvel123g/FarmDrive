import { useState } from "react";
import NavBar from "./components/NavBar";
import LandingPage from "./components/LandingPage";
import FarmerDashboard from "./farmerComponents/FarmerDashboard";
import PostProduce from "./farmerComponents/PostProduce";
import { Routes, Route } from "react-router-dom";
import DriverDashboard from "./driverComponents/driverDashboard";
import MyProduce from "./farmerComponents/MyProduce";
import Marketplace from "./driverComponents/Marketplace";
import Deliveries from "./farmerComponents/Deliveries";
import Payment from "./farmerComponents/Payment";
import DriverDelivery from "./driverComponents/DriverDelivery";
import Earnings from "./driverComponents/Earnings";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<><NavBar/><LandingPage/></>} />
        <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
        <Route path="/driver-dashboard" element={<DriverDashboard/>}/>
        <Route path="/post-produce" element={<PostProduce />} />
        <Route path="/my-produce" element={<MyProduce/>}/>
        <Route path="/marketplace" element={<Marketplace/>}/>
        <Route path="/deliveries" element={<Deliveries/>}/>
        <Route path="/payments" element={<Payment/>}/>
        <Route path="/driver-deliveries" element={<DriverDelivery/>}/>
        <Route path="/earnings" element={<Earnings/>}/>
      </Routes>
    </>
  );
}

export default App;