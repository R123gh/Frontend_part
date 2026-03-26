import React from "react";
import { useParams } from "react-router-dom";

const robotsData = [
  {
    id: "1",
    name: "WHIZBOT",
    image: "/WhizBot.jpg",
    description: "AI Agent",
    bullets: [
      "Automates complex workflows and manages multi-step tasks.",
      "Provides real-time operational support within school systems.",
      "Acts as a smart agent for data integration and automation.",
    ],
    footer:
      "WhizBot simplifies operations by intelligently managing workflows and system automation.",
  },
  {
    id: "2",
    name: "WHIZBUDDY",
    image: "/WhizBuddy.jpg",
    description: "AI Assistant",
    bullets: [
      "Supports students and staff with personalized assistance.",
      "Helps manage schedules, reminders and basic queries.",
      "Facilitates interactive learning and collaborative projects.",
    ],
    footer:
      "WhizBuddy supports productivity and learning through intelligent assistance.",
  },
  {
    id: "3",
    name: "WHIZGREETER",
    image: "/WhizGreet.jpg",
    description: "AI Receptionist",
    bullets: [
      "Welcomes visitors and manages front desk communications.",
      "Handles appointment scheduling and visitor information.",
      "Guides guests through premises with interactive directions.",
    ],
    footer:
      "WhizGreeter delivers a smart and interactive front desk experience.",
  },
  {
    id: "4",
    name: "WHIZAARU",
    image: "/Whiz aaru.jpg",
    description: "AI Teacher",
    bullets: [
      "Delivers interactive, personalized lessons across subjects.",
      "Creates dynamic quizzes and learning paths tailored to students.",
      "Assists educators by automating administrative tasks and tracking progress.",
    ],
    footer:
      "WhizAaru enhances teaching and learning through intelligent classroom support.",
  },
];

const RobotDetails = () => {
  const { id } = useParams();
  const robot = robotsData.find((r) => r.id === id);

  if (!robot) {
    return (
      <main className="min-h-screen flex flex-col justify-center items-center px-6 bg-white">
        <h2 className="text-3xl font-extrabold mb-2 text-black">
          Robot not found
        </h2>
        <p className="text-lg max-w-md text-center text-black/70">
          Please check the URL or select a valid robot.
        </p>
      </main>
    );
  }

  return (
    <>
      <main
        className="min-h-screen bg-white pt-24 px-6 flex justify-center"
      >
        <div className="w-full max-w-[1400px] flex flex-col md:flex-row items-center md:items-start gap-12">
          {/* Text Content */}
          <article className="md:w-1/2 flex flex-col gap-6 md:gap-8 p-6 md:p-10 bg-white rounded-3xl border border-black/10 shadow-lg transition-shadow duration-300">
            <h1 className="text-5xl md:text-6xl font-extrabold text-black text-center md:text-left uppercase tracking-wide">
              {robot.name}
            </h1>

            <p className="text-lg md:text-xl text-black/70 leading-relaxed">
              {robot.description}
            </p>

            <ul className="space-y-4 mt-4">
              {robot.bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-4 text-black/80">
                  <span
                    className="mt-1 inline-block h-4 w-4 flex-shrink-0 rounded-full bg-[#EC7B21]"
                    aria-hidden="true"
                  />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            <hr className="my-6 border-black/10" />

            <p className="text-black font-semibold italic text-lg md:text-xl">
              {robot.footer}
            </p>
          </article>

          {/* Image */}
          <div className="md:w-1/2 flex justify-center items-center rounded-3xl overflow-hidden border border-black/10 shadow-md transition-shadow duration-300">
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

