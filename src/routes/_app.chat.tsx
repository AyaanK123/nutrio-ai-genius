import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_app/chat")({
  head: () => ({ meta: [{ title: "AI Chat — NutriAI" }] }),
  component: Chat,
});

type Msg = { role: "user" | "ai"; text: string };

const initial: Msg[] = [
  { role: "ai", text: "Hi! I'm your AI nutritionist. Ask me anything about your meals, macros, or goals." },
  { role: "user", text: "What should I eat post-workout for muscle gain?" },
  { role: "ai", text: "Aim for ~30g protein and 40-60g carbs within 60 minutes. A great option: grilled chicken with rice and steamed veggies, or a protein shake with a banana." },
];

function Chat() {
  const [messages, setMessages] = useState<Msg[]>(initial);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const text = input.trim();
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [...m, { role: "ai", text: "Great question! Based on your profile, I'd recommend balancing lean protein, complex carbs, and healthy fats. Want me to suggest a specific meal?" }]);
    }, 700);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-3 border-b border-border px-6 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)]">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <div className="font-semibold">NutriAI Assistant</div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Online
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-6">
        {messages.map((m, i) => (
          <div key={i} className={`flex items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "ai" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Sparkles className="h-4 w-4" />
              </div>
            )}
            <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
              m.role === "user"
                ? "rounded-br-sm bg-[image:var(--gradient-primary)] text-primary-foreground"
                : "rounded-bl-sm bg-muted text-foreground"
            }`}>
              {m.text}
            </div>
            {m.role === "user" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <form onSubmit={send} className="flex items-center gap-2 border-t border-border p-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your nutritionist..."
          className="h-11 rounded-xl"
        />
        <Button type="submit" size="icon" className="h-11 w-11 shrink-0 rounded-xl">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
