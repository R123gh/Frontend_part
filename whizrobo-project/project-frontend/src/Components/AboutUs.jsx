import React from "react";
import { FaChalkboardTeacher, FaRocket, FaUsers } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const robotGallery = [
  { src: "/IMG_3903.png", alt: "WhizBot humanoid robot", name: "IMG_3903" },
  { src: "/IMG_3942.png", alt: "WhizBuddy humanoid robot", name: "IMG_3942" },
  { src: "/IMG_3991.png", alt: "WhizGreeter humanoid robot", name: "IMG_3991" },
  { src: "/IMG_3994.png", alt: "WhizAaru humanoid robot", name: "IMG_3994" },
];

const impactStats = [
  { value: "4", label: "Core Humanoid Robots" },
  { value: "24/7", label: "Operational Assistance" },
  { value: "Real-Time", label: "Interactive Responses" },
  { value: "Multi-Role", label: "Education + Front Office + Automation" },
];

const values = [
  {
    title: "Robot-First Design",
    text: "Every solution is centered on practical humanoid robot usage for classroom, campus and operational environments.",
    icon: FaChalkboardTeacher,
  },
  {
    title: "Role-Specific Robots",
    text: "Our lineup includes dedicated robots for assistance, teaching, reception and workflow automation with clear use-cases.",
    icon: FaRocket,
  },
  {
    title: "Deployment Ready",
    text: "From setup to day-to-day support, we focus on reliable robot integration that works in real institutions.",
    icon: FaUsers,
  },
];

const AboutUs = () => {
  const { isDark } = useTheme();

  return (
    <>
      <section
        className={`relative min-h-screen overflow-hidden px-6 py-14 md:py-16 ${
          isDark ? "bg-black text-white" : "bg-white text-black"
        }`}
      >
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className={`mt-4 text-4xl md:text-6xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-black"}`}>
              Built Around Robots. Designed for Real-World Impact.
            </h1>
            <p className={`mt-4 text-base md:text-lg leading-relaxed ${isDark ? "text-white/70" : "text-black/70"}`}>
              WHIZROBO is focused on humanoid robots that support education, communication, reception and automation through practical deployment.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            <div className={`rounded-3xl border shadow-[0_18px_60px_rgba(0,0,0,0.12)] ${isDark ? "border-white/10 bg-black" : "border-black/10 bg-white"}`}>
              <div className="h-full rounded-3xl p-6 sm:p-8">
                <h2 className={`text-2xl sm:text-3xl font-extrabold ${isDark ? "text-white" : "text-black"}`}>
                  Why organizations choose our robots
                </h2>
                <p className={`mt-3 leading-relaxed ${isDark ? "text-white/70" : "text-black/70"}`}>
                  We build and deliver humanoid robot solutions that are easy to deploy, simple to operate and tailored for real educational and institutional needs.
                </p>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {[
                    "WhizBot - Workflow Automation",
                    "WhizBuddy - Smart Assistance",
                    "WhizGreeter - Front Desk Interaction",
                    "WhizAaru - Classroom Teaching",
                    "Robot-Focused End-to-End Support",
                  ].map((item) => (
                    <div
                      key={item}
                      className={`flex items-center gap-2 border rounded-xl px-3 py-2 ${
                        isDark
                          ? "border-white/10 bg-white/5 text-white/80"
                          : "border-black/10 bg-black/5 text-black/80"
                      }`}
                    >
                      <span className="text-[#EC7B21] font-bold">+</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={`rounded-3xl border shadow-[0_18px_60px_rgba(0,0,0,0.12)] ${isDark ? "border-white/10 bg-black" : "border-black/10 bg-white"}`}>
              <div className="h-full rounded-3xl p-4 sm:p-6">
                <h3 className={`text-lg sm:text-xl font-extrabold mb-4 ${isDark ? "text-white" : "text-black"}`}>
                  Our Robot Lineup
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {robotGallery.map((robot) => (
                    <article
                      key={robot.name}
                      className={`group relative aspect-square overflow-hidden rounded-2xl border bg-white p-3 sm:p-4 flex items-center justify-center shadow-[0_10px_24px_rgba(0,0,0,0.10)] ${
                        isDark ? "border-white/10 bg-black" : "border-black/10"
                      }`}
                    >
                      <img
                        src={robot.src}
                        alt={robot.alt}
                        className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {impactStats.map((item) => (
              <article
                key={item.label}
                className={`rounded-2xl border p-5 text-center shadow-[0_12px_36px_rgba(0,0,0,0.08)] ${
                  isDark ? "border-white/10 bg-black" : "border-black/10 bg-white"
                }`}
              >
                <p className="text-[#EC7B21] text-3xl font-extrabold">{item.value}</p>
                <p className={`mt-1 text-sm font-semibold ${isDark ? "text-white/70" : "text-black/70"}`}>{item.label}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className={`rounded-2xl border p-6 shadow-[0_12px_36px_rgba(0,0,0,0.08)] ${
                    isDark ? "border-white/10 bg-black" : "border-black/10 bg-white"
                  }`}
                >
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#EC7B21]/10 text-[#EC7B21]">
                    <Icon size={18} />
                  </div>
                  <h3 className={`mt-4 text-lg font-extrabold ${isDark ? "text-white" : "text-black"}`}>{item.title}</h3>
                  <p className={`mt-2 text-sm leading-relaxed ${isDark ? "text-white/70" : "text-black/70"}`}>{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUs;
