import React, { useState, useRef, useEffect } from "react";
import { Send, Utensils, Clock, MessageSquare, ChevronRight } from "lucide-react";

/**
 * Restaurant Management Chatbot UI
 *  - POSTs the user's text to `/api/chat`
 *  - Displays bot reply with restaurant-themed styling
 *  - Auto‑scrolls to newest message
 */
const ChatPage = () => {
  /* ---------------- state ---------------- */
  const [messages, setMessages] = useState([
    { 
      from: "bot", 
      text: "Welcome to your Restaurant Assistant! I can help with order management, reservations, inventory, or any restaurant questions. How can I help you today?" 
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  /* ---------------- helpers -------------- */
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /* auto‑scroll whenever messages change */
  useEffect(scrollToBottom, [messages]);

  /* --------------- handlers -------------- */
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 1) optimistic user bubble
    const userMsg = { from: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // 2) call backend
      const response = await fetch("/api/itpm/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMsg.text }),
      });
      
      const data = await response.json();
      const botMsg = { from: "bot", text: data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠️ Sorry, I had trouble answering that. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* Quick suggestion buttons */
  const suggestions = [
    "New reservation",
    "Check inventory",
    "Today's specials",
    "Staff schedule"
  ];

  const handleSuggestion = (suggestion) => {
    setInput(suggestion);
  };

  /* ------------------ UI ----------------- */
  return (
    <div className="flex flex-col h-screen bg-orange-50">
      {/* Header */}
      <div className="bg-amber-700 text-white p-4 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center">
          <Utensils className="h-8 w-8 mr-3" />
          <div>
            <h1 className="text-xl font-bold">Restaurant Assistant</h1>
            <p className="text-sm text-amber-200">Your AI partner for restaurant management</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col">
        {/* Chat window */}
        <div className="flex-1 bg-white rounded-lg shadow-lg overflow-y-auto mb-4 p-4">
          <div className="space-y-4">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-md rounded-lg px-4 py-3 shadow ${
                    m.from === "user"
                      ? "bg-amber-600 text-white"
                      : "bg-gray-100 text-gray-800 border-l-4 border-amber-500"
                  }`}
                >
                  {m.from === "bot" && (
                    <div className="flex items-center mb-1 text-amber-700 font-medium">
                      <Utensils className="h-4 w-4 mr-1" /> 
                      <span>Restaurant Assistant</span>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap text-sm">{m.text}</p>
                  {m.from === "user" && (
                    <div className="mt-1 text-right text-amber-200 text-xs">
                      <span>You</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-3 shadow border-l-4 border-amber-500 max-w-md">
                  <div className="flex items-center mb-1 text-amber-700 font-medium">
                    <Clock className="h-4 w-4 mr-1 animate-spin" /> 
                    <span>Restaurant Assistant is typing...</span>
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: "600ms" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Quick suggestions */}
        <div className="flex flex-wrap gap-2 mb-4">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggestion(suggestion)}
              className="bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-full px-4 py-2 text-sm flex items-center transition-colors"
            >
              <ChevronRight className="h-4 w-4 mr-1" />
              {suggestion}
            </button>
          ))}
        </div>

        {/* Input form - using div instead of form */}
        <div className="flex items-center gap-2 bg-white rounded-lg shadow-lg p-2">
  {/* Input Field - takes most of the space */}
  <div className="flex-grow relative">
    <input
      type="text"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyPress={(e) => e.key === 'Enter' && handleSend(e)}
      placeholder="Ask about reservations, menu, inventory..."
      className="w-full rounded-md bg-gray-100 p-3 pl-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
    />
    <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
  </div>

  {/* Send Button - fixed width and height */}
  <button
    onClick={handleSend}
    disabled={loading}
    className={`flex-shrink-0 w-32 h-12 rounded-md bg-amber-600 text-white hover:bg-amber-700 transition-colors flex items-center justify-center ${
      loading ? "opacity-50 cursor-not-allowed" : ""
    }`}
  >
    <Send className="h-5 w-5 mr-1" />
    <span>Send</span>
  </button>
</div>

      </div>
    </div>
  );
};

export default ChatPage;