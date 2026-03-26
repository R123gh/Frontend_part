import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";

import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import Login from "./Components/Login";
import AboutUs from "./Components/AboutUs";
import Contact from "./Components/Contact";
import Demo from "./Components/Demo";
import Robots from "./Components/Robots";
import RobotDetails from "./Components/RobotDetails";
import TermsAndConditions from "./Components/TermsAndConditions";
import Privacy from "./Components/Privacy";
import Dashboard from "./Components/Dashboard";
import Profile from "./Components/Profile";
import { useTheme } from "./context/ThemeContext";

const ProtectedRoute = ({ element }) => {
  const user = localStorage.getItem("user");
  return user ? element : <Navigate to="/login" replace />;
};

function App() {
  const { isDark } = useTheme();

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <Router>
        <div className={`flex flex-col min-h-screen ${isDark ? "bg-black text-white" : "bg-white text-black"}`}>
          <Navbar />

          <main className="flex-grow pt-20">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
              <Route path="/privacy-policy" element={<Privacy />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Login />} />
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/robots" element={<Robots />} />
              <Route path="/robots/:id" element={<RobotDetails />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
              <Route path="/cart" element={<div className="p-8 text-center">Cart Page</div>} />
            </Routes>
          </main>

          <footer
            className={`border-t w-full ${isDark ? "border-white/10 bg-black text-white" : "border-black/10 bg-black text-white"}`}
          >
            <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="text-center lg:text-left">
                  <img
                    src="https://whizrobo.com/wp-content/uploads/2023/07/logo.png"
                    alt="Whizrobo Logo"
                    className="h-12 mx-auto md:mx-0 mb-4"
                  />
                  <p className="text-sm leading-relaxed text-white/80">
                    WHIZROBO was established in 2016 to deliver STEM education through robotics, AI and IoT with a learning-by-doing approach.
                  </p>
                </div>

                <div className="text-center lg:text-center">
                  <h3 className="text-[#EC7B21] text-base font-extrabold uppercase tracking-[0.2em] mb-4">
                    Quick Links
                  </h3>
                  <ul className="space-y-2 text-sm text-white/80">
                    <li><Link to="/" className="hover:text-[#EC7B21] transition">Home</Link></li>
                    <li><Link to="/about" className="hover:text-[#EC7B21] transition">About Us</Link></li>
                    <li><Link to="/robots" className="hover:text-[#EC7B21] transition">Robots</Link></li>
                    <li><Link to="/contact" className="hover:text-[#EC7B21] transition">Contact</Link></li>
                    <li><Link to="/privacy-policy" className="hover:text-[#EC7B21] transition">Privacy Policy</Link></li>
                    <li><Link to="/terms" className="hover:text-[#EC7B21] transition">Terms & Conditions</Link></li>
                  </ul>
                </div>

                <div className="text-center lg:text-right">
                  <h3 className="text-[#EC7B21] text-base font-extrabold uppercase tracking-[0.2em] mb-4">
                    Connect With Us
                  </h3>
                  <div className="flex justify-center lg:justify-end gap-3 mb-5">
                    <SocialIcon href="https://www.facebook.com/whizrobo/" icon={<FaFacebookF />} />
                    <SocialIcon href="https://in.linkedin.com/company/whizrobo" icon={<FaLinkedinIn />} />
                    <SocialIcon href="https://www.instagram.com/whizrobo_/" icon={<FaInstagram />} />
                    <SocialIcon href="https://api.whatsapp.com/send/?phone=9464214000&text=Hi%2C+Whizrobo" icon={<FaWhatsapp />} />
                  </div>

                  <div className="text-sm text-white/80 leading-relaxed">
                    <p>
                      Email: <a href="mailto:info@whizrobo.com" className="hover:text-[#EC7B21] transition">info@whizrobo.com</a>
                    </p>
                    <p className="mt-1">
                      Phone:{" "}
                      <a href="tel:+918968714000" className="hover:text-[#EC7B21] transition">+91 89687 14000</a>,{" "}
                      <a href="tel:+919464214000" className="hover:text-[#EC7B21] transition">+91 94642 14000</a>
                    </p>
                    <p className="mt-1">
                      Website:{" "}
                      <a
                        href="https://www.whizrobo.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#EC7B21] transition"
                      >
                        www.whizrobo.com
                      </a>
                    </p>
                    <p className="mt-1">Head Office: 14 D Kitchlu Nagar, Ludhiana</p>
                    <p className="mt-1">Regd Office: Emerald Plaza, Sector-65, Gurgaon</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10">
              <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/60">
                <div className="flex items-center gap-2">
                  <img
                    src="https://whizrobo.com/wp-content/uploads/2023/07/logo.png"
                    alt="Whizrobo Logo"
                    className="h-6 opacity-80"
                  />
                  <span>Copyright {new Date().getFullYear()} WHIZROBO. All rights reserved.</span>
                </div>
                <span>India</span>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </>
  );
}

export default App;

const SocialIcon = ({ href, icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition hover:scale-105 hover:border-[#EC7B21] hover:text-[#EC7B21]"
  >
    {icon}
  </a>
);
