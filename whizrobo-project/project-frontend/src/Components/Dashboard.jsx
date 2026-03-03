import React, { useMemo, useState } from "react";
import {
  FaArrowRight,
  FaBars,
  FaRobot,
  FaSearch,
  FaTachometerAlt,
  FaTimes,
  FaToolbox,
} from "react-icons/fa";

const kitsData = {
  IOT: [
    {
      id: 1,
      name: "WHIZ IOT",
      src: "/Level - 6 (IOT Kit).jpg",
      description:
        "Build smart devices and connected solutions for homes, farms, and industrial sensors.",
      grades: ["GRADES 10-12", "DIGITAL TRANSFORMATION LEARNING", "INTRODUCTION TO IOT"],
    },
    {
      id: 2,
      name: "WHIZ BT",
      src: "/Level - 7 (IOT Kit).jpg",
      description:
        "Bluetooth-enabled kit for wireless communication, smart automation, and robotics projects.",
      grades: ["GRADES 7-9", "SMART AUTOMATION AND MONITORING", "REAL-WORLD IOT EXPERIENCE"],
    },
  ],
  WHIZROBO: [
    {
      id: 3,
      name: "WHIZ BUILDER",
      src: "/WHIZ builder (2).jpg",
      description:
        "Entry-level robotics kit to build simple robots and understand circuits.",
      grades: ["GRADES 1-2", "BASIC ROBOT BUILDING", "FOUNDATION FOR STEM"],
    },
    {
      id: 4,
      name: "WHIZ CREATOR",
      src: "/Whiz Creator.jpg",
      description:
        "Modular STEM kit to explore electronics, sensors, and creative robotics projects.",
      grades: ["GRADES 3-4", "CREATIVE ROBOTICS AND CODING", "CODING CLUB READY"],
    },
    {
      id: 5,
      name: "WHIZ BOX",
      src: "/WHIZ BOX.jpg",
      description:
        "All-in-one robotics and electronics experimentation box with built-in sensors.",
      grades: ["GRADES 3-5", "CLASSROOM DEMOS", "ELECTRONICS AND CODING BASICS"],
    },
  ],
};

const robotsData = [
  {
    id: "1",
    name: "WhizBot",
    image: "/IMG_3903.png",
    shortDesc: "Automates workflows and delivers intelligent actions for complex tasks.",
    bullets: [
      "Manages multi-step tasks",
      "Provides real-time operational support",
      "Smart agent for data automation",
    ],
    footer: "Simplifies operations through intelligent workflow management.",
  },
  {
    id: "2",
    name: "WhizBuddy",
    image: "/IMG_3942.png",
    shortDesc: "Smart assistant for schools, helping teachers and students.",
    bullets: [
      "Personalized assistance for students and staff",
      "Schedules and reminders management",
      "Facilitates interactive learning",
    ],
    footer: "Supports productivity and learning through intelligent assistance.",
  },
  {
    id: "3",
    name: "WhizGreeter",
    image: "/IMG_3991.png",
    shortDesc: "Welcomes visitors with AI-powered interaction and scheduling.",
    bullets: [
      "Manages front desk communication",
      "Handles appointment and visitor info",
      "Guides guests with interactive directions",
    ],
    footer: "Delivers a smart and interactive front desk experience.",
  },
  {
    id: "4",
    name: "WhizAaru",
    image: "/IMG_3994.png",
    shortDesc: "AI teacher delivering personalized lessons and real-time support.",
    bullets: [
      "Interactive lessons across subjects",
      "Dynamic quizzes and learning paths",
      "Automates educator workflows",
    ],
    footer: "Enhances teaching and learning through intelligent classroom support.",
  },
];

const sidebarItems = [
  { name: "Dashboard", key: "IOT", icon: FaTachometerAlt },
  { name: "Robot Kits", key: "WHIZROBO", icon: FaToolbox },
  { name: "Robots", key: "ROBOTS", icon: FaRobot },
];

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("IOT");
  const [searchTerm, setSearchTerm] = useState("");

  const handleCategoryClick = (key) => {
    setActiveCategory(key);
    setSidebarOpen(false);
  };

  const filteredKits = useMemo(() => {
    const source = kitsData[activeCategory] || [];
    const query = searchTerm.trim().toLowerCase();
    if (!query) return source;
    return source.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
    );
  }, [activeCategory, searchTerm]);

  const filteredRobots = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return robotsData;
    return robotsData.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.shortDesc.toLowerCase().includes(query)
    );
  }, [searchTerm]);

  const isRobots = activeCategory === "ROBOTS";
  const visibleCount = isRobots ? filteredRobots.length : filteredKits.length;

  return (
    <>
      <div
        className="flex min-h-screen bg-gradient-to-b from-orange-50/70 via-white to-amber-50/60 text-gray-900"
      >
        {sidebarOpen && (
          <button
            className="fixed inset-0 bg-black/25 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar overlay"
          />
        )}

        <aside
          className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-white/90 backdrop-blur-xl border-r border-orange-100 shadow-[0_10px_40px_rgba(15,23,42,0.08)] transform transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        >
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-orange-100">
              <div>
                <p className="text-xs font-semibold text-orange-700 tracking-wide">WHIZROBO</p>
                <h2 className="text-xl font-extrabold text-gray-900">Control Panel</h2>
              </div>
              <button
                type="button"
                className="md:hidden h-9 w-9 rounded-xl border border-orange-100 text-gray-700"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close menu"
              >
                <FaTimes className="mx-auto" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-4">
              <ul className="space-y-2">
                {sidebarItems.map((item) => (
                  <li key={item.key}>
                    <button
                      type="button"
                      onClick={() => handleCategoryClick(item.key)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${
                        activeCategory === item.key
                          ? "bg-gradient-to-r from-[#EC7B21] to-orange-600 text-white shadow-sm"
                          : "text-gray-700 hover:bg-orange-50"
                      }`}
                    >
                      <item.icon className="text-sm" />
                      <span className="font-semibold text-sm">{item.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>

        <main className="flex-1 w-full">
          <div className="md:hidden flex items-center justify-between px-4 py-4 border-b border-orange-100 bg-white/90 backdrop-blur">
            <button
              type="button"
              className="h-10 w-10 rounded-xl border border-orange-100 bg-white text-gray-700"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <FaBars className="mx-auto" />
            </button>
            <span className="font-extrabold text-[#EC7B21]">Dashboard</span>
            <span className="w-10" />
          </div>

          <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
            <div className="rounded-3xl bg-gradient-to-br from-orange-200/70 via-amber-100/50 to-white p-[1px] shadow-[0_18px_55px_rgba(15,23,42,0.10)]">
              <div className="rounded-3xl bg-white/85 backdrop-blur border border-orange-100/60 p-5 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-orange-700 tracking-wide">WHIZROBO DASHBOARD</p>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">Manage Kits and Robots</h1>
                    <p className="text-sm text-gray-600 mt-1">
                      {visibleCount} item{visibleCount === 1 ? "" : "s"} found in {isRobots ? "Robots" : activeCategory}
                    </p>
                  </div>

                  <div className="relative w-full md:w-80">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400 text-sm" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Search kits or robots..."
                      className="w-full rounded-xl border border-orange-200/70 bg-white pl-9 pr-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#EC7B21]/60"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {isRobots &&
                filteredRobots.map((robot) => (
                  <article
                    key={robot.id}
                    className="group rounded-2xl border border-orange-100 bg-white/95 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <div className="w-full h-56 flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-gray-100 p-5">
                      <img
                        src={robot.image}
                        alt={robot.name}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    </div>
                    <div className="p-5">
                      <h2 className="text-xl font-extrabold text-gray-900">{robot.name}</h2>
                      <p className="text-sm text-gray-600 mt-2 leading-relaxed">{robot.shortDesc}</p>
                      <ul className="mt-3 space-y-2">
                        {robot.bullets.map((point) => (
                          <li key={point} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#EC7B21] flex-shrink-0" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                      <button
                        type="button"
                        className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#EC7B21] to-orange-600 text-white py-2.5 text-sm font-semibold transition hover:from-orange-600 hover:to-orange-700"
                      >
                        View Details
                        <FaArrowRight className="text-xs" />
                      </button>
                    </div>
                  </article>
                ))}

              {!isRobots &&
                filteredKits.map((kit) => (
                  <article
                    key={kit.id}
                    className="group rounded-2xl border border-orange-100 bg-white/95 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <img
                      src={kit.src}
                      alt={kit.name}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="p-5">
                      <h2 className="text-xl font-extrabold text-gray-900">{kit.name}</h2>
                      <p className="text-sm text-gray-600 mt-2 leading-relaxed">{kit.description}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {kit.grades.map((grade) => (
                          <span
                            key={grade}
                            className="inline-flex items-center rounded-full border border-orange-200/70 bg-orange-50/70 px-2.5 py-1 text-[10px] font-semibold text-[#EC7B21]"
                          >
                            {grade}
                          </span>
                        ))}
                      </div>
                      <button
                        type="button"
                        className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#EC7B21] to-orange-600 text-white py-2.5 text-sm font-semibold transition hover:from-orange-600 hover:to-orange-700"
                      >
                        View Details
                        <FaArrowRight className="text-xs" />
                      </button>
                    </div>
                  </article>
                ))}
            </div>

            {visibleCount === 0 && (
              <div className="mt-8 rounded-2xl border border-orange-100 bg-white/90 p-8 text-center">
                <p className="text-gray-700 font-semibold">No matching items found.</p>
                <p className="text-sm text-gray-500 mt-1">Try a different keyword or change the category.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
