import React, { useEffect, useRef, useState } from "react";
import { FaMicrophone, FaRobot } from "react-icons/fa";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const kitsData = {
  IOT: [
    {
      id: 1,
      name: "WHIZ IOT",
      type: "image",
      src: "/Level - 6 (IOT Kit).jpg",
      description:
        "Internet of Things training kit for smart devices and connected solutions such as smart homes, automated farms, and industrial sensor systems.",
      grades: [
        "IDEAL FOR GRADES 10-12",
        "HANDS-ON DIGITAL TRANSFORMATION LEARNING",
        "INTRODUCTION TO IOT AND CONNECTED DEVICES",
      ],
    },
    {
      id: 2,
      name: "WHIZ BT",
      type: "image",
      src: "/Level - 7 (IOT Kit).jpg",
      description:
        "Bluetooth-enabled advanced training kit for wireless communication, smart automation, and real-world IoT and robotics projects.",
      grades: [
        "IDEAL FOR GRADES 7-9",
        "SMART AUTOMATION AND DATA MONITORING",
        "REAL-WORLD IOT AND ROBOTICS PROJECT EXPERIENCE",
      ],
    },
  ],
  WHIZROBO: [
    {
      id: 3,
      name: "WHIZ BUILDER",
      type: "image",
      src: "/WHIZ builder (2).jpg",
      description:
        "Entry-level robotics kit for young learners to build simple robots and understand basic circuits.",
      grades: [
        "IDEAL FOR GRADES 1-2",
        "BASIC ROBOT BUILDING AND CIRCUITS",
        "FOUNDATION FOR STEM LEARNING",
      ],
    },
    {
      id: 4,
      name: "WHIZ CREATOR",
      type: "image",
      src: "/Whiz Creator.jpg",
      description:
        "Modular STEM learning kit to explore electronics, sensors, and creative robotics projects.",
      grades: [
        "IDEAL FOR GRADES 3-4",
        "CREATIVE ROBOTICS AND CODING",
        "SUITED FOR CODING CLUBS",
      ],
    },
    {
      id: 5,
      name: "WHIZ BOX",
      type: "image",
      src: "/WHIZ BOX.jpg",
      description:
        "All-in-one robotics and electronics experimentation box with built-in sensors and displays.",
      grades: [
        "IDEAL FOR GRADES 3-5",
        "PERFECT FOR CLASSROOM DEMOS",
        "ELECTRONICS AND CODING BASICS",
      ],
    },
    {
      id: 6,
      name: "WHIZ INNOVATOR",
      type: "image",
      src: "/Whiz Innovator (1).jpg",
      description:
        "Advanced STEM kit featuring wireless modules, programmable boards, and AI training activities.",
      grades: [
        "IDEAL FOR GRADES 6-7",
        "INTERMEDIATE ROBOTICS PROJECTS",
        "AI AND SMART AUTOMATION",
      ],
    },
    {
      id: 7,
      name: "WHIZ INVENTOR",
      type: "image",
      src: "/WHIZ INVENTOR.jpg",
      description:
        "Inventor kit focused on prototyping, mechanical design, and competitive robotics.",
      grades: [
        "IDEAL FOR GRADES 8-9",
        "COMPETITIVE ROBOTICS",
        "ADVANCED PROTOTYPING",
      ],
    },
  ],
};

const Kits = () => {
  const [selectedKit, setSelectedKit] = useState("WHIZROBO");
  const [selectedItem, setSelectedItem] = useState(kitsData.WHIZROBO[0]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [ragInput, setRagInput] = useState("");
  const [ragLoading, setRagLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [attachedImage, setAttachedImage] = useState(null);
  const [ocrExtracting, setOcrExtracting] = useState(false);
  const [extractedImageText, setExtractedImageText] = useState("");
  const [ocrStatus, setOcrStatus] = useState("");
  const [ttsLoadingId, setTtsLoadingId] = useState(null);
  const [ttsPlayingId, setTtsPlayingId] = useState(null);
  const [isChatFullscreen, setIsChatFullscreen] = useState(false);
  const chatPanelRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingIntervalRef = useRef(null);
  const audioRef = useRef(null);
  const [ragMessages, setRagMessages] = useState([
    {
      role: "assistant",
      content:
        "Ask me anything about this kit and more.",
    },
  ]);

  useEffect(() => {
    setSelectedItem(kitsData[selectedKit][0]);
  }, [selectedKit]);

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
    const onFullscreenChange = () => {
      setIsChatFullscreen(document.fullscreenElement === chatPanelRef.current);
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ragMessages, ragLoading]);

  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleImageError = (e) => {
    e.target.src = "/images/placeholder.png";
  };

  const askRag = async () => {
    const query = ragInput.trim();
    const effectiveQuery = query || (attachedImage ? "Explain the text in this image." : "");
    if (!effectiveQuery || ragLoading) return;

    const userText = attachedImage
      ? `${effectiveQuery}\n[Image attached: ${attachedImage.name}]`
      : effectiveQuery;
    const nextMessages = [...ragMessages, { role: "user", content: userText }];
    setRagMessages(nextMessages);
    setRagInput("");
    setRagLoading(true);

    try {
      const history = nextMessages.slice(-8).map((m) => ({ role: m.role, content: m.content }));
      const kitContext = `${selectedItem.name}: ${selectedItem.description} | ${selectedItem.grades.join("; ")}`;
      const queryWithExtractedText = extractedImageText
        ? `${effectiveQuery}\n\nExtracted image text:\n${extractedImageText}`
        : effectiveQuery;

      const res = await fetch(`${API_BASE_URL}/api/rag/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: queryWithExtractedText,
          kitContext,
          history,
          image: attachedImage?.dataUrl || "",
          imageName: attachedImage?.name || "",
          imageType: attachedImage?.type || "",
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.msg || "RAG request failed.");
      }

      const answer = data.answer || "No response from assistant.";
      const formattedAnswer = formatAssistantAnswer(answer);
      await typeAssistantMessage(formattedAnswer);
      setAttachedImage(null);
    } catch (error) {
      await typeAssistantMessage(`I could not fetch a response right now. ${error.message}`);
    } finally {
      setRagLoading(false);
    }
  };

  const formatAssistantAnswer = (rawText) => {
    const cleaned = (rawText || "")
      .replace(/\r/g, "")
      .replace(/^\s*[*-]\s+/gm, "")
      .replace(/\*/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
    return cleaned;
  };

  const toSpeakableText = (value) =>
    String(value || "")
      .replace(/\[Image attached:[^\]]+\]/gi, "")
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

  const typeAssistantMessage = (text) =>
    new Promise((resolve) => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }

      const finalText = (text || "").trim();
      let cursor = 0;
      const total = finalText.length;
      const step = Math.max(1, Math.ceil(total / 120));

      setRagMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      if (!total) {
        setRagMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", content: "No response from assistant." };
          return next;
        });
        resolve();
        return;
      }

      typingIntervalRef.current = setInterval(() => {
        cursor = Math.min(total, cursor + step);
        const chunk = finalText.slice(0, cursor);
        setRagMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", content: chunk };
          return next;
        });

        if (cursor >= total) {
          clearInterval(typingIntervalRef.current);
          typingIntervalRef.current = null;
          resolve();
        }
      }, 18);
    });

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

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageLoading(true);
    setOcrExtracting(false);
    setExtractedImageText("");
    setOcrStatus("");

    try {
      const reader = new FileReader();
      const readResult = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      setAttachedImage({
        name: file.name,
        type: file.type || "image/*",
        dataUrl: typeof readResult === "string" ? readResult : "",
      });

      const imagePayload = typeof readResult === "string" ? readResult : "";
      if (imagePayload) {
        setOcrExtracting(true);
        setOcrStatus("Extracting text from image...");
        const ocrRes = await fetch(`${API_BASE_URL}/api/rag/ocr`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: imagePayload,
            imageName: file.name,
            imageType: file.type || "image/*",
          }),
        });
        const ocrData = await ocrRes.json().catch(() => ({}));
        if (!ocrRes.ok) {
          throw new Error(ocrData.msg || "OCR extraction failed.");
        }

        const text = (ocrData.extractedText || "").trim();
        setExtractedImageText(text);
        setOcrStatus(text ? "Text extracted from image." : "No text detected in image.");
      }
    } catch (_error) {
      setAttachedImage(null);
      setExtractedImageText("");
      setOcrStatus("Unable to extract text from image.");
    } finally {
      setImageLoading(false);
      setOcrExtracting(false);
      event.target.value = "";
    }
  };

  const removeAttachedImage = () => {
    setAttachedImage(null);
    setExtractedImageText("");
    setOcrStatus("");
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
    } catch (_err) {
      setIsChatFullscreen(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white font-sans" style={{ fontFamily: "Montserrat, sans-serif" }}>
      <div className="flex gap-3 overflow-x-auto p-4 sticky top-0 z-50 bg-white border-b">
        {Object.keys(kitsData).map((kit) => (
          <button
            key={kit}
            onClick={() => setSelectedKit(kit)}
            className={`px-5 py-3 rounded-full font-semibold transition-all whitespace-nowrap ${
              selectedKit === kit
                ? "bg-[#EC7B21] text-white"
                : "border border-[#EC7B21] text-black hover:bg-[#EC7B21] hover:text-white"
            }`}
          >
            {kit} KITS
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-6 p-6">
        <aside className="md:w-72 bg-white rounded-xl shadow p-4 flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:sticky md:top-24 max-h-[calc(100vh-6rem)]">
          {kitsData[selectedKit].map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className={`cursor-pointer flex flex-col items-center p-3 rounded-xl transition ${
                selectedItem.id === item.id
                  ? "bg-[#fff5ee] border-2 border-[#EC7B21]"
                  : "hover:bg-[#fff5ee]"
              }`}
            >
              <div className="w-24 h-24 rounded-full overflow-hidden border border-[#EC7B21]">
                <img src={item.src} alt={item.name} className="w-full h-full object-cover" onError={handleImageError} />
              </div>
              <span className="mt-2 font-semibold text-center">{item.name}</span>
            </div>
          ))}
        </aside>

        <section className="flex-1 grid grid-cols-1 mt-0 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-1">{selectedItem.name}</h2>
            <p className="text-lg mb-6">{selectedItem.description}</p>
            <ul className="space-y-3">
              {selectedItem.grades.map((g, i) => (
                <li key={i} className="text-[#EC7B21] font-semibold border-l-4 pl-3 border-[#EC7B21]">
                  {g}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-center">
            <img
              src={selectedItem.src}
              alt={selectedItem.name}
              className="w-full max-w-md max-h-[400px] object-contain rounded-2xl shadow-lg"
              onError={handleImageError}
            />
          </div>
        </section>
      </div>

      <div className="fixed bottom-6 right-4 sm:right-6 z-[60]">
        <div
          ref={chatPanelRef}
          className={`${isChatFullscreen ? "w-screen h-screen max-w-none rounded-none mb-0" : "mb-3 w-[calc(100vw-2rem)] sm:w-96 max-w-[26rem] rounded-2xl"} border border-orange-100 bg-white shadow-2xl overflow-hidden transition-all duration-300 origin-bottom-right ${
            isChatOpen
              ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
              : "opacity-0 translate-y-4 scale-95 pointer-events-none"
          }`}
        >
          <div className="bg-gradient-to-r from-[#EC7B21] to-[#f39a4f] text-white px-4 py-3 flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-bold tracking-wide flex items-center gap-2">
                Whizrobo Chatbot
                <span className="relative inline-flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                </span>
              </h3>
              <p className="text-xs opacity-95">Ask about kits , Components and more.</p>
              <p className="text-xs opacity-90 mt-1">Kit context: {selectedItem.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleChatFullscreen}
                className="text-white/90 hover:text-white text-xs font-semibold border border-white/30 rounded-md px-2 py-1"
                aria-label="Toggle full screen"
              >
                {isChatFullscreen ? "Exit Fullscreen" : "Fullscreen"}
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

          <div className={`bg-[#fffaf6] p-3 overflow-y-auto space-y-3 ${isChatFullscreen ? "h-[calc(100vh-18rem)]" : "h-80"}`}>
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
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold border ${
                        ttsPlayingId === idx
                          ? "border-red-300 text-red-600 bg-red-50"
                          : "border-orange-300 text-[#EC7B21] hover:bg-orange-50"
                      }`}
                    >
                      {ttsLoadingId === idx ? "Loading..." : ttsPlayingId === idx ? "Stop" : "Listen"}
                    </button>
                  </div>
                )}
              </div>
            ))}
            {ragLoading && (
              <div className="mr-auto bg-white border border-orange-100 text-gray-700 px-3 py-2.5 rounded-xl text-sm shadow-sm animate-pulse">
                Chatbot is typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="px-3 pt-3 pb-2 bg-white border-t border-orange-50">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={imageLoading}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition ${
                  imageLoading
                    ? "bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white border-orange-300 text-[#EC7B21] hover:bg-orange-50"
                }`}
              >
                {imageLoading ? "Adding Image..." : "Upload Image"}
              </button>
              <span className="text-[11px] text-gray-500">Attach image and ask your question.</span>
            </div>
            {attachedImage && (
              <div className="mt-2 rounded-md border border-orange-100 bg-orange-50 p-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[11px] text-gray-600 mb-1 font-semibold">Attached Image</p>
                    <p className="text-xs text-gray-700 truncate">{attachedImage.name}</p>
                  </div>
                  <button
                    onClick={removeAttachedImage}
                    className="w-6 h-6 rounded-full border border-orange-300 text-[#EC7B21] text-sm leading-none hover:bg-orange-100"
                    aria-label="Remove attached image"
                    title="Remove image"
                  >
                    x
                  </button>
                </div>
                <img
                  src={attachedImage.dataUrl}
                  alt={attachedImage.name}
                  className="mt-2 w-full h-24 object-cover rounded border border-orange-100"
                />
                <p className="mt-2 text-[11px] text-gray-600">
                  {ocrExtracting ? "Extracting text..." : ocrStatus}
                </p>
                {extractedImageText && (
                  <div className="mt-1 max-h-20 overflow-y-auto rounded border border-orange-200 bg-white p-2">
                    <p className="text-[11px] font-semibold text-gray-600 mb-1">Extracted Text</p>
                    <p className="text-xs text-gray-700 whitespace-pre-wrap">{extractedImageText}</p>
                  </div>
                )}
                <button
                  onClick={removeAttachedImage}
                  className="mt-2 px-2.5 py-1 text-[11px] rounded border border-orange-300 text-[#EC7B21] hover:bg-orange-100"
                >
                  Remove image
                </button>
              </div>
            )}
          </div>

          <div className="p-3 bg-white border-t border-orange-50 flex gap-2">
            <input
              type="text"
              value={ragInput}
              onChange={(e) => setRagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") askRag();
              }}
              placeholder={`Ask about ${selectedItem.name}...`}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#EC7B21]"
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
              <span className="inline-flex items-center gap-1">
                <FaMicrophone size={13} />
                {isListening ? "Listening..." : "Mic"}
              </span>
            </button>
            <button
              onClick={askRag}
              disabled={ragLoading || (!ragInput.trim() && !attachedImage)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition ${
                ragLoading || (!ragInput.trim() && !attachedImage)
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
          className="ml-auto relative overflow-hidden flex items-center gap-2 rounded-full bg-[#EC7B21] text-white px-4 py-3 shadow-xl hover:bg-orange-600 transition-all active:scale-95 hover:shadow-[0_0_28px_rgba(236,123,33,0.55)]"
          aria-expanded={isChatOpen}
          aria-label="Toggle Whizrobo Chatbot"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-orange-400/20 via-yellow-200/20 to-orange-500/20 animate-pulse" />
          <span className="absolute -inset-2 rounded-full border border-orange-300/60 animate-ping" />
          <span
            className={`relative inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-sm transition-transform duration-300 ${
              isChatOpen ? "rotate-90" : "rotate-0"
            }`}
          >
            <FaRobot size={15} />
          </span>
          <span className="relative font-semibold text-sm tracking-wide">Whizrobo Chatbot</span>
        </button>
      </div>
    </div>
  );
};

export default Kits;

