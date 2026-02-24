import React from "react";

const demoData = [
  {
    id: "1",
    name: "WhizBot",
    video: "/WhatsApp Video 2026-01-14 at 2.00.17 PM.mp4",
  },
  {
    id: "2",
    name: "WhizBuddy",
    video: "/WhatsApp Video 2026-01-14 at 2.00.17 PM.mp4",
  },
  {
    id: "3",
    name: "WhizGreeter",
    video: "/WhatsApp Video 2026-01-14 at 2.00.17 PM.mp4",
  },
  {
    id: "4",
    name: "WhizAaru",
    video: "/WhatsApp Video 2026-01-14 at 2.00.17 PM.mp4",
  },
];

const Demo = () => {
  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-100 via-white to-gray-100 pt-14 px-6 font-primary w-full">
      
      {/* Section Header */}
      <div className="text-center mb-14 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 drop-shadow-md">
          Robot Demo Videos
        </h1>
        <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
          Watch our robots in action! Each demo showcases their unique abilities and functions.
        </p>
      </div>

      {/* Demo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 px-4 w-full">
        {demoData.map((demo) => (
          <div
            key={demo.id}
            className="bg-white bg-opacity-40 backdrop-blur-md border border-gray-200 rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col"
          >
            {/* Video */}
            <div className="relative h-64 w-full overflow-hidden rounded-t-3xl">
              <video
                src={demo.video}
                controls
                className="object-cover w-full h-full transform transition-transform duration-500 hover:scale-105"
              />
              <span className="absolute top-4 left-4 bg-orange-500 rounded-full w-6 h-6 shadow-lg animate-pulse"></span>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow text-center">
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2 uppercase tracking-wider">
                {demo.name}
              </h3>

              <p className="text-gray-700 flex-grow">
                Experience the robot performing tasks, interacting with users, and showcasing its features.
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Demo;
