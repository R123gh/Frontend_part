import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaComments, FaPaperPlane, FaRobot } from "react-icons/fa";
import { generalFaqData } from "../data/generalFaqs";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "at",
  "can",
  "for",
  "from",
  "how",
  "i",
  "in",
  "is",
  "it",
  "me",
  "my",
  "of",
  "on",
  "or",
  "please",
  "tell",
  "the",
  "to",
  "we",
  "what",
  "when",
  "where",
  "which",
  "who",
  "why",
  "with",
  "you",
  "your",
]);

const TERM_MAP = {
  ai: "artificial intelligence",
  ar: "augmented reality",
  vr: "virtual reality",
  lms: "learning management system",
  nep: "national education policy",
  iso: "iso certified",
  atl: "atal tinkering labs",
  pricing: "price",
  cost: "price",
  fees: "price",
  fee: "price",
  amount: "price",
  classes: "grades",
  class: "grade",
  standards: "grades",
  teacher: "teachers",
  school: "schools",
  collages: "colleges",
  quaery: "query",
  batter: "better",
};

const TYPO_MAP = {
  whizroboo: "whizrobo",
  quary: "query",
  quaery: "query",
  collages: "colleges",
  enginner: "engineer",
  tolls: "tools",
};

const INTENT_PATTERNS = {
  greeting: /\b(hi|hii|hello|hey|good morning|good afternoon|good evening)\b/,
  thanks: /\b(thank you|thanks|thx)\b/,
  goodbye: /\b(bye|goodbye|see you)\b/,
  pricing: /\b(price|pricing|cost|fee|amount)\b/,
  grades: /\b(grade|grades|class|classes|foundation|stage|k 12|k12)\b/,
  partnerships: /\b(partner|partnership|schools|college|institution|government|atl)\b/,
  training: /\b(teacher|teachers|training|workshop|certification)\b/,
};

const normalizeText = (text) =>
  String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const fixTypos = (text) =>
  text
    .split(" ")
    .filter(Boolean)
    .map((token) => TYPO_MAP[token] || token)
    .join(" ");

const expandTerms = (text) =>
  text
    .split(" ")
    .filter(Boolean)
    .flatMap((token) => (TERM_MAP[token] ? [token, ...TERM_MAP[token].split(" ")] : [token]))
    .join(" ");

const stemToken = (token) => {
  if (token.endsWith("ies") && token.length > 4) return `${token.slice(0, -3)}y`;
  if (token.endsWith("ing") && token.length > 5) return token.slice(0, -3);
  if (token.endsWith("ers") && token.length > 5) return token.slice(0, -1);
  if (token.endsWith("ed") && token.length > 4) return token.slice(0, -2);
  if (token.endsWith("s") && token.length > 4) return token.slice(0, -1);
  return token;
};

const tokenize = (text) =>
  normalizeText(text)
    .split(/\s+/)
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token))
    .map((token) => stemToken(token));

const levenshteinDistance = (a, b) => {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  const curr = new Array(b.length + 1);

  for (let i = 1; i <= a.length; i += 1) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= b.length; j += 1) {
      prev[j] = curr[j];
    }
  }

  return prev[b.length];
};

const isFuzzyTokenMatch = (token, candidate) => {
  if (token === candidate) return true;
  if (token.length < 4 || candidate.length < 4) return false;
  const distance = levenshteinDistance(token, candidate);
  return distance <= 1;
};

const preprocessQuery = (query) => {
  const normalized = normalizeText(query);
  const corrected = fixTypos(normalized);
  const expanded = expandTerms(corrected);
  const tokens = Array.from(new Set(tokenize(expanded)));
  return { normalized, corrected, expanded, tokens };
};

const detectIntent = (queryText) => {
  const found = Object.entries(INTENT_PATTERNS).find(([, pattern]) => pattern.test(queryText));
  return found ? found[0] : "general";
};

const getIntentReply = (intent) => {
  if (intent === "greeting") {
    return "Hello. I am the WHIZROBO Support Assistant. How may I help you today?";
  }
  if (intent === "thanks") {
    return "You're welcome. Let me know if you need any other WHIZROBO information.";
  }
  if (intent === "goodbye") {
    return "Thank you for contacting WHIZROBO. Have a great day.";
  }
  return "";
};

const buildFaqIndex = (faqs) =>
  faqs.map((faq) => {
    const haystack = `${faq.question} ${faq.answer}`;
    const normalizedHaystack = normalizeText(haystack);
    const expandedHaystack = expandTerms(fixTypos(normalizedHaystack));
    const tokens = Array.from(new Set(tokenize(expandedHaystack)));
    return { faq, normalizedHaystack, expandedHaystack, tokens };
  });

const findBestFaqs = (query, indexedFaqs, limit = 3) => {
  const processedQuery = preprocessQuery(query);
  if (!processedQuery.corrected) return { matches: [], intent: "general", processedQuery };
  const intent = detectIntent(processedQuery.corrected);

  const scored = indexedFaqs.map((item) => {
    const { faq, normalizedHaystack, expandedHaystack, tokens: faqTokens } = item;

    const exactBoost = normalizedHaystack.includes(processedQuery.corrected) ? 150 : 0;
    const partialBoost = expandedHaystack.includes(processedQuery.expanded) ? 70 : 0;

    let weightedTokenHits = 0;
    for (const queryToken of processedQuery.tokens) {
      let tokenScore = 0;
      if (faqTokens.includes(queryToken)) {
        tokenScore = queryToken.length > 6 ? 2.4 : 1.6;
      } else if (faqTokens.some((faqToken) => isFuzzyTokenMatch(queryToken, faqToken))) {
        tokenScore = 1.1;
      }
      weightedTokenHits += tokenScore;
    }

    const coverage =
      processedQuery.tokens.length > 0
        ? weightedTokenHits / processedQuery.tokens.length
        : 0;

    const intentBoost =
      (intent === "pricing" && /\b(price|cost|fee)\b/.test(normalizedHaystack)) ||
      (intent === "grades" && /\b(grade|foundation|stage|k 12|k12)\b/.test(normalizedHaystack)) ||
      (intent === "training" && /\b(teacher|training|workshop|certification)\b/.test(normalizedHaystack)) ||
      (intent === "partnerships" &&
        /\b(partner|schools|college|institution|government|atl)\b/.test(normalizedHaystack))
        ? 20
        : 0;

    return {
      faq,
      score: exactBoost + partialBoost + weightedTokenHits + coverage * 14 + intentBoost,
      coverage,
    };
  });

  const matches = scored
    .filter((item) => item.score > 2 && item.coverage >= 0.25)
    .sort((a, b) => b.score - a.score || b.coverage - a.coverage)
    .slice(0, limit)
    .map((item) => ({ faq: item.faq, score: item.score, coverage: item.coverage }));

  return { matches, intent, processedQuery };
};

const sanitizeAnswer = (text) =>
  String(text || "")
    .replace(/\r/g, "")
    .replace(/[|*]+/g, " ")
    .replace(/\bkey points?\b\s*:?/gi, "")
    .replace(/^\s*[-*]\s*/gm, "")
    .replace(
      /\b(video|content provided|given facts|provided facts|based on the given facts|source|context)\b/gi,
      ""
    )
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\s{2,}/g, " ")
    .trim();

const removeMetaSentences = (text) => {
  const blocked = /(video|given facts|provided facts|content provided|source|based on)/i;
  return String(text || "")
    .split(/(?<=[.!?])\s+|\n+/)
    .map((part) => part.trim())
    .filter((part) => part && !blocked.test(part))
    .join(" ");
};

const toLineOutput = (text) => {
  const cleaned = sanitizeAnswer(removeMetaSentences(text));
  if (!cleaned) return "";

  const parts = cleaned
    .split(/(?<=[.!?])\s+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const selected = parts.length > 0 ? parts.slice(0, 3) : [cleaned];
  return selected
    .map((line) => line.replace(/^[-*|\d.\s]+/, "").replace(/[|*]+/g, " ").trim())
    .filter(Boolean)
    .join("\n");
};

const GeneralFaqChatbot = () => {
  const faqs = useMemo(() => generalFaqData.faqs || [], []);
  const indexedFaqs = useMemo(() => buildFaqIndex(faqs), [faqs]);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello, I am the WHIZROBO Support Assistant. Ask any question about our programs, grades, training, pricing, and partnerships.",
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, open]);

  const appendAssistantMessageAnimated = async (text) => {
    const fullText = String(text || "").trim();
    if (!fullText) {
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      return;
    }

    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    const chunkSize = fullText.length > 280 ? 3 : fullText.length > 140 ? 2 : 1;
    const delayMs = fullText.length > 280 ? 8 : 14;

    for (let i = chunkSize; i <= fullText.length + chunkSize; i += chunkSize) {
      const nextText = fullText.slice(0, Math.min(i, fullText.length));
      setMessages((prev) => {
        if (!prev.length) return prev;
        const next = [...prev];
        const lastIndex = next.length - 1;
        next[lastIndex] = { ...next[lastIndex], content: nextText };
        return next;
      });
      // Small delay for typewriter effect while answer is rendered.
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  };

  const enhanceAnswer = async (query, matches) => {
    const contextFacts = matches
      .slice(0, 3)
      .map(
        (item, idx) =>
          `${idx + 1}. Q: ${item.faq.question}\nA: ${item.faq.answer}\nConfidence: ${item.coverage.toFixed(2)}`
      )
      .join("\n\n");

    const prompt =
      `You are a professional customer support assistant for ${generalFaqData.company}. ` +
      "Answer the user query using only the provided FAQ facts. " +
      "Give a direct, precise answer to exactly what the user asked. " +
      "Do not mention sources, facts list, context, or video. " +
      "Do not write phrases like 'based on provided facts' or similar. " +
      "Return only 2 or 3 short bullet lines. " +
      "Do not add comparisons, alternatives, or extra details unless explicitly asked. " +
      "Do not add any claim that is not in the facts. Return only the final answer.\n\n" +
      `User Query: ${query}\n\n` +
      `FAQ Facts:\n${contextFacts}`;

    try {
      const res = await fetch(`${API_BASE_URL}/api/rag/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: prompt }),
      });
      if (!res.ok) return toLineOutput(matches[0]?.faq?.answer || "");
      const payload = await res.json().catch(() => ({}));
      const enhanced = toLineOutput(payload?.answer || "");
      return enhanced || toLineOutput(matches[0]?.faq?.answer || "");
    } catch {
      return toLineOutput(matches[0]?.faq?.answer || "");
    }
  };

  const buildFallbackAnswer = () =>
    "I do not have information about this right now.\nPlease ask another question about WHIZROBO programs, kits, pricing, or grades.";

  const sendMessage = async () => {
    const query = input.trim();
    if (!query || loading) return;

    const userMsg = { role: "user", content: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const { matches, intent } = findBestFaqs(query, indexedFaqs, 3);
    const intentReply = getIntentReply(intent);

    let answer = "";
    if (intentReply) {
      answer = intentReply;
    } else if (matches.length === 0) {
      answer = buildFallbackAnswer();
    } else if (intent === "pricing" || intent === "grades" || matches[0].coverage >= 0.85) {
      answer = await enhanceAnswer(query, [matches[0]]);
    } else {
      answer = await enhanceAnswer(query, matches);
    }

    setLoading(false);
    await appendAssistantMessageAnimated(answer);
  };

  return (
    <div className="fixed bottom-5 right-4 sm:right-6 z-[70]">
      {open && (
        <div className="mb-3 w-[calc(100vw-2rem)] sm:w-[27rem] max-w-[29rem] overflow-hidden rounded-2xl border border-orange-200/70 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-gradient-to-r from-[#d86815] to-[#EC7B21] px-4 py-3 text-white">
            <div className="flex items-center gap-2 font-semibold tracking-wide">
              <FaRobot /> WHIZROBO Support Assistant
            </div>
            <button
              className="rounded-md border border-white/35 px-2 py-1 text-xs font-semibold hover:bg-white/10"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>

          <div className="h-80 overflow-y-auto bg-gradient-to-b from-[#fffdfa] to-orange-50 p-3 space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[92%] whitespace-pre-line rounded-2xl px-3 py-2 text-sm ${
                  msg.role === "user"
                    ? "ml-auto bg-gradient-to-r from-[#EC7B21] to-orange-500 text-white"
                    : "mr-auto border border-orange-100 bg-white text-gray-800 shadow-sm"
                }`}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="mr-auto max-w-[92%] rounded-2xl border border-orange-100 bg-white px-3 py-2 text-sm text-gray-700">
                Thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex gap-2 border-t border-orange-100 bg-white p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask your question..."
              className="flex-1 rounded-xl border border-orange-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#EC7B21]/50"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-[#EC7B21] to-orange-600 px-3 py-2 text-sm font-semibold text-white"
            >
              <FaPaperPlane />
              Send
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#d86815] to-[#EC7B21] px-4 py-3 text-sm font-semibold text-white shadow-xl"
      >
        <FaComments />
        WHIZROBO Assistant
      </button>
    </div>
  );
};

export default GeneralFaqChatbot;
