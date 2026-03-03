import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaLock, FaRobot, FaUserGraduate } from "react-icons/fa";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const fieldClass =
  "w-full rounded-xl border border-orange-200/70 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#EC7B21]/60";

const Login = ({ onLogin }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const registerPath = location.pathname === "/register";

  const [isRegister, setIsRegister] = useState(registerPath);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const titleText = useMemo(
    () => (isRegister ? "Create Your WHIZROBO Account" : "Welcome Back to WHIZROBO"),
    [isRegister]
  );

  const handleModeSwitch = (registerMode) => {
    setIsRegister(registerMode);
    setFormData({ name: "", email: "", password: "" });
    setShowPassword(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const url = isRegister
      ? `${API_BASE_URL}/api/auth/register`
      : `${API_BASE_URL}/api/auth/login`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.msg || "Something went wrong.");
        return;
      }

      localStorage.removeItem("token");
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success(
        isRegister
          ? `Welcome ${data.user.name}! Account created.`
          : `Welcome back ${data.user.name}.`
      );

      if (isRegister) {
        handleModeSwitch(false);
      } else {
        if (onLogin) onLogin(data.user);
        navigate("/dashboard");
      }
    } catch {
      toast.error("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section
        className="relative min-h-screen overflow-hidden bg-gradient-to-b from-orange-50/80 via-white to-amber-50/70 px-6 py-14"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-orange-200/30 blur-3xl" />
          <div className="absolute top-24 -right-24 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <div className="rounded-3xl bg-gradient-to-br from-[#EC7B21] to-orange-600 text-white p-7 sm:p-9 shadow-[0_20px_60px_rgba(236,123,33,0.35)]">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 border border-white/25">
              <FaRobot size={22} />
            </div>
            <h2 className="mt-5 text-3xl sm:text-4xl font-extrabold leading-tight">
              Learn, Build, and Scale with AI + Robotics
            </h2>
            <p className="mt-4 text-sm sm:text-base text-orange-50/95 leading-relaxed">
              Access kits, robots, and learning workflows from one account. Use login for existing users or create a new account to get started.
            </p>
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <FaUserGraduate size={12} />
                <span>Student-ready STEM journeys</span>
              </div>
              <div className="flex items-center gap-2">
                <FaLock size={12} />
                <span>Secure and role-based account flow</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-orange-200/70 via-amber-100/50 to-white p-[1px] shadow-[0_18px_55px_rgba(15,23,42,0.10)]">
            <div className="h-full rounded-3xl bg-white/90 backdrop-blur border border-orange-100/60 p-6 sm:p-8">
              <div className="inline-flex rounded-xl border border-orange-200/70 bg-orange-50/50 p-1 mb-6">
                <button
                  type="button"
                  onClick={() => handleModeSwitch(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    !isRegister ? "bg-white text-[#EC7B21] shadow-sm" : "text-gray-700"
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => handleModeSwitch(true)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    isRegister ? "bg-white text-[#EC7B21] shadow-sm" : "text-gray-700"
                  }`}
                >
                  Register
                </button>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {titleText}
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                {isRegister
                  ? "Enter your details to create your account."
                  : "Sign in to continue to your dashboard."}
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {isRegister && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      required
                      className={fieldClass}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className={fieldClass}
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-800 mb-1.5">Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="********"
                    required
                    className={`${fieldClass} pr-11`}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-[39px] text-gray-400 hover:text-[#EC7B21]"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full rounded-xl bg-gradient-to-r from-[#EC7B21] to-orange-600 text-white py-3 text-sm font-semibold shadow-sm transition hover:from-orange-600 hover:to-orange-700 ${
                    loading ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Please wait..." : isRegister ? "Create Account" : "Log In"}
                </button>
              </form>

              <p className="mt-5 text-xs text-gray-500 leading-relaxed">
                By continuing, you agree to our{" "}
                <Link to="/terms-and-conditions" className="text-[#EC7B21] hover:underline font-semibold">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy-policy" className="text-[#EC7B21] hover:underline font-semibold">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
