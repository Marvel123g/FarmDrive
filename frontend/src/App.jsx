import { useState } from "react";
import NavBar from "./components/NavBar";
import LandingPage from "./components/LandingPage";
import Dashboard from "./farmerComponents/dashboard";
import PostProduce from "./farmerComponents/PostProduce";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<><NavBar/><LandingPage/></>} />
        <Route path="/farmer-dashboard" element={<Dashboard />} />
        <Route path="/post-produce" element={<PostProduce />} />
      </Routes>
    </>
  );
}

export default App;