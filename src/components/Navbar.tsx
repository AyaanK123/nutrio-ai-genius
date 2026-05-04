import { Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] shadow-[var(--shadow-soft)]">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight">NutriAI</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Home</Link>
          <Link to="/onboarding" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Get Started</Link>
          <Link to="/dashboard" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Dashboard</Link>
          <Link to="/chat" className="text-sm text-muted-foreground transition-colors hover:text-foreground">AI Chat</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">Log in</Button>
          <Button size="sm" asChild>
            <Link to="/onboarding">Sign up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
