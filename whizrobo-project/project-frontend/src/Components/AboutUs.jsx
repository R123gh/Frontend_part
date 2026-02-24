import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

const AboutUs = () => {
  return (
    <section className="bg-white min-h-screen px-6 py-16">
      {/* Font */}
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');`}
      </style>

      <div
        className="max-w-5xl mx-auto"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        {/* HERO */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-black mb-4">
            About <span className="text-[#EC7B21]">WHIZROBO</span>
          </h1>
          <p className="text-base md:text-xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            Whizrobo exists to make robotics, AI, and technology education
            approachable, practical, and exciting.
          </p>
        </div>

        {/* FEATURE SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* IMAGE */}
          <div className="flex justify-center">
            <div className="relative w-[340px] h-[340px] md:w-[400px] md:h-[400px] bg-white rounded-2xl border border-black/10 flex items-center justify-center">
              <img
                src="https://whizrobo.com/wp-content/uploads/2024/11/aaaru.jpeg"
                alt="Whizrobo Robotics Learning"
                className="w-[85%] h-[85%] rounded-full object-cover"
              />

            
            </div>
          </div>

          {/* CONTENT */}
          <div className="max-w-xl mx-auto bg-white rounded-2xl border border-black/10 p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
              India’s #1 Learning Platform –{" "}
              <span className="text-[#EC7B21]">WHIZROBO</span>
            </h2>

            <p className="text-black/70 text-base mb-3 leading-relaxed">
              Whizrobo introduces students to robotics, AI, and emerging
              technologies through hands-on and engaging learning experiences.
            </p>

            <p className="text-black/70 text-base mb-6 leading-relaxed">
              Our programs help K–12 learners build real skills in coding,
              electronics, IoT, and design thinking using practical projects.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {[
                "Startup India Registered",
                "STEM.ORG Accredited",
                "Intel Technology Partner",
                "ISRO Space Tutor",
                "NITI Aayog ATL Partner",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 border border-black/10 rounded-lg px-3 py-2 text-black"
                >
                  <span className="text-[#EC7B21] font-bold">✔</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* IMPACT */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-black mb-12">
            Our Impact
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: "10,00,000+", label: "Students Trained" },
              { value: "300+", label: "Schools Served" },
              { value: "10,000+", label: "Workshops Delivered" },
              { value: "30", label: "India Book Records" },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white border border-black/10 rounded-2xl p-6 text-center"
              >
                <p className="text-[#EC7B21] text-3xl font-extrabold mb-2">
                  {item.value}
                </p>
                <p className="text-black/70 font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* VALUES */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-black mb-12">
            Values We Live By
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Collaboration",
                text: "We work closely with schools and partners to deliver meaningful learning.",
              },
              {
                title: "Practical Learning",
                text: "We focus on real skills that students can apply beyond the classroom.",
              },
              {
                title: "Continuous Growth",
                text: "We constantly improve our programs to stay relevant and effective.",
              },
            ].map((v) => (
              <div
                key={v.title}
                className="bg-white border border-black/10 rounded-2xl p-6 text-center"
              >
                <h3 className="text-lg font-bold text-[#EC7B21] mb-3">
                  {v.title}
                </h3>
                <p className="text-black/70 text-sm leading-relaxed">
                  {v.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        
        </div>

        
     
    </section>
  );
};

export default AboutUs;
