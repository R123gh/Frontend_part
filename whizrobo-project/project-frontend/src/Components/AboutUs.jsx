import React from "react";
import { FaBrain, FaChalkboardTeacher, FaRocket, FaUsers } from "react-icons/fa";

const impactStats = [
  { value: "10,00,000+", label: "Students Trained" },
  { value: "300+", label: "Schools Served" },
  { value: "10,000+", label: "Workshops Delivered" },
  { value: "30", label: "India Book Records" },
];

const values = [
  {
    title: "Hands-On Learning",
    text: "Students learn by building projects, testing ideas, and solving real classroom challenges.",
    icon: FaChalkboardTeacher,
  },
  {
    title: "Future Skills",
    text: "Programs cover coding, robotics, IoT, and AI with age-appropriate pathways from foundation to advanced.",
    icon: FaRocket,
  },
  {
    title: "Inclusive Growth",
    text: "Schools, educators, and learners are supported with practical content and guided implementation.",
    icon: FaUsers,
  },
];

const AboutUs = () => {
  return (
    <>
      <section
        className="relative min-h-screen overflow-hidden bg-gradient-to-b from-orange-50/80 via-white to-amber-50/70 px-6 py-14 md:py-16"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-orange-200/30 blur-3xl" />
          <div className="absolute top-20 -right-20 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <p className="inline-flex items-center gap-2 rounded-full border border-orange-200/70 bg-white/75 px-3 py-1 text-xs font-semibold text-orange-700 shadow-sm">
              <FaBrain size={11} />
              About WHIZROBO
            </p>
            <h1 className="mt-4 text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
              Building Future Innovators Through Robotics and AI
            </h1>
            <p className="mt-4 text-base md:text-lg text-gray-700 leading-relaxed">
              WHIZROBO helps K-12 learners build practical skills in robotics, coding, IoT, and AI through guided, project-based learning.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            <div className="rounded-3xl bg-gradient-to-br from-orange-200/70 via-amber-100/50 to-white p-[1px] shadow-[0_18px_55px_rgba(15,23,42,0.10)]">
              <div className="h-full rounded-3xl bg-white/85 backdrop-blur border border-orange-100/60 p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  Why schools choose us
                </h2>
                <p className="mt-3 text-gray-700 leading-relaxed">
                  Since 2016, our mission has been to make deep-tech learning practical and accessible. The platform combines curated kits, AI-enabled robots, and structured implementation support.
                </p>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {[
                    "Startup India Registered",
                    "STEM.ORG Accredited",
                    "Intel Technology Partner",
                    "ISRO Space Tutor",
                    "NITI Aayog ATL Partner",
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

            <div className="rounded-3xl bg-gradient-to-br from-orange-200/70 via-amber-100/50 to-white p-[1px] shadow-[0_18px_55px_rgba(15,23,42,0.10)]">
              <div className="h-full rounded-3xl bg-white/85 backdrop-blur border border-orange-100/60 p-4 sm:p-6 flex items-center justify-center">
                <div className="relative w-full max-w-md aspect-square rounded-3xl border border-orange-100 overflow-hidden shadow-lg">
                  <img
                    src="https://whizrobo.com/wp-content/uploads/2024/11/aaaru.jpeg"
                    alt="Whizrobo Robotics Learning"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {impactStats.map((item) => (
              <article
                key={item.label}
                className="rounded-2xl border border-orange-100 bg-white/85 backdrop-blur p-5 text-center shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
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
                  className="rounded-2xl border border-orange-100 bg-white/85 backdrop-blur p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
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
