import React, { useState } from "react";

/* ===================== KITS DATA ===================== */
const kitsData = {
  IOT: [
    {
      id: 1,
      name: "WHIZ IOT",
      src: "/Level - 6 (IOT Kit).jpg",
      description:
        "Build smart devices and connected solutions for homes, farms, and industrial sensors.",
      grades: ["GRADES 10–12", "DIGITAL TRANSFORMATION LEARNING", "INTRODUCTION TO IOT"],
    },
    {
      id: 2,
      name: "WHIZ BT",
      src: "/Level - 7 (IOT Kit).jpg",
      description:
        "Bluetooth-enabled kit for wireless communication, smart automation, and robotics projects.",
      grades: ["GRADES 7–9", "SMART AUTOMATION & MONITORING", "REAL-WORLD IOT EXPERIENCE"],
    },
  ],

  WHIZROBO: [
    {
      id: 3,
      name: "WHIZ BUILDER",
      src: "/WHIZ builder (2).jpg",
      description:
        "Entry-level robotics kit to build simple robots and understand circuits.",
      grades: ["GRADES 1–2", "BASIC ROBOT BUILDING", "FOUNDATION FOR STEM"],
    },
    {
      id: 4,
      name: "WHIZ CREATOR",
      src: "/Whiz Creator.jpg",
      description:
        "Modular STEM kit to explore electronics, sensors, and creative robotics projects.",
      grades: ["GRADES 3–4", "CREATIVE ROBOTICS & CODING", "CODING CLUB READY"],
    },
    {
      id: 5,
      name: "WHIZ BOX",
      src: "/WHIZ BOX.jpg",
      description:
        "All-in-one robotics and electronics experimentation box with built-in sensors.",
      grades: ["GRADES 3–5", "CLASSROOM DEMOS", "ELECTRONICS & CODING BASICS"],
    },
  ],
};

/* ===================== ROBOTS DATA ===================== */
const robotsData = [
  {
    id: "1",
    name: "WhizBot",
    image: "/WhizBot.jpg",
    shortDesc: "Automates workflows and delivers intelligent actions for complex tasks.",
    bullets: [
      "Manages multi-step tasks",
      "Real-time operational support",
      "Smart agent for data automation",
    ],
    footer: "Simplifies operations through intelligent workflow management.",
  },
  {
    id: "2",
    name: "WhizBuddy",
    image: "/WhizBuddy.jpg",
    shortDesc: "Smart assistant for schools, helping teachers and students.",
    bullets: [
      "Personalized assistance for students & staff",
      "Schedules and reminders management",
      "Facilitates interactive learning",
    ],
    footer: "Supports productivity and learning through intelligent assistance.",
  },
  {
    id: "3",
    name: "WhizGreeter",
    image: "/WhizGreet.jpg",
    shortDesc: "Welcomes visitors with AI-powered interaction and scheduling.",
    bullets: [
      "Manages front desk communication",
      "Appointment scheduling & visitor info",
      "Guides guests with interactive directions",
    ],
    footer: "Delivers a smart and interactive front desk experience.",
  },
  {
    id: "4",
    name: "WhizAaru",
    image: "/Whiz aaru.jpg",
    shortDesc: "AI Teacher delivering personalized lessons and real-time support.",
    bullets: [
      "Interactive lessons across subjects",
      "Dynamic quizzes and learning paths",
      "Automates administrative tasks",
    ],
    footer: "Enhances teaching and learning through intelligent classroom support.",
  },
];

/* ===================== SIDEBAR ITEMS ===================== */
const sidebarItems = [
  { name: "Dashboard", key: "IOT", icon: "📊" },
  { name: "Robot Kits", key: "WHIZROBO", icon: "🤖" },
  { name: "Robots", key: "ROBOTS", icon: "🦾" },
];

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("IOT");

  const handleCategoryClick = (key) => {
    setActiveCategory(key);
    setSidebarOpen(false);
  };

  const renderCards = () => {
    if (activeCategory === "ROBOTS") {
      return robotsData.map((robot) => (
        <div
          key={robot.id}
          className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-transform transform hover:-translate-y-1"
        >
          <img
            src={robot.image}
            alt={robot.name}
            className="w-full h-48 object-cover rounded-t-xl"
          />
          <div className="p-5">
            <h2 className="text-xl font-bold mb-2">{robot.name}</h2>
            <p className="text-gray-600 mb-3">{robot.shortDesc}</p>
            <ul className="list-disc list-inside mb-4 text-gray-600 space-y-1">
              {robot.bullets.map((b, idx) => (
                <li key={idx}>{b}</li>
              ))}
            </ul>
            <p className="text-gray-500 font-medium">{robot.footer}</p>
            <div className="flex mt-4">
              <button className="flex-1 bg-[#EC7B21] text-white py-2 rounded-lg font-medium hover:bg-[#d66e1a] transition">
                View Details
              </button>
            </div>
          </div>
        </div>
      ));
    } else {
      return kitsData[activeCategory].map((kit) => (
        <div
          key={kit.id}
          className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-transform transform hover:-translate-y-1"
        >
          <img
            src={kit.src}
            alt={kit.name}
            className="w-full h-48 object-cover rounded-t-xl"
          />
          <div className="p-5">
            <h2 className="text-xl font-bold mb-2">{kit.name}</h2>
            <p className="text-gray-600 mb-3">{kit.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {kit.grades.map((grade, idx) => (
                <span
                  key={idx}
                  className="bg-[#EC7B21]/10 text-[#EC7B21] px-3 py-1 rounded-full text-xs font-semibold"
                >
                  {grade}
                </span>
              ))}
            </div>
            <div className="flex">
              <button className="flex-1 bg-[#EC7B21] text-white py-2 rounded-lg font-medium hover:bg-[#d66e1a] transition">
                View Details
              </button>
            </div>
          </div>
        </div>
      ));
    }
  };

  return (
    <div className="flex min-h-screen font-sans bg-gray-100 text-gray-900">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-50 w-64 bg-white border-r border-gray-200 flex flex-col h-full transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex items-center justify-between p-6 text-2xl font-bold text-[#EC7B21]">
          Whizrobo
          <button
            className="md:hidden text-xl"
            onClick={() => setSidebarOpen(false)}
          >
            ✖
          </button>
        </div>
        <nav className="flex-1 px-4">
          <ul className="space-y-2 mt-4">
            {sidebarItems.map((item, index) => (
              <li
                key={index}
                onClick={() => handleCategoryClick(item.key)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer transition ${
                  activeCategory === item.key
                    ? "bg-[#EC7B21] text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col w-full">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between bg-white p-4 border-b shadow-sm">
          <button
            className="text-2xl"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
          <span className="font-bold text-[#EC7B21]">Whizrobo</span>
        </div>

        <div className="p-4 md:p-8 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
              <p className="text-gray-500">Manage your kits and robots efficiently</p>
            </div>

            <input
              type="text"
              placeholder="Search kits or robots..."
              className="w-full md:w-72 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#EC7B21]"
            />
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderCards()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
