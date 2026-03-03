import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { HiMenu, HiX, HiBell, HiChevronDown } from "react-icons/hi";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);

    const verifySession = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          setUser(null);
          return;
        }
        const data = await res.json();
        if (data?.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
          setUser(data.user);
        }
      } catch {
        // Keep current local state on transient network errors.
      }
    };

    verifySession();
  }, [location]);

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
  const publicLinks = [
    { to: "/", label: "Home" },
    { to: "/kits", label: "Kits" },
    { to: "/robots", label: "Robots" },
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact Us" },
  ];

  const linkClass = (path) =>
    `text-sm font-semibold transition ${
      location.pathname === path
        ? "text-[#EC7B21]"
        : "text-gray-800 hover:text-[#EC7B21]"
    }`;

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Ignore network failure and still clear local session state.
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setProfileOpen(false);
      navigate("/login");
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-orange-100/80 bg-white/85 backdrop-blur-xl shadow-[0_6px_28px_rgba(15,23,42,0.06)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-20 flex items-center justify-between">
          <Link to={user ? "/dashboard" : "/"} className="flex items-center">
            <img
              src="https://whizrobo.com/wp-content/uploads/2023/07/logo.png"
              alt="WHIZROBO Logo"
              className="h-10 sm:h-11"
            />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {(!user || !isDashboard) &&
              publicLinks.map((item) => (
                <Link key={item.to} to={item.to} className={linkClass(item.to)}>
                  {item.label}
                </Link>
              ))}

            {!user && (
              <Link
                to="/login"
                className="inline-flex items-center rounded-xl bg-gradient-to-r from-[#EC7B21] to-orange-600 text-white px-5 py-2.5 text-sm font-semibold shadow-sm transition hover:from-orange-600 hover:to-orange-700 hover:shadow-md"
              >
                Login
              </Link>
            )}

            {user && isDashboard && (
              <div className="relative flex items-center gap-4" ref={profileRef}>
                <div className="relative cursor-pointer text-gray-700 hover:text-[#EC7B21] transition">
                  <HiBell className="text-2xl" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full px-1">
                    3
                  </span>
                </div>

                <button
                  type="button"
                  className="flex items-center gap-2 rounded-xl border border-orange-100 bg-white px-2 py-1.5 shadow-sm hover:border-orange-200 transition"
                  onClick={() => setProfileOpen(!profileOpen)}
                >
                  <img
                    src={user.avatar || "https://i.pravatar.cc/40"}
                    alt="user"
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="font-semibold text-sm text-gray-800">{user.name}</span>
                  <HiChevronDown className={`${profileOpen ? "rotate-180" : ""} transition-transform text-gray-700`} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-12 w-48 bg-white border border-orange-100 shadow-xl rounded-xl flex flex-col z-50 overflow-hidden">
                    <Link
                      to="/profile"
                      className="px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50"
                      onClick={() => setProfileOpen(false)}
                    >
                      Edit Profile
                    </Link>
                    <button
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-xl border border-orange-100 bg-white text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="rounded-2xl border border-orange-100 bg-white shadow-lg px-4 py-4 flex flex-col gap-2">
              {(!user || !isDashboard) &&
                publicLinks.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                      location.pathname === item.to
                        ? "bg-orange-50 text-[#EC7B21]"
                        : "text-gray-800 hover:bg-orange-50"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}

              {!user && (
                <Link
                  to="/login"
                  className="mt-1 bg-gradient-to-r from-[#EC7B21] to-orange-600 text-white px-5 py-2.5 rounded-xl text-center text-sm font-semibold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}

              {user && isDashboard && (
                <div className="flex flex-col gap-2 pt-2 border-t border-orange-100 mt-1">
                  <Link
                    to="/profile"
                    className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-orange-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Edit Profile
                  </Link>
                  <button
                    className="text-left rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
