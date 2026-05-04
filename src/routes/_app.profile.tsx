import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({ meta: [{ title: "Profile — NutriAI" }] }),
  component: Profile,
});

function Profile() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
        <p className="text-muted-foreground">Personal info and preferences.</p>
      </div>
      <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[image:var(--gradient-primary)] text-2xl font-bold text-primary-foreground shadow-[var(--shadow-soft)]">A</div>
          <div>
            <div className="text-xl font-semibold">Alex Morgan</div>
            <div className="text-sm text-muted-foreground">alex@example.com</div>
          </div>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {[
            { l: "Age", v: "28" }, { l: "Height", v: "175 cm" }, { l: "Weight", v: "71 kg" },
            { l: "Goal", v: "Weight Loss" }, { l: "Activity", v: "Moderate" }, { l: "Diet", v: "Vegetarian" },
          ].map((i) => (
            <div key={i.l} className="rounded-xl border border-border p-4">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">{i.l}</div>
              <div className="mt-1 text-lg font-semibold">{i.v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
