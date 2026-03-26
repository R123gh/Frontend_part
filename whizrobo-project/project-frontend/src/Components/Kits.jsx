import React, { useEffect, useRef, useState } from "react";
import { FaCompress, FaExpand, FaMicrophone, FaPlay, FaRobot, FaStop } from "react-icons/fa";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const kitsData = {
  IOT: [
    {
      id: 1,
      name: "WHIZ IOT",
      src: "/Level - 6 (IOT Kit).jpg",
      description: "Internet of Things training kit for smart connected solutions.",
      grades: ["IDEAL FOR GRADES 10-12", "DIGITAL TRANSFORMATION LEARNING", "IOT BASICS"],
    },
    {
      id: 2,
      name: "WHIZ BT",
      src: "/Level - 7 (IOT Kit).jpg",
      description: "Bluetooth-enabled advanced kit for automation and IoT projects.",
      grades: ["IDEAL FOR GRADES 7-9", "SMART AUTOMATION", "REAL-WORLD IOT EXPERIENCE"],
    },
  ],
  WHIZROBO: [
    {
      id: 3,
      name: "WHIZ BUILDER",
      src: "/WHIZ builder (2).jpg",
      description: "Entry-level robotics kit for young learners.",
      grades: ["IDEAL FOR GRADES 1-2", "BASIC ROBOT BUILDING", "STEM FOUNDATION"],
    },
    {
      id: 4,
      name: "WHIZ CREATOR",
      src: "/Whiz Creator.jpg",
      description: "Modular STEM learning kit for electronics and creative robotics.",
      grades: ["IDEAL FOR GRADES 3-4", "CREATIVE ROBOTICS", "CODING CLUB READY"],
    },
    {
      id: 5,
      name: "WHIZ BOX",
      src: "/WHIZ BOX.jpg",
      description: "All-in-one experimentation box with sensors and displays.",
      grades: ["IDEAL FOR GRADES 3-5", "CLASSROOM DEMOS", "ELECTRONICS AND CODING"],
    },
    {
      id: 6,
      name: "WHIZ INNOVATOR",
      src: "/Whiz Innovator (1).jpg",
      description: "Advanced kit with wireless modules and AI activities.",
      grades: ["IDEAL FOR GRADES 6-7", "INTERMEDIATE ROBOTICS", "AI AUTOMATION"],
    },
    {
      id: 7,
      name: "WHIZ INVENTOR",
      src: "/WHIZ INVENTOR.jpg",
      description: "Inventor kit focused on prototyping and competitive robotics.",
      grades: ["IDEAL FOR GRADES 8-9", "COMPETITIVE ROBOTICS", "ADVANCED PROTOTYPING"],
    },
  ],
};

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
    return `Hello! I can help you with ${contextLabel}. You can ask about features, grades, use-cases, setup flow, or which kit is best for your students.`;
  }

  if (/\b(thank you|thanks|thx)\b/.test(normalized)) {
    return "You are welcome. If you want, I can also provide a quick comparison table and a recommended next step.";
  }

  if (/\b(bye|goodbye|see you|see ya)\b/.test(normalized)) {
    return "Thank you for reaching out. Whenever you are ready, I can continue with detailed kit guidance.";
  }

  if (/\b(help|support|assist me)\b/.test(normalized)) {
    return `Sure. I can help with ${contextLabel}, grade suitability, learning outcomes, estimated implementation approach and deployment planning.`;
  }

  if (/\b(who are you|what can you do|capabilities)\b/.test(normalized)) {
    return "I am your WHIZROBO virtual assistant. I provide professional, structured guidance for kit selection, classroom usage, setup and expected outcomes.";
  }

  return null;
};

const makeProfessionalAnswer = (rawAnswer, contextLabel) => {
  const cleaned = String(rawAnswer || "")
    .replace(/\r/g, "")
    .replace(/[*`#>]/g, "")
    .replace(/^\s*[-+]\s+/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if (!cleaned) {
    return `I can help with ${contextLabel}. Please share your exact requirement and I will provide a clear, step-by-step recommendation.`;
  }

  if (cleaned.length < 80) {
    return `${cleaned}\n\nIf you share your target grade, objective and timeline, I can provide a more detailed recommendation.`;
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

const Kits = () => {
  const [selectedKit, setSelectedKit] = useState("WHIZROBO");
  const [selectedItem, setSelectedItem] = useState(kitsData.WHIZROBO[0]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatFullscreen, setIsChatFullscreen] = useState(false);
  const [ragInput, setRagInput] = useState("");
  const [ragLoading, setRagLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [ttsLoadingId, setTtsLoadingId] = useState(null);
  const [ttsPlayingId, setTtsPlayingId] = useState(null);
  const [ragMessages, setRagMessages] = useState([
    { role: "assistant", content: "Ask me anything about this kit and more." },
  ]);

  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);
  const chatPanelRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    setSelectedItem(kitsData[selectedKit][0]);
  }, [selectedKit]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ragMessages, ragLoading]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsChatFullscreen(document.fullscreenElement === chatPanelRef.current);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }
    const rec = new SpeechRecognition();
    rec.lang = "en-US";
    rec.continuous = false;
    rec.interimResults = true;
    rec.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        transcript += event.results[i][0].transcript;
      }
      setRagInput(transcript.trim());
    };
    rec.onend = () => setIsListening(false);
    rec.onerror = () => setIsListening(false);
    recognitionRef.current = rec;
    setSpeechSupported(true);
    return () => {
      rec.stop();
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

  const askRag = async () => {
    const query = ragInput.trim();
    if (!query || ragLoading) return;

    const nextMessages = [...ragMessages, { role: "user", content: query }];
    setRagMessages(nextMessages);
    setRagInput("");

    const contextLabel = `our ${selectedKit} kits, especially ${selectedItem.name}`;
    const quickReply = getSmartReply(query, contextLabel);
    if (quickReply) {
      setRagMessages((prev) => [...prev, { role: "assistant", content: quickReply }]);
      return;
    }

    setRagLoading(true);

    try {
      const history = nextMessages.slice(-8).map((m) => ({ role: m.role, content: m.content }));
      const kitContext = `${selectedItem.name}: ${selectedItem.description} | ${selectedItem.grades.join("; ")}`;
      const res = await fetch(`${API_BASE_URL}/api/rag/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, history, kitContext }),
        credentials: "include",
      });

      if (!res.ok) {
        const errorMessage = await extractApiErrorMessage(res, "RAG request failed.");
        throw new Error(errorMessage);
      }
      const data = await res.json().catch(() => ({}));
      const professionalAnswer = makeProfessionalAnswer(data.answer, contextLabel);
      setRagMessages((prev) => [...prev, { role: "assistant", content: professionalAnswer }]);
    } catch (error) {
      setRagMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            `I could not complete this request right now. ${error.message}. ` +
            "Please try again and I can provide a complete, structured answer.",
        },
      ]);
    } finally {
      setRagLoading(false);
    }
  };

  const toggleMic = () => {
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

  return (
    <>
      <section
        className="relative overflow-hidden min-h-screen bg-white"
      >
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-6">
          <div className="text-center max-w-4xl mx-auto">
            <p className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-[#EC7B21]/10 px-3 py-1 text-xs font-semibold text-[#EC7B21]">
              STEM kits catalog
            </p>
            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-black">Explore Our Kits</h1>
            <p className="mt-3 text-black/70">Choose a category and view full details for each kit.</p>
          </div>
        </div>

        <div className="relative sticky top-0 z-40 border-b border-black/10 bg-white/90 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex gap-2 overflow-x-auto">
            {Object.keys(kitsData).map((kit) => (
              <button
                key={kit}
                onClick={() => setSelectedKit(kit)}
                className={`whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold transition border ${
                  selectedKit === kit
                    ? "bg-[#EC7B21] text-white border-[#EC7B21]"
                    : "bg-white text-black border-black/10 hover:bg-black/5"
                }`}
              >
                {kit} KITS
              </button>
            ))}
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-4 rounded-3xl border border-black/10 shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
            <div className="rounded-3xl bg-white border border-black/10 p-3 space-y-2 max-h-[70vh] overflow-auto">
              {kitsData[selectedKit].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`w-full text-left rounded-2xl p-3 border transition ${
                    selectedItem.id === item.id
                      ? "bg-[#EC7B21]/10 border-[#EC7B21]/40 ring-2 ring-[#EC7B21]/20"
                      : "bg-white border-black/10 hover:bg-black/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img src={item.src} alt={item.name} className="h-12 w-12 rounded-xl object-cover border border-black/10" />
                    <div className="min-w-0">
                      <p className="font-extrabold text-sm text-black truncate">{item.name}</p>
                      <p className="text-[11px] text-black/60 line-clamp-2">{item.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <main className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <article className="rounded-3xl border border-black/10 shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
              <div className="h-full rounded-3xl bg-white p-6">
                <h2 className="text-3xl font-extrabold text-black">{selectedItem.name}</h2>
                <p className="mt-3 text-black/70">{selectedItem.description}</p>
                <ul className="mt-5 space-y-2">
                  {selectedItem.grades.map((grade) => (
                    <li key={grade} className="flex items-start gap-2 text-black/70">
                      <span className="mt-1.5 inline-block h-2.5 w-2.5 rounded-full bg-[#EC7B21]" />
                      <span className="font-semibold">{grade}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>

            <article className="rounded-3xl border border-black/10 shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
              <div className="h-full rounded-3xl bg-white p-6 flex items-center justify-center">
                <img src={selectedItem.src} alt={selectedItem.name} className="max-h-[420px] w-full object-contain" />
              </div>
            </article>
          </main>
        </div>

        <div className="fixed bottom-6 right-4 sm:right-6 z-[60]">
          <div
            ref={chatPanelRef}
            className={`${isChatFullscreen ? "w-screen h-screen max-w-none rounded-none mb-0" : "mb-3 w-[calc(100vw-2rem)] sm:w-96 max-w-[26rem] rounded-2xl"} border border-black/10 bg-white shadow-2xl overflow-hidden transition-all duration-300 ${
              isChatOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95 pointer-events-none"
            }`}
          >
            <div className="bg-[#EC7B21] text-white px-4 py-3 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-extrabold flex items-center gap-2">
                  <FaRobot size={14} /> More about Kits
                </h3>
                <p className="text-xs opacity-95">Kit context: {selectedItem.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleChatFullscreen}
                  className="text-white/90 hover:text-white text-xs font-semibold border border-white/30 rounded-lg px-2 py-1 inline-flex items-center gap-1 bg-white/10 hover:bg-white/15 transition"
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

            <div className={`bg-white p-3 overflow-y-auto space-y-3 ${isChatFullscreen ? "h-[calc(100vh-11.5rem)]" : "h-72"}`}>
              {ragMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`max-w-[92%] px-3 py-2.5 rounded-2xl text-sm ${
                    msg.role === "user"
                      ? "ml-auto bg-[#EC7B21] text-white"
                      : "mr-auto bg-white border border-black/10 text-black"
                  }`}
                >
                  {msg.content}
                  {msg.role === "assistant" && msg.content?.trim() && (
                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={() => playTts(msg.content, idx)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-semibold border ${
                          ttsPlayingId === idx
                            ? "border-[#EC7B21]/40 text-[#EC7B21] bg-[#EC7B21]/10"
                            : "border-black/10 text-[#EC7B21] hover:bg-black/5"
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
              {ragLoading && <div className="text-sm text-black/60">Assistant is typing...</div>}
              <div ref={chatEndRef} />
            </div>

            <div className="p-3 bg-white border-t border-black/10 flex gap-2">
              <input
                type="text"
                value={ragInput}
                onChange={(e) => setRagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && askRag()}
                placeholder={`Ask about ${selectedItem.name}...`}
                className="flex-1 border border-black/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#EC7B21]/40"
              />
              <button
                onClick={toggleMic}
                disabled={!speechSupported || ragLoading}
                className={`px-3 py-2 rounded-xl border ${
                  isListening
                    ? "bg-[#EC7B21] text-white border-[#EC7B21]/80 animate-pulse"
                    : "bg-white text-[#EC7B21] border-black/10 hover:bg-black/5"
                }`}
              >
                <FaMicrophone size={13} />
              </button>
              <button
                onClick={askRag}
                disabled={ragLoading || !ragInput.trim()}
                className={`px-4 py-2 rounded-xl text-sm font-semibold text-white ${
                  ragLoading || !ragInput.trim()
                    ? "bg-[#EC7B21]/50 cursor-not-allowed"
                    : "bg-[#EC7B21] hover:opacity-90"
                }`}
              >
                Send
              </button>
            </div>
          </div>

          <button
            onClick={() => setIsChatOpen((prev) => !prev)}
            className="ml-auto relative overflow-hidden flex items-center gap-2 rounded-full bg-[#EC7B21] text-white px-4 py-3 shadow-xl transition-all active:scale-95 hover:opacity-90"
          >
            <FaRobot size={15} />
            <span className="font-semibold text-sm tracking-wide">More about Kits</span>
          </button>
        </div>
      </section>
    </>
  );
};

export default Kits;
