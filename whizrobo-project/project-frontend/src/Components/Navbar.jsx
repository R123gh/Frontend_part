import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { HiMenu, HiX, HiBell, HiChevronDown } from "react-icons/hi";
import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const getInitial = (name) => {
  const clean = String(name || "").trim();
  return clean ? clean.charAt(0).toUpperCase() : "U";
};

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");
  const publicLinks = [
    { to: "/", label: "Home" },
    { to: "/robots", label: "Robots" },
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact Us" },
  ];
  const profileRef = useRef();
  const notifRef = useRef();

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
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!user || !isDashboard) return;

    const fetchNotifications = async () => {
      setNotifLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/notifications`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) return;
        setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
        setUnreadCount(Number(data.unreadCount) || 0);
      } finally {
        setNotifLoading(false);
      }
    };

    fetchNotifications();
  }, [user, isDashboard, location.pathname]);

  const linkClass = (path) =>
    `text-sm font-semibold transition ${
      location.pathname === path
        ? "text-[#EC7B21]"
        : isDark
        ? "text-slate-100 hover:text-[#EC7B21]"
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
      setNotifOpen(false);
      setNotifications([]);
      setUnreadCount(0);
      navigate("/login");
    }
  };

  const markOneRead = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/notifications/${id}/read`, {
        method: "PATCH",
        credentials: "include",
      });
      if (!res.ok) return;
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch {
      // Ignore network errors.
    }
  };

  const markAllRead = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/notifications/read/all`, {
        method: "PATCH",
        credentials: "include",
      });
      if (!res.ok) return;
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      // Ignore network errors.
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 backdrop-blur-xl shadow-[0_6px_28px_rgba(15,23,42,0.06)] ${
        isDark
          ? "border-b border-slate-700/70 bg-slate-950/85"
          : "border-b border-orange-100/80 bg-white/85"
      }`}
    >
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

            <button
              type="button"
              onClick={toggleTheme}
              className="theme-toggle-btn inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition"
              aria-label="Toggle theme"
            >
              {isDark ? <FaSun size={13} /> : <FaMoon size={13} />}
              {isDark ? "Light" : "Dark"}
            </button>

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
                <div className="relative" ref={notifRef}>
                  <button
                    type="button"
                    className={`relative cursor-pointer transition ${
                      isDark ? "text-slate-200 hover:text-[#EC7B21]" : "text-gray-700 hover:text-[#EC7B21]"
                    }`}
                    onClick={() => setNotifOpen((prev) => !prev)}
                    aria-label="Notifications"
                  >
                    <HiBell className="text-2xl" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full min-w-4 h-4 px-1 inline-flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  {notifOpen && (
                    <div
                      className={`absolute right-0 top-10 w-80 shadow-xl rounded-xl z-50 overflow-hidden ${
                        isDark ? "bg-slate-900 border border-slate-700" : "bg-white border border-orange-100"
                      }`}
                    >
                      <div className={`px-3 py-2 flex items-center justify-between ${isDark ? "border-b border-slate-700" : "border-b border-orange-100"}`}>
                        <p className={`text-sm font-semibold ${isDark ? "text-slate-100" : "text-gray-800"}`}>Notifications</p>
                        <button
                          type="button"
                          className="text-xs text-[#EC7B21] font-semibold hover:underline disabled:text-gray-400"
                          onClick={markAllRead}
                          disabled={unreadCount === 0}
                        >
                          Mark all read
                        </button>
                      </div>

                      <div className="max-h-80 overflow-y-auto">
                        {notifLoading ? (
                          <p className={`px-3 py-4 text-sm ${isDark ? "text-slate-300" : "text-gray-600"}`}>Loading...</p>
                        ) : notifications.length === 0 ? (
                          <p className={`px-3 py-4 text-sm ${isDark ? "text-slate-300" : "text-gray-600"}`}>No notifications yet.</p>
                        ) : (
                          notifications.map((item) => (
                            <button
                              key={item._id}
                              type="button"
                              className={`w-full text-left px-3 py-3 ${
                                isDark
                                  ? `border-b border-slate-700 hover:bg-slate-800 ${item.isRead ? "bg-slate-900" : "bg-slate-800/60"}`
                                  : `border-b border-orange-50 hover:bg-orange-50/50 ${item.isRead ? "bg-white" : "bg-orange-50/40"}`
                              }`}
                              onClick={() => {
                                if (!item.isRead) markOneRead(item._id);
                              }}
                            >
                              <p className={`text-sm font-semibold ${isDark ? "text-slate-100" : "text-gray-800"}`}>{item.title}</p>
                              <p className={`text-xs mt-0.5 ${isDark ? "text-slate-300" : "text-gray-600"}`}>{item.message}</p>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className={`flex items-center gap-2 rounded-xl px-2 py-1.5 shadow-sm transition ${
                    isDark
                      ? "border border-slate-700 bg-slate-900 hover:border-slate-600"
                      : "border border-orange-100 bg-white hover:border-orange-200"
                  }`}
                  onClick={() => setProfileOpen(!profileOpen)}
                >
                  <span className="h-8 w-8 rounded-full bg-orange-100 text-[#EC7B21] font-bold text-sm inline-flex items-center justify-center">
                    {getInitial(user?.name)}
                  </span>
                  <span className={`font-semibold text-sm ${isDark ? "text-slate-100" : "text-gray-800"}`}>{user.name}</span>
                  <HiChevronDown className={`${profileOpen ? "rotate-180" : ""} transition-transform ${isDark ? "text-slate-200" : "text-gray-700"}`} />
                </button>

                {profileOpen && (
                  <div
                    className={`absolute right-0 top-12 w-48 shadow-xl rounded-xl flex flex-col z-50 overflow-hidden ${
                      isDark ? "bg-slate-900 border border-slate-700" : "bg-white border border-orange-100"
                    }`}
                  >
                    <Link
                      to="/profile"
                      className={`px-4 py-2.5 text-sm ${isDark ? "text-slate-100 hover:bg-slate-800" : "text-gray-700 hover:bg-orange-50"}`}
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
            className={`md:hidden inline-flex items-center justify-center h-10 w-10 rounded-xl ${
              isDark
                ? "border border-slate-700 bg-slate-900 text-slate-100"
                : "border border-orange-100 bg-white text-gray-700"
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div
              className={`rounded-2xl shadow-lg px-4 py-4 flex flex-col gap-2 ${
                isDark ? "border border-slate-700 bg-slate-900" : "border border-orange-100 bg-white"
              }`}
            >
              <button
                type="button"
                onClick={toggleTheme}
                className="theme-toggle-btn rounded-lg px-3 py-2 text-sm font-semibold text-left transition"
              >
                {isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              </button>

              {(!user || !isDashboard) &&
                publicLinks.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                      location.pathname === item.to
                        ? "bg-orange-50 text-[#EC7B21]"
                        : isDark
                        ? "text-slate-100 hover:bg-slate-800"
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
                <div className={`flex flex-col gap-2 pt-2 mt-1 ${isDark ? "border-t border-slate-700" : "border-t border-orange-100"}`}>
                  <Link
                    to="/profile"
                    className={`rounded-lg px-3 py-2 text-sm font-semibold ${isDark ? "text-slate-100 hover:bg-slate-800" : "text-gray-800 hover:bg-orange-50"}`}
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
