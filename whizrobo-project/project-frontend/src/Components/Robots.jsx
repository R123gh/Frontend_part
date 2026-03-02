import React, { useEffect, useRef, useState } from "react";
import { FaCompress, FaExpand, FaMicrophone, FaPlay, FaRobot, FaStop } from "react-icons/fa";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

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
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [ragInput, setRagInput] = useState("");
  const [ragLoading, setRagLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isChatFullscreen, setIsChatFullscreen] = useState(false);
  const [ttsLoadingId, setTtsLoadingId] = useState(null);
  const [ttsPlayingId, setTtsPlayingId] = useState(null);
  const [ragMessages, setRagMessages] = useState([
    {
      role: "assistant",
      content: "Ask me anything about our robots, features, and use-cases.",
    },
  ]);
  const messagesEndRef = useRef(null);
  const chatPanelRef = useRef(null);
  const recognitionRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ragMessages, ragLoading]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsChatFullscreen(document.fullscreenElement === chatPanelRef.current);
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        transcript += event.results[i][0].transcript;
      }
      setRagInput(transcript.trim());
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    setSpeechSupported(true);

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const formatAssistantAnswer = (rawText) =>
    (rawText || "")
      .replace(/\r/g, "")
      .replace(/^\s*[*-]\s+/gm, "")
      .replace(/\*/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

  const toSpeakableText = (value) =>
    String(value || "")
      .replace(/\s+/g, " ")
      .trim();

  const stopTts = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setTtsPlayingId(null);
    setTtsLoadingId(null);
  };

  const playTts = async (text, messageId) => {
    const speakable = toSpeakableText(text);
    if (!speakable) return;

    if (ttsPlayingId === messageId) {
      stopTts();
      return;
    }

    stopTts();
    setTtsLoadingId(messageId);

    try {
      const res = await fetch(`${API_BASE_URL}/api/rag/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: speakable }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.msg || "Unable to generate speech.");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        URL.revokeObjectURL(url);
        if (audioRef.current === audio) audioRef.current = null;
        setTtsPlayingId(null);
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        if (audioRef.current === audio) audioRef.current = null;
        setTtsPlayingId(null);
      };

      await audio.play();
      setTtsPlayingId(messageId);
    } catch (_error) {
      setTtsPlayingId(null);
    } finally {
      setTtsLoadingId(null);
    }
  };

  const toggleMicListening = () => {
    if (!speechSupported || !recognitionRef.current || ragLoading) return;

    if (isListening) {
      recognitionRef.current.stop();
      return;
    }

    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (_err) {
      setIsListening(false);
    }
  };

  const askRobotRag = async () => {
    const query = ragInput.trim();
    if (!query || ragLoading) return;

    const nextMessages = [...ragMessages, { role: "user", content: query }];
    setRagMessages(nextMessages);
    setRagInput("");
    setRagLoading(true);

    try {
      const history = nextMessages.slice(-8).map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch(`${API_BASE_URL}/api/rag/ask-robot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, history }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.msg || "Robot RAG request failed.");
      }

      const answer = formatAssistantAnswer(data.answer || "No response from assistant.");
      setRagMessages((prev) => [...prev, { role: "assistant", content: answer }]);
    } catch (error) {
      setRagMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Unable to fetch response: ${error.message}` },
      ]);
    } finally {
      setRagLoading(false);
    }
  };

  const toggleChatFullscreen = async () => {
    const panel = chatPanelRef.current;
    if (!panel) return;

    try {
      if (document.fullscreenElement === panel) {
        await document.exitFullscreen();
      } else {
        await panel.requestFullscreen();
      }
    } catch (_error) {
      setIsChatFullscreen(false);
    }
  };

  const chatPanelClasses = isChatFullscreen
    ? "w-screen h-screen max-w-none rounded-none mb-0"
    : "mb-3 w-[calc(100vw-1rem)] sm:w-96 max-w-[27rem] rounded-2xl";

  return (
    <>
      {/* Google Font */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');
        `}
      </style>

      <section
        className="min-h-screen bg-gradient-to-b from-orange-50/60 via-white to-amber-50/40 px-4 sm:px-6 pt-20 pb-16 font-sans"
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
        <div className="flex flex-col gap-10 md:gap-14">
          {robotsData.map((robot, index) => (
            <div
              key={robot.id}
              className={`group flex flex-col md:flex-row items-center bg-white/90 backdrop-blur rounded-3xl shadow-[0_12px_40px_rgba(15,23,42,0.08)] border border-orange-100/70 overflow-hidden transition-transform duration-500 hover:scale-[1.01] ${
                index % 2 !== 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Robot Image */}
              <div className="md:w-1/2 h-72 md:h-[26rem] flex items-center justify-center overflow-hidden relative bg-gradient-to-b from-orange-50/20 to-white p-4 md:p-6">
                <img
                  src={robot.image}
                  alt={robot.name}
                  className="object-contain w-full h-full rounded-2xl shadow-md transition-transform duration-500 group-hover:scale-[1.02]"
                  loading="lazy"
                  onError={(e) => (e.target.src = "/images/placeholder.png")}
                />
              </div>

              {/* Robot Content */}
              <div className="md:w-1/2 p-6 sm:p-8 md:p-12 flex flex-col justify-center text-center md:text-left">
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

                <p className="text-gray-900 font-semibold text-lg">
                  {robot.footer}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="fixed right-2 sm:right-6 z-[60] bottom-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div
            ref={chatPanelRef}
            className={`${chatPanelClasses} border border-orange-100 bg-white shadow-2xl overflow-hidden transition-all duration-300 origin-bottom-right ${
              isChatOpen
                ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                : "opacity-0 translate-y-4 scale-95 pointer-events-none"
            }`}
          >
            <div className="bg-gradient-to-r from-[#EC7B21] to-[#f39a4f] text-white px-3 sm:px-4 py-3 flex items-start justify-between gap-2 sm:gap-3">
              <div>
                <h3 className="text-base font-bold tracking-wide flex items-center gap-2">
                  AI Assistant
                  <span className="relative inline-flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                  </span>
                </h3>
                <p className="text-xs opacity-95">Ask about robot features, setup, and technical capabilities.</p>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={toggleChatFullscreen}
                  className="text-white/90 hover:text-white text-[11px] sm:text-xs font-semibold border border-white/30 rounded-md px-2 py-1 inline-flex items-center gap-1"
                  aria-label="Toggle full screen"
                >
                  {isChatFullscreen ? <FaCompress size={10} /> : <FaExpand size={10} />}
                  <span className="hidden sm:inline">{isChatFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
                </button>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-white/90 hover:text-white text-sm font-semibold"
                  aria-label="Close assistant"
                >
                  Close
                </button>
              </div>
            </div>

            <div className={`bg-[#fffaf6] p-3 overflow-y-auto space-y-3 ${isChatFullscreen ? "h-[calc(100vh-13rem)] sm:h-[calc(100vh-12.75rem)]" : "h-[min(58vh,22rem)] sm:h-80"}`}>
              {ragMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`max-w-[92%] px-3 py-2.5 rounded-xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "ml-auto bg-[#EC7B21] text-white shadow-sm"
                      : "mr-auto bg-white border border-orange-100 text-gray-800 shadow-sm"
                  }`}
                >
                  {msg.content}
                  {msg.role === "assistant" && msg.content?.trim() && (
                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={() => playTts(msg.content, idx)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-semibold border ${
                          ttsPlayingId === idx
                            ? "border-red-300 text-red-600 bg-red-50"
                            : "border-orange-300 text-[#EC7B21] hover:bg-orange-50"
                        }`}
                      >
                        {ttsLoadingId === idx ? (
                          "Loading..."
                        ) : ttsPlayingId === idx ? (
                          <>
                            <FaStop size={10} />
                            Stop
                          </>
                        ) : (
                          <>
                            <FaPlay size={10} />
                            Listen
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {ragLoading && (
                <div className="mr-auto bg-white border border-orange-100 text-gray-700 px-3 py-2.5 rounded-xl text-sm shadow-sm animate-pulse">
                  AI Assistant is typing...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 bg-white border-t border-orange-50 flex flex-wrap sm:flex-nowrap gap-2">
              <input
                type="text"
                value={ragInput}
                onChange={(e) => setRagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") askRobotRag();
                }}
                placeholder="Ask about WhizBot, WhizBuddy, WhizGreeter..."
                className="order-1 basis-full sm:basis-auto sm:order-none flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#EC7B21]"
              />
              <button
                onClick={toggleMicListening}
                disabled={!speechSupported || ragLoading}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                  isListening
                    ? "bg-red-500 text-white animate-pulse"
                    : speechSupported
                    ? "bg-white border border-[#EC7B21] text-[#EC7B21] hover:bg-orange-50"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
                aria-label="Use microphone"
                title={speechSupported ? "Speak your question" : "Speech input not supported in this browser"}
              >
                <FaMicrophone size={14} />
              </button>
              <button
                onClick={askRobotRag}
                disabled={ragLoading || !ragInput.trim()}
                className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition min-w-20 ${
                  ragLoading || !ragInput.trim()
                    ? "bg-orange-300 cursor-not-allowed"
                    : "bg-[#EC7B21] hover:bg-orange-600"
                }`}
              >
                Send
              </button>
            </div>
          </div>

          <button
            onClick={() => setIsChatOpen((prev) => !prev)}
            className="ml-auto relative overflow-hidden flex items-center gap-2 rounded-full bg-[#EC7B21] text-white px-3 sm:px-4 py-3 shadow-xl hover:bg-orange-600 transition-all active:scale-95 hover:shadow-[0_0_28px_rgba(236,123,33,0.55)]"
            aria-expanded={isChatOpen}
            aria-label="Toggle AI assistant"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-orange-400/20 via-yellow-200/20 to-orange-500/20 animate-pulse" />
            <span className="absolute -inset-2 rounded-full border border-orange-300/60 animate-ping" />
            <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-sm">
              <FaRobot size={15} />
            </span>
            <span className="relative font-semibold text-sm tracking-wide hidden xs:inline">AI Assistant</span>
          </button>
        </div>
      </section>
    </>
  );
};

export default Robots;
