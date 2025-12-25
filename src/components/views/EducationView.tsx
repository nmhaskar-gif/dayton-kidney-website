import React, { useState, useEffect } from "react";
import { FAQ_DATA, PODCAST_DATA, NEPHRO_AI_API_URL } from "../../constants";
import {
  MessageSquare,
  Play,
  Pause,
  Plus,
  Minus,
  Bot,
  Headphones,
  Video,
} from "lucide-react";

const EducationView: React.FC = () => {
  // --- STATE ---
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Audio State
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [activeAudio, setActiveAudio] = useState<HTMLAudioElement | null>(null);

  // Chat State
  const apiUrl = NEPHRO_AI_API_URL;
  type ChatRole = "user" | "assistant";
  type ChatMsg = { role: ChatRole; content: string };

  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([
    {
      role: "assistant",
      content:
        "Hi! I can help explain lab results, kidney diets, or general kidney health. What's on your mind?",
    },
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  // Define the list of podcasts (you can add search filtering here later if needed)
  const sortedPods = PODCAST_DATA;

  // --- AUDIO LOGIC ---
  const handlePlay = (idx: number) => {
    // 1. If clicking the currently playing song, pause it.
    if (playingIndex === idx) {
      activeAudio?.pause();
      setPlayingIndex(null);
      return;
    }

    // 2. Stop any previous audio
    if (activeAudio) {
      activeAudio.pause();
    }

    // 3. Start new audio
    const pod = sortedPods[idx];
    if (pod.url) {
      const newAudio = new Audio(pod.url);
      newAudio.play().catch((e) => console.error("Audio play error:", e));

      setActiveAudio(newAudio);
      setPlayingIndex(idx);

      // Reset button when audio finishes
      newAudio.onended = () => setPlayingIndex(null);
    }
  };

  // Cleanup audio when leaving the page
  useEffect(() => {
    return () => {
      if (activeAudio) activeAudio.pause();
    };
  }, [activeAudio]);

  // --- CHAT LOGIC ---
  const sendMessage = async () => {
    const trimmed = chatInput.trim();
    if (!trimmed || chatLoading) return;

    setChatError(null);
    setChatLoading(true);

    const nextMessages: ChatMsg[] = [
      ...chatMessages,
      { role: "user", content: trimmed },
    ];
    setChatMessages(nextMessages);
    setChatInput("");

    try {
      const history = nextMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const resp = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history }),
      });

      if (!resp.ok) throw new Error(`Request failed (${resp.status})`);

      const data = await resp.json();
      const assistantText: string =
        data?.reply?.content ??
        "Something went wrong. For medical questions, ask your nephrologist.";

      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantText },
      ]);
    } catch {
      setChatError(
        "Chat service is temporarily unavailable. Please try again."
      );
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Something went wrong. For medical questions, ask your nephrologist.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto pt-32 pb-20 px-4 md:px-12 lg:px-20 animate-fade-in custom-scrollbar">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Section 1: AI Assistant */}
        <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
          {/* Decorative background circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                  <Bot size={24} className="text-teal-400" />
                </div>
                <span className="text-teal-400 font-bold tracking-widest text-sm uppercase">
                  DK AI Assistant
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Got questions about your kidneys?
              </h2>
              <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                Our advanced AI assistant is trained on trusted medical data to
                help answer your questions about CKD, diet, and treatments
                instantly.
              </p>
              <button
                onClick={() => {
                  setChatMessages([
                    {
                      role: "assistant",
                      content:
                        "Hi! I can help explain lab results, kidney diets, or general kidney health. What's on your mind?",
                    },
                  ]);
                  setChatInput("");
                  setChatError(null);
                  setChatOpen(true);
                }}
                className="bg-teal-500 hover:bg-teal-400 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg transform hover:-translate-y-1 flex items-center gap-2"
              >
                <MessageSquare size={20} />
                Start Chatting
              </button>
            </div>

            {/* Simulated Chat Interface */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-4 shadow-inner max-w-sm mx-auto w-full">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0">
                    <Bot size={16} />
                  </div>
                  <div className="bg-white/20 rounded-2xl rounded-tl-none p-3 text-sm">
                    Hi! I can help answer questions about lab results, kidney
                    diets, or general kidney health. What's on your mind?
                  </div>
                </div>
                <div className="flex gap-3 flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    You
                  </div>
                  <div className="bg-blue-600 rounded-2xl rounded-tr-none p-3 text-sm">
                    What foods are high in potassium?
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0">
                    <Bot size={16} />
                  </div>
                  <div className="bg-white/20 rounded-2xl rounded-tl-none p-3 text-sm flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-100"></span>
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-200"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Audio and Video Library */}
        <div className="space-y-6">
          {/* Header row */}
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-full text-orange-600 shadow-sm">
              <Headphones size={24} />
            </div>

            <div className="inline-flex px-6 py-2 bg-white/90 backdrop-blur-md rounded-full border border-white/60 shadow-sm">
              <h3 className="text-2xl md:text-3xl font-bold text-blue-900 whitespace-nowrap">
                Audio and Video Library
              </h3>
            </div>
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPods.map((pod, idx) => {
              const isVideo =
                pod.type === "video" ||
                (typeof pod.url === "string" &&
                  (pod.url.includes("youtube") ||
                    pod.url.includes("youtu.be")));

              return (
                <div
                  key={idx}
                  className={`bg-white border rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group relative overflow-hidden flex flex-col
                    ${
                      playingIndex === idx && !isVideo
                        ? "border-orange-400 ring-2 ring-orange-100"
                        : "border-gray-100"
                    }
                  `}
                >
                  {/* MEDIA TYPE PILL */}
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full tracking-wider border
                        ${
                          isVideo
                            ? "bg-red-100 text-red-700 border-red-200"
                            : "bg-teal-100 text-teal-800 border-teal-200"
                        }`}
                    >
                      {isVideo ? "▶ VIDEO" : "🎧 AUDIO"}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-blue-900 mb-2">
                    {pod.title}
                  </h4>

                  <p className="text-sm text-slate-600 mb-4 line-clamp-3 flex-grow">
                    {pod.description}
                  </p>

                  {/* ACTION BUTTONS */}
                  <div className="pt-4 border-t border-gray-100 mt-auto">
                    {isVideo ? (
                      <a
                        href={pod.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-red-600 font-semibold hover:text-red-700 transition-colors"
                      >
                        Watch Video &rarr;
                      </a>
                    ) : (
                      <button
                        onClick={() => handlePlay(idx)}
                        className={`flex items-center gap-2 font-semibold transition-colors ${
                          playingIndex === idx
                            ? "text-orange-500"
                            : "text-teal-600 hover:text-teal-700"
                        }`}
                      >
                        {playingIndex === idx ? (
                          <>
                            <span>Playing...</span>
                            <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping" />
                          </>
                        ) : (
                          <>Play Episode ▶</>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: FAQ */}
        <div>
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-blue-100 rounded-full text-blue-700 shadow-sm">
              <MessageSquare size={24} />
            </div>

            <div className="inline-flex px-6 py-2 bg-white/90 backdrop-blur-md rounded-full border border-white/60 shadow-sm">
              <h3 className="text-2xl md:text-3xl font-bold text-blue-900 whitespace-nowrap">
                Frequently Asked Questions
              </h3>
            </div>
          </div>

          <div className="space-y-4">
            {FAQ_DATA.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white/90 backdrop-blur-md border border-white/50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex justify-between items-center p-6 text-left hover:bg-white/50 transition-colors"
                >
                  <span className="text-lg font-semibold text-blue-900 pr-8">
                    {faq.question}
                  </span>
                  {openFaq === idx ? (
                    <Minus size={20} className="text-teal-600 flex-shrink-0" />
                  ) : (
                    <Plus
                      size={20}
                      className="text-blue-900/50 flex-shrink-0"
                    />
                  )}
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    openFaq === idx
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="p-6 pt-0 text-slate-700 leading-relaxed border-t border-gray-100/50 mt-2">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat modal */}
      {chatOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4"
          onClick={() => setChatOpen(false)}
        >
          <div
            className="w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
              <div className="flex items-center gap-2">
                <Bot size={18} className="text-teal-300" />
                <div className="font-semibold">Dayton Kidney AI Assistant</div>
              </div>
              <button
                className="text-white/80 hover:text-white text-sm"
                onClick={() => setChatOpen(false)}
              >
                Close
              </button>
            </div>

            {/* Disclaimer */}
            <div className="px-4 py-3 text-xs text-slate-700 bg-slate-50 border-b">
              Educational only. Not medical advice. In an emergency, call 911 or
              go to the nearest emergency department. For questions about your
              own health, ask your nephrologist. Do not enter personal or
              identifying health information (such as names, dates of birth, or
              medical record numbers).
            </div>

            {/* Messages */}
            <div className="h-[420px] overflow-y-auto px-4 py-4 space-y-3 bg-white">
              {chatMessages.length === 0 ? (
                <div className="text-sm text-slate-600">
                  Ask a simple question about kidney labs (e.g., creatinine,
                  eGFR, potassium). The assistant cannot diagnose, stage CKD, or
                  interpret your personal results.
                </div>
              ) : (
                chatMessages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      m.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${
                        m.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-900"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))
              )}

              {chatLoading && (
                <div className="text-xs text-slate-500">
                  Assistant is typing…
                </div>
              )}
              {chatError && (
                <div className="text-xs text-red-600">{chatError}</div>
              )}
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t bg-white">
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm"
                  placeholder="Type your question..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  disabled={chatLoading}
                />
                <button
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-500"
                  onClick={sendMessage}
                  disabled={chatLoading}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationView;
