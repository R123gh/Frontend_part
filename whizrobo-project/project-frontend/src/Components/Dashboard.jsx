import React, { useMemo, useState } from "react";
import {
  FaArrowRight,
  FaSearch,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

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

const Dashboard = () => {
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRobots = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return robotsData;
    return robotsData.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.shortDesc.toLowerCase().includes(query)
    );
  }, [searchTerm]);

  const visibleCount = filteredRobots.length;

  return (
    <>
      <div
        className={`min-h-screen transition-colors duration-300 ${
          isDark ? "bg-black text-white" : "bg-white text-black"
        }`}
      >
        <main className="w-full">
          <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
            <div className={`rounded-3xl border shadow-[0_18px_55px_rgba(0,0,0,0.10)] ${isDark ? "border-white/10 bg-black" : "border-black/10 bg-white"}`}>
              <div className="rounded-3xl p-5 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-[#EC7B21] tracking-wide">WHIZROBO DASHBOARD</p>
                    <h1 className={`text-2xl sm:text-3xl font-extrabold mt-1 ${isDark ? "text-white" : "text-black"}`}>Manage Robots</h1>
                    <p className={`text-sm mt-1 ${isDark ? "text-white/70" : "text-black/60"}`}>
                      {visibleCount} robot{visibleCount === 1 ? "" : "s"} found
                    </p>
                  </div>

                  <div className="relative w-full md:w-80">
                    <FaSearch className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm ${isDark ? "text-white/60" : "text-black/40"}`} />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Search robots..."
                      className={`w-full rounded-xl pl-9 pr-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#EC7B21]/40 ${
                        isDark
                          ? "border border-white/15 bg-black text-white placeholder:text-white/50"
                          : "border border-black/10 bg-white text-black placeholder:text-black/40"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRobots.map((robot) => (
                <article
                  key={robot.id}
                  className={`group rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden ${
                    isDark ? "border border-white/10 bg-black" : "border border-black/10 bg-white"
                  }`}
                >
                  <div
                    className={`w-full h-56 flex items-center justify-center p-5 ${
                      isDark ? "bg-white/5" : "bg-black/5"
                    }`}
                  >
                    <img
                      src={robot.image}
                      alt={robot.name}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="p-5">
                    <h2 className={`text-xl font-extrabold ${isDark ? "text-white" : "text-black"}`}>{robot.name}</h2>
                    <p className={`text-sm mt-2 leading-relaxed ${isDark ? "text-white/70" : "text-black/60"}`}>{robot.shortDesc}</p>
                    <ul className="mt-3 space-y-2">
                      {robot.bullets.map((point) => (
                        <li key={point} className={`text-sm flex items-start gap-2 ${isDark ? "text-white/70" : "text-black/60"}`}>
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#EC7B21] flex-shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#EC7B21] text-white py-2.5 text-sm font-semibold transition hover:opacity-90"
                    >
                      View Details
                      <FaArrowRight className="text-xs" />
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {visibleCount === 0 && (
              <div
                className={`mt-8 rounded-2xl p-8 text-center ${
                  isDark ? "border border-white/10 bg-black" : "border border-black/10 bg-white"
                }`}
              >
                <p className={`font-semibold ${isDark ? "text-white" : "text-black"}`}>No matching robots found.</p>
                <p className={`text-sm mt-1 ${isDark ? "text-white/60" : "text-black/60"}`}>Try a different keyword.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
