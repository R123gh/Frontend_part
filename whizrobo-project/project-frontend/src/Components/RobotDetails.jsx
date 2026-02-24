import React from "react";
import { useParams } from "react-router-dom";

const robotsData = [
  {
    id: "1",
    name: "WHIZ BOT",
    image: "/WhizBot.jpg",
    description: "WHIZ BOT – AI AGENT",
    bullets: [
      "Automates complex workflows and manages multi-step tasks.",
      "Provides real-time operational support within school systems.",
      "Acts as a smart agent for data integration and automation.",
    ],
    footer:
      "WHIZ BOT simplifies operations by intelligently managing workflows and system automation.",
  },
  {
    id: "2",
    name: "WHIZ BUDDY",
    image: "/WhizBuddy.jpg",
    description: "WHIZ BUDDY – AI ASSISTANT",
    bullets: [
      "Supports students and staff with personalized assistance.",
      "Helps manage schedules, reminders, and basic queries.",
      "Facilitates interactive learning and collaborative projects.",
    ],
    footer:
      "WHIZ BUDDY supports productivity and learning through intelligent assistance.",
  },
  {
    id: "3",
    name: "WHIZ GREETER",
    image: "/WhizGreet.jpg",
    description: "WHIZ GREETER – AI RECEPTIONIST",
    bullets: [
      "Welcomes visitors and manages front desk communications.",
      "Handles appointment scheduling and visitor information.",
      "Guides guests through premises with interactive directions.",
    ],
    footer:
      "WHIZ GREETER delivers a smart and interactive front desk experience.",
  },
  {
    id: "4",
    name: "WHIZ AARU",
    image: "/Whiz aaru.jpg",
    description: "WHIZ AARU – AI TEACHER",
    bullets: [
      "Delivers interactive, personalized lessons across subjects.",
      "Creates dynamic quizzes and learning paths tailored to students.",
      "Assists educators by automating administrative tasks and tracking progress.",
    ],
    footer:
      "WHIZ AARU enhances teaching and learning through intelligent classroom support.",
  },
];

const RobotDetails = () => {
  const { id } = useParams();
  const robot = robotsData.find((r) => r.id === id);

  if (!robot) {
    return (
      <main className="min-h-screen flex flex-col justify-center items-center px-6 bg-gray-50 font-sans">
        <h2 className="text-3xl font-extrabold mb-2 text-gray-900">
          Robot not found
        </h2>
        <p className="text-lg max-w-md text-center text-gray-700">
          Please check the URL or select a valid robot.
        </p>
      </main>
    );
  }

  return (
    <>
      {/* Google Font */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');
        `}
      </style>

      <main
        className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 px-6 flex justify-center font-sans"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        <div className="w-full max-w-[1400px] flex flex-col md:flex-row items-center md:items-start gap-12">
          {/* Text Content */}
          <article className="md:w-1/2 flex flex-col gap-6 md:gap-8 p-6 md:p-10 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 text-center md:text-left uppercase tracking-wide">
              {robot.name}
            </h1>

            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              {robot.description}
            </p>

            <ul className="space-y-4 mt-4">
              {robot.bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-4 text-gray-800">
                  <span
                    className="mt-1 inline-block h-4 w-4 flex-shrink-0 rounded-full bg-[#EC7B21]"
                    aria-hidden="true"
                  />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            <hr className="my-6 border-gray-300" />

            <p className="text-gray-900 font-semibold italic text-lg md:text-xl">
              {robot.footer}
            </p>
          </article>

          {/* Image */}
          <div className="md:w-1/2 flex justify-center items-center rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
            <img
              src={robot.image}
              alt={robot.name}
              className="max-h-[550px] w-auto md:w-full object-contain rounded-3xl"
              loading="lazy"
              draggable={false}
              onError={(e) => (e.target.src = "/images/placeholder.png")}
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default RobotDetails;
