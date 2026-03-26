import React from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaBuilding,
  FaHospitalAlt,
  FaRobot,
  FaSchool,
} from "react-icons/fa";

const Home = () => {
  return (
    <>
      <div
        className="flex flex-col min-h-screen bg-white text-black"
      >
        <section className="relative flex flex-col justify-center items-center text-center px-6 min-h-screen overflow-hidden">
          <video
            className="absolute top-0 left-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source
              src="/WhatsApp Video 2026-01-20 at 1.14.09 PM.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>

          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/60 via-black/30 to-black/60"></div>

          <div className="relative z-10 max-w-4xl px-4">
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold text-white leading-tight drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)]">
              Discover the Future with Robots.
            </h1>

            <p className="mt-4 text-base sm:text-lg md:text-2xl font-medium text-white max-w-md sm:max-w-3xl mx-auto leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Explore AI-powered robots built for teaching, assistance, and
              real-world automation in schools and institutions.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Link
                to="/robots"
                className="inline-flex items-center gap-2 bg-[#EC7B21] text-white px-7 sm:px-9 py-3 rounded-xl font-semibold text-base sm:text-lg shadow-md transition-all duration-300 hover:opacity-90"
              >
                Explore Robots
                <FaArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        <section className="py-14 sm:py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto">
              <p className="inline-flex items-center rounded-full border border-black/10 bg-[#EC7B21]/10 px-3 py-1 text-xs font-bold text-[#EC7B21] tracking-wide">
                Real-World Examples
              </p>
              <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold text-black leading-tight">
                Robots Solving Practical, Daily Problems
              </h2>
              <p className="mt-3 text-black/70 text-base sm:text-lg">
                WHIZROBO robots are deployed in real environments where they reduce workload, guide people and deliver consistent support.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <article className="rounded-3xl border border-black/10 bg-white p-6 shadow-[0_16px_40px_rgba(0,0,0,0.08)] transition hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(0,0,0,0.12)]">
                <img
                  src="https://images.unsplash.com/photo-1764727291644-5dcb0b1a0375?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000"
                  alt="Hospital reception area"
                  className="h-48 w-full rounded-2xl object-cover"
                  loading="lazy"
                />
                <div className="mt-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EC7B21]/10 text-[#EC7B21]">
                  <FaHospitalAlt size={20} />
                </div>
                <h3 className="mt-4 text-xl font-extrabold text-black">Healthcare & Hospitals</h3>
                <p className="mt-3 text-black/70 leading-relaxed">
                  Robots handle patient guidance, appointment flow, queue updates and visitor assistance to improve service speed and clarity.
                </p>
              </article>

              <article className="rounded-3xl border border-black/10 bg-white p-6 shadow-[0_16px_40px_rgba(0,0,0,0.08)] transition hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(0,0,0,0.12)]">
                <img
                  src="https://images.pexels.com/photos/7750825/pexels-photo-7750825.jpeg?cs=srgb&dl=pexels-a-darmel-7750825.jpg&fm=jpg"
                  alt="Student working with a robotics kit"
                  className="h-48 w-full rounded-2xl object-cover"
                  loading="lazy"
                />
                <div className="mt-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EC7B21]/10 text-[#EC7B21]">
                  <FaSchool size={20} />
                </div>
                <h3 className="mt-4 text-xl font-extrabold text-black">Education & Smart Learning</h3>
                <p className="mt-3 text-black/70 leading-relaxed">
                  Robots support interactive lessons, quick Q&A and structured learning routines for classrooms and campus programs.
                </p>
              </article>

              <article className="rounded-3xl border border-black/10 bg-white p-6 shadow-[0_16px_40px_rgba(0,0,0,0.08)] transition hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(0,0,0,0.12)]">
                <img
                  src="https://images.unsplash.com/photo-1746173099013-8d401dc5c907?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000"
                  alt="Modern corporate reception desk"
                  className="h-48 w-full rounded-2xl object-cover"
                  loading="lazy"
                />
                <div className="mt-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EC7B21]/10 text-[#EC7B21]">
                  <FaBuilding size={20} />
                </div>
                <h3 className="mt-4 text-xl font-extrabold text-black">Corporate Offices & Reception Automation</h3>
                <p className="mt-3 text-black/70 leading-relaxed">
                  Robots welcome guests, handle visitor check-ins, provide directions and keep front desks running smoothly.
                </p>
              </article>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
