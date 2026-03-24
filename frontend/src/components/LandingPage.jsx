import React,{useState} from "react";

import AuthModal from "../modals/AuthModal";
import Testimony from "../Home/Testimony";
import FAQ from "../Home/FAQ";
import Footer from "../Home/Footer";
import Hero from "../Home/Hero";
import WhySection from "../Home/WhySection";
import HowSection from "../Home/HowSection";

export default function LandingPage() {

 const [role, setRole] = useState(null);

  
  return (
    <div className="landing-page">
      <Hero setRole={setRole} />
      <WhySection/>
      <HowSection/>


      


      <Testimony />
      <FAQ />
      <Footer role={role} setRole={setRole} />
    </div>
  );
}