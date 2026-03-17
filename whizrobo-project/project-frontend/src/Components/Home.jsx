import React from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaRobot,
} from "react-icons/fa";

const Home = () => {
  return (
    <>
      <div
        className="flex flex-col min-h-screen bg-gradient-to-b from-[#fffaf5] via-white to-[#fff7ee] text-black"
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
                className="inline-flex items-center gap-2 bg-[#EC7B21] text-white px-7 sm:px-9 py-3 rounded-xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-[0_8px_15px_rgba(236,123,33,0.7)] transition-all duration-300 hover:scale-105"
              >
                Explore Robots
                <FaArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        <section className="relative py-14 sm:py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto">
              <p className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700 tracking-wide">
                WHIZROBO ROBOTS
              </p>
              <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                Build your robotics journey
              </h2>
              <p className="mt-3 text-gray-700 text-base sm:text-lg">
                Meet the robots designed for education, engagement, and smart automation.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6">
              <article className="group rounded-3xl border border-orange-100 bg-white/90 backdrop-blur shadow-[0_18px_45px_rgba(15,23,42,0.08)] p-6 sm:p-7 transition hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(15,23,42,0.12)] max-w-3xl mx-auto">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-[#EC7B21]">
                  <FaRobot size={20} />
                </div>
                <h3 className="mt-4 text-2xl font-extrabold text-gray-900">Robots Section</h3>
                <p className="mt-3 text-gray-700 leading-relaxed">
                  Explore WhizBot, WhizBuddy, WhizGreeter, and WhizAaru with use-cases for teaching, support, and automation.
                </p>
                <Link
                  to="/robots"
                  className="mt-6 inline-flex items-center gap-2 text-[#EC7B21] font-bold hover:text-orange-700 transition"
                >
                  Go to Robots
                  <FaArrowRight size={13} />
                </Link>
              </article>
            </div>
          </div>
        </section>

        <section className="py-12 flex flex-col items-center gap-4 px-6">
          <a
            href="https://play.google.com/store/apps/details?id=com.whizrobo&pcampaignid=web_share"
            className="transition-transform hover:scale-105"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
              alt="Get it on Google Play"
              className="h-14 w-auto max-w-xs sm:max-w-sm mx-auto"
            />
          </a>

          <a
            href="https://play.google.com/store/apps/details?id=com.whizrobo&pcampaignid=web_share"
            className="mt-4 px-8 py-3 bg-[#EC7B21] text-white rounded-lg font-semibold text-lg
            shadow-lg hover:shadow-[0_8px_15px_rgba(236,123,33,0.7)]
            transition-all duration-300 hover:scale-105 text-center"
          >
            Download
          </a>
        </section>
      </div>
    </>
  );
};

export default Home;
