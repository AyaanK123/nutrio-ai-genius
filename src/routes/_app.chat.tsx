// import { createFileRoute } from "@tanstack/react-router";
// import { useEffect, useRef, useState } from "react";
// import { Send, Sparkles, User } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// export const Route = createFileRoute("/_app/chat")({
//   head: () => ({ meta: [{ title: "AI Chat — NutriAI" }] }),
//   component: Chat,
// });

// type Msg = { role: "user" | "ai"; text: string };

// const initial: Msg[] = [
//   { role: "ai", text: "Hi! I'm your AI nutritionist. Ask me anything about your meals, macros, or goals." },
//   { role: "user", text: "What should I eat post-workout for muscle gain?" },
//   { role: "ai", text: "Aim for ~30g protein and 40-60g carbs within 60 minutes. A great option: grilled chicken with rice and steamed veggies, or a protein shake with a banana." },
// ];

// function Chat() {
//   const [messages, setMessages] = useState<Msg[]>(initial);
//   const [input, setInput] = useState("");
//   const endRef = useRef<HTMLDivElement>(null);

//   useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

//   const send = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!input.trim()) return;
//     const text = input.trim();
//     setMessages((m) => [...m, { role: "user", text }]);
//     setInput("");
//     setTimeout(() => {
//       setMessages((m) => [...m, { role: "ai", text: "Great question! Based on your profile, I'd recommend balancing lean protein, complex carbs, and healthy fats. Want me to suggest a specific meal?" }]);
//     }, 700);
//   };

//   return (
//     <div className="flex h-[calc(100vh-8rem)] flex-col rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
//       <div className="flex items-center gap-3 border-b border-border px-6 py-4">
//         <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)]">
//           <Sparkles className="h-5 w-5 text-primary-foreground" />
//         </div>
//         <div>
//           <div className="font-semibold">NutriAI Assistant</div>
//           <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
//             <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Online
//           </div>
//         </div>
//       </div>

//       <div className="flex-1 space-y-4 overflow-y-auto p-6">
//         {messages.map((m, i) => (
//           <div key={i} className={`flex items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
//             {m.role === "ai" && (
//               <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
//                 <Sparkles className="h-4 w-4" />
//               </div>
//             )}
//             <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
//               m.role === "user"
//                 ? "rounded-br-sm bg-[image:var(--gradient-primary)] text-primary-foreground"
//                 : "rounded-bl-sm bg-muted text-foreground"
//             }`}>
//               {m.text}
//             </div>
//             {m.role === "user" && (
//               <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
//                 <User className="h-4 w-4" />
//               </div>
//             )}
//           </div>
//         ))}
//         <div ref={endRef} />
//       </div>

//       <form onSubmit={send} className="flex items-center gap-2 border-t border-border p-4">
//         <Input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Ask your nutritionist..."
//           className="h-11 rounded-xl"
//         />
//         <Button type="submit" size="icon" className="h-11 w-11 shrink-0 rounded-xl">
//           <Send className="h-4 w-4" />
//         </Button>
//       </form>
//     </div>
//   );
// }




import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_app/chat")({
  component: ChatPage,
});

function ChatPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    // 👤 Add user message
    const userMessage = {
      sender: "user",
      text: message,
    };

    setMessages((prev) => [...prev, userMessage]);

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
      <div className="mb-4 h-[500px] overflow-y-auto rounded-xl border bg-card p-4">
        {messages.length === 0 && (
          <p className="text-muted-foreground">
            Ask nutrition questions...
          </p>
        )}

        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[80%] rounded-xl p-3 ${
                msg.sender === "user"
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>
      </div>

      {/* ✍️ Input area */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Ask something..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 rounded-xl border bg-background px-4 py-3 outline-none"
        />

        <button
          onClick={sendMessage}
          className="rounded-xl bg-primary px-6 py-3 text-primary-foreground"
        >
          Send
        </button>
      </div>
    </div>
  );
}