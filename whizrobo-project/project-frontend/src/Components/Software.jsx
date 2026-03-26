import React from "react";

const softwareData = [
  {
    id: "1",
    name: "WhizBot App",
    image: "/software-whizbot.png",
    description: "Control your WhizBot, configure routines and monitor activities in real-time.",
    link: "#",
  },
  {
    id: "2",
    name: "WhizBuddy Studio",
    image: "/software-whizbuddy.png",
    description: "Drag-and-drop programming environment for learning robotics.",
    link: "#",
  },
  {
    id: "3",
    name: "WhizGreeter AI",
    image: "/software-whizgreeter.png",
    description: "AI software for greeting and assisting users with natural language processing.",
    link: "#",
  },
  {
    id: "4",
    name: "WhizAaru Control",
    image: "/software-whizaaru.png",
    description: "Advanced control software for autonomous robot movements.",
    link: "#",
  },
];

const Software = () => {
  return (
    <section className="min-h-screen bg-white pt-14 px-6 w-full">

      {/* Section Header */}
      <div className="text-center mb-14 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-black">
          Our Software Tools
        </h1>
        <p className="mt-3 text-black/70 max-w-2xl mx-auto">
          Explore our software solutions for robotics, AI and STEM learning.
        </p>
      </div>

      {/* Software Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 px-4 w-full">
        {softwareData.map((software) => (
          <div
            key={software.id}
            className="bg-white border border-black/10 rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col"
          >
            {/* Image */}
            <div className="relative h-64 w-full overflow-hidden rounded-t-3xl">
              <img
                src={software.image}
                alt={software.name}
                className="object-contain w-full h-full transform transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
              <span className="absolute top-4 left-4 bg-[#EC7B21] rounded-full w-6 h-6 shadow-lg animate-pulse"></span>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow text-center">
              <h3 className="text-xl md:text-2xl font-semibold text-black mb-2 uppercase tracking-wider">
                {software.name}
              </h3>
              <p className="text-black/70 flex-grow">{software.description}</p>

              <a
                href={software.link}
                className="mt-6 inline-block bg-[#EC7B21] hover:opacity-90 text-white font-semibold rounded-full px-6 py-3 shadow-lg transition-all duration-300"
              >
                Download / Learn More →
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Software;
