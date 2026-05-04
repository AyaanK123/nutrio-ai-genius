import { createFileRoute, Link } from "@tanstack/react-router";
import { Salad, Flame, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NutriAI – Personalized Diet Plans Powered by AI" },
      { name: "description", content: "AI-powered nutritionist that builds personalized diet plans, tracks calories, and recommends meals tailored to your goals." },
      { property: "og:title", content: "NutriAI – Personalized Diet Plans Powered by AI" },
      { property: "og:description", content: "Personalized health recommendations powered by AI." },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Salad, title: "Personalized Diet Plans", desc: "Plans tailored to your body, goals, and dietary preferences — updated as you progress." },
  { icon: Flame, title: "Calorie Tracking", desc: "Track every meal effortlessly. See macros and calories at a glance." },
  { icon: Sparkles, title: "AI Meal Recommendations", desc: "Smart meal ideas powered by AI based on what you have and what you love." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[image:var(--gradient-soft)]" />
        <div className="absolute -right-24 -top-24 -z-10 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="container mx-auto px-4 py-24 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Powered by Advanced AI
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              AI Nutritionist – Personalized Diet Plans <span className="bg-[image:var(--gradient-primary)] bg-clip-text text-transparent">Powered by AI</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Get personalized health recommendations, smart meal plans, and real-time calorie tracking — all built around your unique goals and lifestyle.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" asChild className="h-12 px-8 text-base shadow-[var(--shadow-soft)]">
                <Link to="/onboarding">Get Started <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-12 px-8 text-base">
                <Link to="/dashboard">View Demo</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              {["No credit card", "Free 14-day trial", "Cancel anytime"].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-primary" />{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need to eat smarter</h2>
          <p className="mt-3 text-muted-foreground">A complete nutrition platform built around AI-powered insights.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="group rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-10">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 NutriAI. Crafted for healthier lives.
        </div>
      </footer>
    </div>
  );
}
