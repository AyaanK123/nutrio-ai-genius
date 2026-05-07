import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";

export const Route = createFileRoute("/_app/chat")({
  component: ChatPage,
});

function ChatPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);


  const sendMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);
    // 👤 Add user message
    const userMessage = {
      sender: "user",
      text: message,
    };

    setMessages((prev) => [...prev, userMessage]);

    setLoading(false);

    const currentMessage = message;
    setMessage("");

    try {
      // 🤖 Send to backend
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentMessage,
        }),
      });

      const data = await res.json();

      // 🤖 Add AI response
      const aiMessage = {
        sender: "ai",
        text: data.reply,
      };

      setMessages((prev) => [...prev, aiMessage]);

    } catch (err) {
      console.error(err);
      setLoading(false);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "⚠️ Backend not responding",
        },
      ]);
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-3xl font-bold">
        AI Nutrition Chat
      </h1>

      {/* 💬 Chat messages */}
      <div className="mb-4 h-[500px] overflow-y-auto rounded-2xl border bg-card p-6 shadow">
        {messages.length === 0 && (
          <p className="text-muted-foreground">
            Ask nutrition questions...
          </p>
        )}

        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 shadow ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <div className="mb-1 text-xs opacity-70">
                  {msg.sender === "user" ? "You" : "NutriAI"}
                </div>

                <div className="whitespace-pre-wrap">
                  {msg.text}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="max-w-[80%] rounded-xl bg-muted p-3">
              <div className="flex justify-start">
                <div className="rounded-2xl bg-muted px-4 py-3 shadow">
                  <div className="mb-1 text-xs opacity-70">
                    NutriAI
                  </div>

                  <div className="animate-pulse">
                    Typing...
                  </div>
                </div>
              </div>
            </div>
          )}


          <div ref={bottomRef} />
        </div>
      </div>

      {/* ✍️ Input area */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Ask something..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}

          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          className="flex-1 rounded-xl border bg-background px-4 py-3 outline-none"
        />

        <button
          disabled={loading}
          onClick={sendMessage}
          className="rounded-xl bg-primary px-6 py-3 text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}