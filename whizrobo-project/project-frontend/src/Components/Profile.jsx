import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const Profile = () => {
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (storedUser) {
      setForm({
        name: storedUser.name || "",
        email: storedUser.email || "",
      });
    }

    const loadUser = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data?.user) return;

        localStorage.setItem("user", JSON.stringify(data.user));
        setForm({ name: data.user.name || "", email: data.user.email || "" });
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfile = async () => {
    const name = form.name.trim();
    const email = form.email.trim();
    if (name.length < 2) {
      toast.error("Name must be at least 2 characters.");
      return;
    }
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.msg || "Unable to update profile.");
        return;
      }

      if (data?.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      toast.success("Profile updated successfully.");
    } catch {
      toast.error("Server error. Try again later.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-100 pt-28 px-4">
      <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-[#EC7B21] mb-8">
          Edit Profile
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            disabled={loading || saving}
            className="w-full border border-gray-300 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:bg-gray-100"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            disabled={loading || saving}
            className="w-full border border-gray-300 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:bg-gray-100"
          />
        </div>

        <button
          onClick={saveProfile}
          disabled={loading || saving}
          className="w-full bg-[#EC7B21] text-white py-3 rounded-xl font-semibold transition-all duration-200 hover:bg-orange-600 hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default Profile;
