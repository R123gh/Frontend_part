import React from "react";

const robotsData = [
  {
    id: "1",
    name: "WhizBot",
    image: "/WhizBot.jpg",
    shortDesc:
      "Automates workflows and delivers intelligent actions to simplify complex tasks.",
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
    name: "WhizBuddy",
    image: "/WhizBuddy.jpg",
    shortDesc:
      "Smart assistant for schools, helping teachers manage classrooms and support students.",
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
    name: "WhizGreeter",
    image: "/WhizGreet.jpg",
    shortDesc:
      "Welcomes visitors with AI-powered interaction, face recognition, and scheduling assistance.",
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
    name: "WhizAaru",
    image: "/Whiz aaru.jpg",
    shortDesc:
      "AI Teacher delivering personalized lessons, quizzes, and real-time learning support.",
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

const Robots = () => {
  return (
    <>
      {/* Google Font */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');
        `}
      </style>

      <section
        className="min-h-screen bg-gray-50 px-6 pt-20 pb-16 font-sans"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        {/* Header */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Meet Our Robots
          </h1>
          <p className="mt-4 text-gray-700 text-base md:text-lg leading-relaxed">
            Explore our advanced robotics solutions designed to inspire learning,
            innovation, and smarter automation.
          </p>
        </div>

        {/* Robots List */}
        <div className="flex flex-col gap-16">
          {robotsData.map((robot, index) => (
            <div
              key={robot.id}
              className={`flex flex-col md:flex-row items-center bg-white rounded-3xl shadow-lg overflow-hidden transition-transform duration-500 hover:scale-105 ${
                index % 2 !== 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Robot Image */}
              <div className="md:w-1/2 h-80 md:h-[28rem] flex items-center justify-center overflow-hidden relative bg-gray-50">
                <img
                  src={robot.image}
                  alt={robot.name}
                  className="object-contain w-full h-full rounded-2xl shadow-md transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                  onError={(e) => (e.target.src = "/images/placeholder.png")}
                />
              </div>

              {/* Robot Content */}
              <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center text-center md:text-left">
                <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 uppercase mb-2 transition-transform duration-500 hover:translate-y-[-3px]">
                  {robot.name}
                </h3>
                <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4">
                  {robot.shortDesc}
                </p>

                <p className="text-gray-800 font-semibold text-lg md:text-xl mb-4">
                  {robot.description}
                </p>

                <ul className="space-y-3 mb-4">
                  {robot.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-700">
                      <span
                        className="mt-1 inline-block h-3 w-3 flex-shrink-0 rounded-full bg-[#EC7B21]"
                        aria-hidden="true"
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-gray-900 font-semibold  text-lg">
                  {robot.footer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Robots;
