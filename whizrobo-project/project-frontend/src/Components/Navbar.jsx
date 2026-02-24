import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { HiMenu, HiX, HiBell, HiChevronDown } from "react-icons/hi";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef();

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, [location]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <nav className="bg-white shadow-sm py-4 px-6 fixed top-0 w-full z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">

        {/* LOGO */}
        <Link to={user ? "/dashboard" : "/"}>
          <img
            src="https://whizrobo.com/wp-content/uploads/2023/07/logo.png"
            alt="WHIZROBO Logo"
            className="h-10"
          />
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8">

          {(!user || !isDashboard) && (
            <>
              <Link to="/" className="font-semibold">Home</Link>
              <Link to="/kits" className="font-semibold">Kits</Link>
              <Link to="/robots" className="font-semibold">Robots</Link>
              <Link to="/about" className="font-semibold">AboutUs</Link>
              <Link to="/contact" className="font-semibold">ContactUs</Link>
            </>
          )}

          {!user && (
            <Link
              to="/login"
              className="bg-[#EC7B21] text-white px-5 py-2 rounded-lg"
            >
              Login
            </Link>
          )}

          {/* DASHBOARD PROFILE */}
          {user && isDashboard && (
            <div className="relative flex items-center gap-4" ref={profileRef}>

              {/* Notification */}
              <div className="relative cursor-pointer">
                <HiBell className="text-2xl text-gray-700" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                  3
                </span>
              </div>

              {/* Profile */}
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <img
                  src={user.avatar || "https://i.pravatar.cc/40"}
                  alt="user"
                  className="h-9 w-9 rounded-full"
                />
                <span className="font-semibold">{user.name}</span>
                <HiChevronDown className={`${profileOpen ? "rotate-180" : ""} transition-transform`} />
              </div>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 top-12 w-44 bg-white shadow-xl rounded-lg border flex flex-col z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setProfileOpen(false)}
                  >
                    Edit Profile
                  </Link>

                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                    onClick={() => {
                      localStorage.removeItem("user");
                      setProfileOpen(false);
                      navigate("/login");
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 bg-white shadow-md rounded-lg py-4 px-6 flex flex-col gap-4">

          {(!user || !isDashboard) && (
            <>
              <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/kits" onClick={() => setIsMenuOpen(false)}>Kits</Link>
              <Link to="/robots" onClick={() => setIsMenuOpen(false)}>Robots</Link>
              <Link to="/about" onClick={() => setIsMenuOpen(false)}>AboutUs</Link>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)}>ContactUs</Link>
            </>
          )}

          {!user && (
            <Link
              to="/login"
              className="bg-[#EC7B21] text-white px-5 py-2 rounded-lg text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          )}

          {/* Dashboard Profile Mobile */}
          {user && isDashboard && (
            <div className="flex flex-col gap-2">
              <Link
                to="/profile"
                className="font-semibold"
                onClick={() => setIsMenuOpen(false)}
              >
                Edit Profile
              </Link>

              <button
                className="text-left text-red-600 font-semibold"
                onClick={() => {
                  localStorage.removeItem("user");
                  setIsMenuOpen(false);
                  navigate("/login");
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
