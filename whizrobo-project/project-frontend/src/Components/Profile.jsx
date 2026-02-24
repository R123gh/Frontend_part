import React, { useState, useEffect } from "react";

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    avatar: "",
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const saveProfile = () => {
    localStorage.setItem("user", JSON.stringify(user));
    alert("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-100 pt-28 px-4">
      <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl">

        <h2 className="text-3xl font-bold text-center text-[#EC7B21] mb-8">
          Edit Profile
        </h2>

        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <img
              src={user.avatar || "https://i.pravatar.cc/150"}
              alt="avatar"
              className="h-28 w-28 rounded-full ring-4 ring-orange-200 object-cover transition hover:scale-105"
            />
          </div>
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Avatar URL */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Avatar Image URL
          </label>
          <input
            type="text"
            name="avatar"
            value={user.avatar}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        <button
          onClick={saveProfile}
          className="w-full bg-[#EC7B21] text-white py-3 rounded-xl font-semibold
                     transition-all duration-200 hover:bg-orange-600 hover:scale-[1.02] active:scale-95"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Profile;
