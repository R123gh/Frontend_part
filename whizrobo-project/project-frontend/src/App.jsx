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
        <div className={`flex flex-col min-h-screen ${isDark ? "bg-slate-950 text-slate-100" : "bg-white text-gray-900"}`}>
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
              <Route path="/robots" element={<Robots />} />
              <Route path="/robots/:id" element={<RobotDetails />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
              <Route path="/cart" element={<div className="p-8 text-center">Cart Page</div>} />
            </Routes>
          </main>

          <footer
            className={`relative overflow-hidden border-t w-full ${
              isDark
                ? "border-slate-700 bg-gradient-to-b from-slate-950 to-slate-900 text-slate-100"
                : "border-orange-100 bg-gradient-to-b from-[#20130a] to-[#120c08] text-orange-50"
            }`}
          >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <div className="absolute -top-20 -left-16 h-60 w-60 rounded-full bg-orange-500/20 blur-3xl" />
              <div className="absolute top-14 right-0 h-56 w-56 rounded-full bg-amber-300/10 blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
              <div>
                <img
                  src="https://whizrobo.com/wp-content/uploads/2023/07/logo.png"
                  alt="Whizrobo Logo"
                  className="h-12 mx-auto md:mx-0 mb-4"
                />
                <p className="text-sm leading-relaxed text-orange-100/80">
                  WHIZROBO was established in 2016 to deliver STEM education through robotics, AI, and IoT with a learning-by-doing approach.
                </p>
              </div>

              <div>
                <h3 className="text-[#EC7B21] text-xl font-extrabold mb-4">Quick Links</h3>
                <ul className="space-y-2 text-sm text-orange-100/90">
                  <li><Link to="/" className="hover:text-white transition">Home</Link></li>
                  <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
                  <li><Link to="/robots" className="hover:text-white transition">Robots</Link></li>
                  <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
                  <li><Link to="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link></li>
                  <li><Link to="/terms" className="hover:text-white transition">Terms & Conditions</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="text-[#EC7B21] text-xl font-extrabold mb-4">Connect With Us</h3>
                <div className="flex justify-center md:justify-start gap-3 mb-5">
                  <SocialIcon href="https://www.facebook.com/whizrobo/" icon={<FaFacebookF />} color="hover:text-[#1877F2]" />
                  <SocialIcon href="https://in.linkedin.com/company/whizrobo" icon={<FaLinkedinIn />} color="hover:text-[#0A66C2]" />
                  <SocialIcon href="https://www.instagram.com/whizrobo_/" icon={<FaInstagram />} color="hover:text-[#E4405F]" />
                  <SocialIcon href="https://api.whatsapp.com/send/?phone=9464214000&text=Hi%2C+Whizrobo" icon={<FaWhatsapp />} color="hover:text-[#25D366]" />
                </div>

                <p className="text-sm text-orange-100/80 leading-relaxed">
                  Email: <a href="mailto:info@whizrobo.com" className="hover:text-white transition">info@whizrobo.com</a>
                  <br />
                  Phone: <a href="tel:+918968714000" className="hover:text-white transition">+91-896-871-4000</a>
                </p>
              </div>
            </div>

            <div className="relative border-t border-orange-100/15 py-4 px-6">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-2 text-xs text-orange-100/70">
                <img
                  src="https://whizrobo.com/wp-content/uploads/2023/07/logo.png"
                  alt="Whizrobo Logo"
                  className="h-6 opacity-80"
                />
                <span>Copyright {new Date().getFullYear()} WHIZROBO. All rights reserved.</span>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </>
  );
}

export default App;

const SocialIcon = ({ href, icon, color }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border border-orange-100/20 bg-white/5 text-orange-100/80 transition-transform transform hover:scale-105 ${color}`}
  >
    {icon}
  </a>
);
