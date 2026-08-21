import React from "react";
import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import AiTools from "../components/AiTools.jsx";
import Testimonials from "../components/Testimonials.jsx";
import Plan from "../components/Plan.jsx";
import Footer from "../components/Footer.jsx";
import { assets } from "../assets/assets";

const Home = () => {
  return (
    <div className="min-h-screen">
      <div
        className="w-full bg-cover bg-center bg-black"
        // style={{ backgroundImage: `url(${assets.gradientBackground})` }}
      >
        <Navbar />
        <Hero />
      </div>
      <AiTools />
      <Testimonials />
      <Plan />
      <Footer />
    </div>
  );
};

export default Home;
