import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";

import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import Login from "./Components/Login";
import AboutUs from "./Components/AboutUs";
import Contact from "./Components/Contact";
import Robots from "./Components/Robots";
import RobotDetails from "./Components/RobotDetails";
import TermsAndConditions from "./Components/TermsAndConditions";
import Privacy from "./Components/Privacy";
import Kits from "./Components/Kits";
import Dashboard from "./Components/Dashboard";
import Profile from "./Components/Profile";

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <Router>
        {/* PAGE WRAPPER */}
        <div className="flex flex-col min-h-screen">
          <Navbar />

          {/* MAIN CONTENT */}
          <main className="flex-grow pt-20">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/privacy-policy" element={<Privacy />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/login" element={<Login />} />
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/kits" element={<Kits />} />
              <Route path="/robots" element={<Robots />} />
              <Route path="/robots/:id" element={<RobotDetails />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/profile" element={<Profile/>} />

              <Route
                path="/cart"
                element={<div className="p-8 text-center">Cart Page</div>}
              />
            </Routes>
          </main>

          {/* FOOTER */}
          <footer className="bg-black text-gray-300 w-full">
  <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">

    {/* ABOUT */}
    <div>
      {/* Logo */}
      <img
        src="https://whizrobo.com/wp-content/uploads/2023/07/logo.png"
        alt="Whizrobo Logo"
        className="h-14 mx-auto md:mx-0 mb-4"
      />

      

      <p className="text-sm leading-relaxed text-gray-400">
        WHIZROBO established in 2016 with a vision to introduce
        STEM education through Robotics for students across the
        globe. Learning by Doing is at the heart of what we do.
      </p>
    </div>

    {/* QUICK LINKS */}
    <div>
      <h3 className="text-[#EC7B21] text-xl font-bold mb-4">
        Quick Links
      </h3>

      <ul className="space-y-2 text-sm">
        <li><a href="/" className="hover:text-white transition">Home</a></li>
        <li><a href="/about" className="hover:text-white transition">About Us</a></li>
        <li><a href="/robots" className="hover:text-white transition">Robots</a></li>
        <li><a href="/kits" className="hover:text-white transition">Kits</a></li>
        <li><a href="/contact" className="hover:text-white transition">Contact</a></li>
        <li><a href="/privacy-policy" className="hover:text-white transition">Privacy Policy</a></li>
        <li><a href="/terms" className="hover:text-white transition">Terms & Conditions</a></li>
      </ul>
    </div>

    {/* CONTACT & SOCIAL */}
    <div>
      <h3 className="text-[#EC7B21] text-xl font-bold mb-4">
        Connect With Us
      </h3>

      <div className="flex justify-center md:justify-start gap-5 text-2xl mb-5">
        <SocialIcon
          href="https://www.facebook.com/whizrobo/"
          icon={<FaFacebookF />}
          color="hover:text-[#1877F2]"
        />
        <SocialIcon
          href="https://in.linkedin.com/company/whizrobo"
          icon={<FaLinkedinIn />}
          color="hover:text-[#0A66C2]"
        />
        <SocialIcon
          href="https://www.instagram.com/whizrobo_/"
          icon={<FaInstagram />}
          color="hover:text-[#E4405F]"
        />
        <SocialIcon
          href="https://api.whatsapp.com/send/?phone=9464214000&text=Hi%2C+Whizrobo"
          icon={<FaWhatsapp />}
          color="hover:text-[#25D366]"
        />
      </div>

      <p className="text-sm text-gray-400 leading-relaxed">
        Email:{" "}
        <a
          href="mailto:info@whizrobo.com"
          className="hover:text-white transition"
        >
          info@whizrobo.com
        </a>
        <br />
        Phone:{" "}
        <a
          href="tel:+918968714000"
          className="hover:text-white transition"
        >
          +91-896-871-4000
        </a>
      </p>
    </div>
  </div>

  {/* BOTTOM BAR */}
  <div className="border-t border-gray-800 py-4 flex flex-col md:flex-row items-center justify-center gap-2 text-xs text-gray-500">
    <img
      src="https://whizrobo.com/wp-content/uploads/2023/07/logo.png"
      alt="Whizrobo Logo"
      className="h-6 opacity-80"
    />
    <span>
      © {new Date().getFullYear()} WHIZROBO. All rights reserved.
    </span>
  </div>
</footer>

        </div>
      </Router>
    </>
  );
}

export default App;

/* SOCIAL ICON COMPONENT */
const SocialIcon = ({ href, icon, color }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`text-gray-400 transition-transform transform hover:scale-110 ${color}`}
  >
    {icon}
  </a>
);
