import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";

const Home = () => {
  return (
    <>
      {/* Google Font Import */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');
        `}
      </style>

      <div
        className="flex flex-col min-h-screen bg-white text-black"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        {/* Hero Section */}
        <section className="relative flex flex-col justify-center items-center text-center px-6 min-h-screen overflow-hidden">
          {/* Background Video */}
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

          {/* Gradient Overlay */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/60 via-black/30 to-black/60"></div>

          {/* Text Content */}
          <div className="relative z-10 max-w-4xl px-4">
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold text-white leading-tight drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)]">
              Robotics & AI Education
            </h1>

            <p className="mt-4 text-base sm:text-lg md:text-2xl font-medium text-white max-w-md sm:max-w-3xl mx-auto leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Making <strong>robotics</strong>, <strong>AI</strong>, and{" "}
              <strong>technology education</strong> approachable, practical, and
              exciting for learners of all ages.
            </p>

            {/* CTA Button */}
            <Link
              to="/kits"
              className="mt-6 sm:mt-10 inline-block bg-[#EC7B21] text-white px-8 sm:px-12 py-3 sm:py-4 rounded-lg font-semibold text-lg
              shadow-lg hover:shadow-[0_8px_15px_rgba(236,123,33,0.7)]
              transition-all duration-300 hover:scale-105"
            >
              Explore Robot Kits
            </Link>
          </div>
        </section>

        {/* Feature Section */}
        <section className="py-12 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 items-center gap-12">
            {/* Left Text */}
            <div className="space-y-6 text-center md:text-left">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#EC7B21] leading-tight">
                Build. Learn. Innovate.
              </h2>
              <p className="text-gray-800 text-base sm:text-lg md:text-xl leading-relaxed">
                Explore the world of robotics and AI with hands-on kits and guided projects.
                Whizrobo makes learning tech fun, practical, and accessible for everyone.
              </p>
              <Link
                to="/kits"
                className="inline-block bg-[#EC7B21] text-white px-6 sm:px-10 py-3 sm:py-4 rounded-xl font-semibold 
                shadow-lg hover:shadow-2xl transition-transform duration-300 hover:scale-105"
              >
                Discover Our Kits
              </Link>
            </div>

            {/* Right Image */}
            <div className="flex justify-center md:justify-end mt-8 md:mt-0">
              <img
                src="https://whizrobo.com/wp-content/uploads/2024/11/IBR11-scaled.jpg"
                alt="Hands-on Robotics Learning"
                className="rounded-xl shadow-2xl w-full max-w-sm sm:max-w-md object-contain"
                style={{ aspectRatio: "4/3" }}
              />
            </div>
          </div>
        </section>

        {/* App Download Section */}
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
