import React from "react";
import { FaBrain, FaChalkboardTeacher, FaRocket, FaUsers } from "react-icons/fa";
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
    text: "Every solution is centered on practical humanoid robot usage for classroom, campus, and operational environments.",
    icon: FaChalkboardTeacher,
  },
  {
    title: "Role-Specific Robots",
    text: "Our lineup includes dedicated robots for assistance, teaching, reception, and workflow automation with clear use-cases.",
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
          isDark
            ? "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"
            : "bg-[radial-gradient(circle_at_15%_15%,rgba(251,191,36,0.20),transparent_35%),radial-gradient(circle_at_85%_20%,rgba(236,123,33,0.18),transparent_40%),linear-gradient(to_bottom,rgba(255,247,237,0.92),#ffffff,rgba(255,251,235,0.88))]"
        }`}
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className={`absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl ${isDark ? "bg-orange-500/20" : "bg-orange-200/40"}`} />
          <div className={`absolute top-20 -right-20 h-72 w-72 rounded-full blur-3xl ${isDark ? "bg-amber-500/20" : "bg-amber-200/40"}`} />
          <div className={`absolute inset-0 [background-size:30px_30px] ${isDark ? "opacity-20 [background-image:linear-gradient(to_right,rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.12)_1px,transparent_1px)]" : "opacity-40 [background-image:linear-gradient(to_right,rgba(236,123,33,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(236,123,33,0.06)_1px,transparent_1px)]"}`} />
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <p className="inline-flex items-center gap-2 rounded-full border border-orange-200/70 bg-white/75 px-3 py-1 text-xs font-semibold text-orange-700 shadow-sm">
              <FaBrain size={11} />
              About WHIZROBO
            </p>
            <h1 className="mt-4 text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
              Built Around Robots. Designed for Real-World Impact.
            </h1>
            <p className="mt-4 text-base md:text-lg text-gray-700 leading-relaxed">
              WHIZROBO is focused on humanoid robots that support education, communication, reception, and automation through practical deployment.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            <div className={`rounded-3xl p-[1px] shadow-[0_18px_60px_rgba(15,23,42,0.12)] ${isDark ? "bg-gradient-to-br from-slate-700/60 via-slate-800/30 to-slate-700/60" : "bg-gradient-to-br from-orange-300/70 via-amber-100/70 to-white"}`}>
              <div className={`h-full rounded-3xl backdrop-blur p-6 sm:p-8 ${isDark ? "bg-slate-900/90 border border-slate-700/80" : "bg-white/90 border border-orange-100/80"}`}>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  Why organizations choose our robots
                </h2>
                <p className="mt-3 text-gray-700 leading-relaxed">
                  We build and deliver humanoid robot solutions that are easy to deploy, simple to operate, and tailored for real educational and institutional needs.
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
                      className="flex items-center gap-2 border border-orange-100 rounded-xl px-3 py-2 text-gray-800 bg-orange-50/40"
                    >
                      <span className="text-[#EC7B21] font-bold">+</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={`rounded-3xl p-[1px] shadow-[0_18px_60px_rgba(15,23,42,0.12)] ${isDark ? "bg-gradient-to-br from-slate-700/60 via-slate-800/30 to-slate-700/60" : "bg-gradient-to-br from-orange-300/70 via-amber-100/70 to-white"}`}>
              <div className={`h-full rounded-3xl backdrop-blur p-4 sm:p-6 ${isDark ? "bg-slate-900/90 border border-slate-700/80" : "bg-white/90 border border-orange-100/80"}`}>
                <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 mb-4">
                  Our Robot Lineup
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {robotGallery.map((robot) => (
                    <article
                      key={robot.name}
                      className="group relative aspect-square overflow-hidden rounded-2xl border border-orange-100 shadow-[0_10px_24px_rgba(15,23,42,0.10)]"
                    >
                      <img
                        src={robot.src}
                        alt={robot.alt}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
                className="rounded-2xl border border-orange-100 bg-white/90 backdrop-blur p-5 text-center shadow-[0_12px_36px_rgba(15,23,42,0.08)]"
              >
                <p className="text-[#EC7B21] text-3xl font-extrabold">{item.value}</p>
                <p className="mt-1 text-sm font-semibold text-gray-700">{item.label}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="rounded-2xl border border-orange-100 bg-white/90 backdrop-blur p-6 shadow-[0_12px_36px_rgba(15,23,42,0.08)]"
                >
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-[#EC7B21]">
                    <Icon size={18} />
                  </div>
                  <h3 className="mt-4 text-lg font-extrabold text-gray-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-700 leading-relaxed">{item.text}</p>
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
