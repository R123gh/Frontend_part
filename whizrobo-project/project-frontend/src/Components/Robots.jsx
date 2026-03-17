import React, { useEffect, useRef, useState } from "react";
import { FaCompress, FaExpand, FaMicrophone, FaPlay, FaRobot, FaStop } from "react-icons/fa";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const robotsData = [
  {
    id: "1",
    name: "WhizBot",
    image: "/IMG_3903.png",
    shortDesc:
      "Automates workflows and delivers intelligent actions to simplify complex tasks.",
    manualFile: "whizbot-user-manual.pdf",
    description: "WHIZ BOT - AI AGENT",
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
    image: "/IMG_3942.png",
    shortDesc:
      "Smart assistant for schools, helping teachers manage classrooms and support students.",
    manualFile: "whizbuddy-user-manual.pdf",
    description: "WHIZ BUDDY - AI ASSISTANT",
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
    image: "/IMG_3991.png",
    shortDesc:
      "Welcomes visitors with AI-powered interaction, face recognition, and scheduling assistance.",
    manualFile: "whizgreeter-user-manual.pdf",
    description: "WHIZ GREETER - AI RECEPTIONIST",
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
    image: "/IMG_3994.png",
    shortDesc:
      "AI Teacher delivering personalized lessons, quizzes, and real-time learning support.",
    manualFile: "whizaaru-user-manual.pdf",
    description: "WHIZ AARU - AI TEACHER",
    bullets: [
      "Delivers interactive, personalized lessons across subjects.",
      "Creates dynamic quizzes and learning paths tailored to students.",
      "Assists educators by automating administrative tasks and tracking progress.",
    ],
    footer:
      "WHIZ AARU enhances teaching and learning through intelligent classroom support.",
  },
];

const normalizeText = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getSmartReply = (query, contextLabel) => {
  const normalized = normalizeText(query);
  if (!normalized) return null;

  const isGreeting =
    /^(hi|hii|hello|hey|heyy|good morning|good afternoon|good evening)$/.test(normalized) ||
    ((/\b(hi|hii|hello|hey)\b/.test(normalized) && normalized.split(" ").length <= 4));
  if (isGreeting) {
    return (
      `Hello! Whizrobo is the organization, and under it we have four robots: ` +
      `WhizBot, WhizBuddy, WhizAaru, and WhizGreeter (WhizGreet). ` +
      `I can help you with ${contextLabel}. Ask about features, use-cases, deployment flow, integration, or which robot best fits your requirement.`
    );
  }

  if (/\b(thank you|thanks|thx)\b/.test(normalized)) {
    return "You are welcome. If useful, I can provide a side-by-side comparison with recommendation criteria.";
  }

  if (/\b(bye|goodbye|see you|see ya)\b/.test(normalized)) {
    return "Thank you for connecting. I am here whenever you want a detailed robot recommendation.";
  }

  if (/\b(help|support|assist me)\b/.test(normalized)) {
    return `Certainly. I can support with ${contextLabel}, implementation strategy, and expected outcomes for education or operations.`;
  }

  if (/\b(who are you|what can you do|capabilities)\b/.test(normalized)) {
    return "I am your WHIZROBO robot assistant. I provide professional and informative guidance for robot selection, usage, and planning.";
  }

  return null;
};

const makeProfessionalAnswer = (rawAnswer, contextLabel) => {
  const cleaned = String(rawAnswer || "")
    .replace(/\r/g, "")
    .replace(/^\s*[*-]\s+/gm, "")
    .replace(/\*/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (!cleaned) {
    return `I can help with ${contextLabel}. Please share your specific goal, and I will provide a structured recommendation.`;
  }

  if (cleaned.length < 80) {
    return `${cleaned}\n\nIf you share your exact scenario, I can provide a more detailed and actionable answer.`;
  }

  return cleaned;
};

const extractApiErrorMessage = async (response, fallback) => {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const payload = await response.json().catch(() => ({}));
    return payload.msg || payload.error || payload.details || fallback;
  }
  const text = await response.text().catch(() => "");
  return text?.trim() || fallback;
};

const getManualUrl = (fileName) => {
  if (!fileName) return "#";
  const base = API_BASE_URL || "";
  return `${base}/api/manuals/${encodeURIComponent(fileName)}`;
};

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
      content:
        "Whizrobo is the organization. Under it, we have four robots: WhizBot, WhizBuddy, WhizAaru, and WhizGreeter (WhizGreet). Ask me anything about their features and use-cases.",
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
        credentials: "include",
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
    } catch {
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
    } catch {
      setIsListening(false);
    }
  };

  const askRobotRag = async () => {
    const query = ragInput.trim();
    if (!query || ragLoading) return;

    const nextMessages = [...ragMessages, { role: "user", content: query }];
    setRagMessages(nextMessages);
    setRagInput("");

    const contextLabel = "our humanoid robots, their features, and practical use-cases";
    const quickReply = getSmartReply(query, contextLabel);
    if (quickReply) {
      setRagMessages((prev) => [...prev, { role: "assistant", content: quickReply }]);
      return;
    }

    setRagLoading(true);

    try {
      const history = nextMessages.slice(-8).map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch(`${API_BASE_URL}/api/rag/ask-robot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, history }),
        credentials: "include",
      });

      if (!res.ok) {
        const errorMessage = await extractApiErrorMessage(res, "Robot RAG request failed.");
        throw new Error(errorMessage);
      }

      const data = await res.json().catch(() => ({}));
      const answer = makeProfessionalAnswer(data.answer, contextLabel);
      setRagMessages((prev) => [...prev, { role: "assistant", content: answer }]);
    } catch (error) {
      setRagMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            `I could not complete this request right now. ${error.message}. ` +
            "Please try again, and I will provide a clear, professional response.",
        },
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
    } catch {
      setIsChatFullscreen(false);
    }
  };

  const chatPanelClasses = isChatFullscreen
    ? "w-screen h-screen max-w-none rounded-none mb-0"
    : "mb-3 w-[calc(100vw-1rem)] sm:w-96 max-w-[27rem] rounded-2xl";

  return (
    <>
      <section
        className="relative overflow-hidden min-h-screen bg-gradient-to-b from-orange-50/70 via-white to-amber-50/60 px-4 sm:px-6 pt-20 pb-16 font-sans"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-28 -left-28 h-72 w-72 rounded-full bg-orange-200/30 blur-3xl" />
          <div className="absolute top-24 -right-20 h-80 w-80 rounded-full bg-amber-200/30 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-orange-100/60 blur-3xl" />
        </div>

        <div className="relative text-center mb-14 md:mb-16 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/70 bg-white/70 px-3 py-1 text-xs font-semibold text-orange-700 shadow-sm backdrop-blur">
            <span className="inline-block h-2 w-2 rounded-full bg-[#EC7B21]" aria-hidden="true" />
            Robotics lineup
          </div>
          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Meet Our Humanoid Robots
          </h1>
          <p className="mt-4 text-gray-700 text-base md:text-lg leading-relaxed">
            Explore our advanced robotics solutions designed to inspire learning,
            innovation, and smarter automation.
          </p>
        </div>

        <div className="relative mx-auto flex max-w-6xl flex-col gap-10 md:gap-14">
          {robotsData.map((robot, index) => (
            <div
              key={robot.id}
              className="rounded-3xl bg-gradient-to-br from-orange-200/70 via-amber-100/50 to-white p-[1px] shadow-[0_18px_55px_rgba(15,23,42,0.10)]"
            >
              <div
                className={`group relative flex flex-col md:flex-row items-stretch bg-white/85 backdrop-blur rounded-3xl overflow-hidden transition-all duration-500 hover:bg-white/90 hover:shadow-[0_22px_70px_rgba(15,23,42,0.12)] ${
                  index % 2 !== 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className="md:w-1/2 h-72 md:h-[26rem] flex items-center justify-center overflow-hidden relative p-5 md:p-8">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(236,123,33,0.18),transparent_55%)]"
                  />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-orange-50/40 via-white/30 to-white" />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-70 [background-image:linear-gradient(to_right,rgba(236,123,33,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(236,123,33,0.07)_1px,transparent_1px)] [background-size:22px_22px]"
                  />
                  <img
                    src={robot.image}
                    alt={robot.name}
                    className="relative z-10 object-contain w-full h-full transition-transform duration-500 group-hover:scale-[1.03] drop-shadow-[0_22px_36px_rgba(15,23,42,0.22)]"
                    loading="lazy"
                    onError={(e) => (e.target.src = "/images/placeholder.png")}
                  />
                </div>

                <div className="md:w-1/2 p-6 sm:p-9 md:p-12 flex flex-col justify-center text-center md:text-left">
                  <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 uppercase mb-3 tracking-tight">
                    {robot.name}
                  </h3>
                  <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-5">
                    {robot.shortDesc}
                  </p>

                  <div className="mb-5 flex items-center justify-center md:justify-start">
                    <span className="inline-flex items-center rounded-full border border-orange-200/70 bg-orange-50/60 px-3 py-1 text-sm font-semibold text-orange-800">
                      {robot.description}
                    </span>
                  </div>

                  <ul className="space-y-3.5 mb-5">
                    {robot.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-700">
                        <span
                          className="mt-1.5 inline-block h-3.5 w-3.5 flex-shrink-0 rounded-full bg-gradient-to-br from-[#EC7B21] to-amber-400 shadow-[0_0_0_3px_rgba(236,123,33,0.14)]"
                          aria-hidden="true"
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="text-gray-900 font-semibold text-lg leading-relaxed">
                    {robot.footer}
                  </p>

                  <div className="mt-6">
                    <a
                      href={getManualUrl(robot.manualFile)}
                      className="inline-flex items-center rounded-xl bg-gradient-to-r from-[#EC7B21] to-orange-600 text-white px-5 py-2.5 text-sm font-semibold shadow-sm transition hover:from-orange-600 hover:to-orange-700 hover:shadow-md"
                    >
                      User Manual
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="fixed right-2 sm:right-6 z-[60] bottom-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div
            ref={chatPanelRef}
            className={`${chatPanelClasses} border border-orange-200/60 bg-white/80 backdrop-blur-xl shadow-2xl ring-1 ring-orange-200/40 overflow-hidden transition-all duration-300 origin-bottom-right ${
              isChatOpen
                ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                : "opacity-0 translate-y-4 scale-95 pointer-events-none"
            }`}
          >
            <div className="relative bg-gradient-to-r from-[#EC7B21] via-[#f39a4f] to-amber-400 text-white px-3 sm:px-4 py-3 flex items-start justify-between gap-2 sm:gap-3 overflow-hidden">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(rgba(255,255,255,0.22)_1px,transparent_1px)] [background-size:14px_14px]" />
              <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/15 blur-2xl" />
              <div>
                <h3 className="relative text-base font-extrabold tracking-wide flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/25">
                    <FaRobot size={14} />
                  </span>
                  <span>More about Robots</span>
                  <span className="relative inline-flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                  </span>
                </h3>
                <p className="relative text-xs opacity-95">Ask about features, setup, and use-cases.</p>
              </div>
              <div className="relative flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={toggleChatFullscreen}
                  className="text-white/90 hover:text-white text-[11px] sm:text-xs font-semibold border border-white/30 rounded-lg px-2 py-1 inline-flex items-center gap-1 bg-white/10 hover:bg-white/15 transition"
                  aria-label="Toggle full screen"
                >
                  {isChatFullscreen ? <FaCompress size={10} /> : <FaExpand size={10} />}
                  <span className="hidden sm:inline">{isChatFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
                </button>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-white/90 hover:text-white text-sm font-semibold rounded-lg px-2 py-1 bg-white/0 hover:bg-white/10 transition"
                  aria-label="Close assistant"
                >
                  Close
                </button>
              </div>
            </div>

            <div className={`bg-gradient-to-b from-white to-[#fff3ea] p-3 sm:p-4 overflow-y-auto space-y-3 ${isChatFullscreen ? "h-[calc(100vh-13rem)] sm:h-[calc(100vh-12.75rem)]" : "h-[min(58vh,22rem)] sm:h-80"}`}>
              {ragMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`max-w-[92%] px-3 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === "user"
                      ? "ml-auto bg-gradient-to-r from-[#EC7B21] to-orange-500 text-white"
                      : "mr-auto bg-white/90 border border-orange-100/70 text-gray-800"
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
                <div className="mr-auto bg-white/90 border border-orange-100/70 text-gray-700 px-3 py-2.5 rounded-2xl text-sm shadow-sm animate-pulse">
                  Assistant is typing...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 bg-white/90 backdrop-blur border-t border-orange-100/60 flex flex-wrap sm:flex-nowrap gap-2">
              <input
                type="text"
                value={ragInput}
                onChange={(e) => setRagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") askRobotRag();
                }}
                placeholder="Ask about WhizBot, WhizBuddy, WhizAaru, WhizGreeter..."
                className="order-1 basis-full sm:basis-auto sm:order-none flex-1 border border-orange-200/70 bg-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#EC7B21]/60"
              />
              <button
                onClick={toggleMicListening}
                disabled={!speechSupported || ragLoading}
                className={`px-3 py-2 rounded-xl text-sm font-semibold transition border ${
                  isListening
                    ? "bg-red-500 text-white border-red-400 animate-pulse"
                    : speechSupported
                    ? "bg-white text-[#EC7B21] border-orange-300 hover:bg-orange-50"
                    : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                }`}
                aria-label="Use microphone"
                title={speechSupported ? "Speak your question" : "Speech input not supported in this browser"}
              >
                <FaMicrophone size={14} />
              </button>
              <button
                onClick={askRobotRag}
                disabled={ragLoading || !ragInput.trim()}
                className={`px-4 py-2 rounded-xl text-sm font-semibold text-white transition min-w-20 shadow-sm ${
                  ragLoading || !ragInput.trim()
                    ? "bg-orange-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#EC7B21] to-orange-600 hover:from-orange-600 hover:to-orange-700"
                }`}
              >
                Send
              </button>
            </div>
          </div>

          <button
            onClick={() => setIsChatOpen((prev) => !prev)}
            className="ml-auto relative overflow-hidden flex items-center gap-2 rounded-full bg-gradient-to-r from-[#EC7B21] to-orange-600 text-white px-3 sm:px-4 py-3 shadow-xl transition-all active:scale-95 hover:shadow-[0_0_28px_rgba(236,123,33,0.55)] hover:from-orange-600 hover:to-orange-700"
            aria-expanded={isChatOpen}
            aria-label="Toggle AI assistant"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-orange-400/20 via-yellow-200/20 to-orange-500/20 animate-pulse" />
            <span className="absolute -inset-2 rounded-full border border-orange-300/60 animate-ping" />
            <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-sm">
              <FaRobot size={15} />
            </span>
            <span className="relative font-semibold text-sm tracking-wide">More about Robots</span>
          </button>
        </div>
      </section>
    </>
  );
};

export default Robots;
