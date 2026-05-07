import { createFileRoute } from "@tanstack/react-router";
import { Flame, TrendingDown, Scale, Target } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — NutriAI" }] }),
  component: Dashboard,
});
const mockData = {
  calories: 2200,
  protein: 120,
};
const weightData = [
  { day: "Mon", weight: 72.4 },
  { day: "Tue", weight: 72.1 },
  { day: "Wed", weight: 71.9 },
  { day: "Thu", weight: 71.7 },
  { day: "Fri", weight: 71.5 },
  { day: "Sat", weight: 71.3 },
  { day: "Sun", weight: 71.0 },
];

const macros = [
  { name: "Protein", value: 110, goal: 150, color: "oklch(0.62 0.16 150)" },
  { name: "Carbs", value: 210, goal: 280, color: "oklch(0.74 0.18 152)" },
  { name: "Fats", value: 55, goal: 70, color: "oklch(0.55 0.12 145)" },
];

function Stat({ icon: Icon, label, value, hint }: { icon: any; label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-3 text-2xl font-bold">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

function Dashboard() {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  const [macroData, setMacroData] = useState<any>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  });

  useEffect(() => {
    fetch("http://127.0.0.1:5000/calculate-macros", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((res) => res.json())
      .then((data) => {
        setMacroData(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);


  const calculateCalories = () => {
    const weight = Number(userData.weight);
    const height = Number(userData.height);
    const age = Number(userData.age);

    if (!weight || !height || !age) return 0;

    // Simple BMR formula
    const bmr = 10 * weight + 6.25 * height - 5 * age + 5;

    return Math.round(bmr * 1.5); // activity factor
  };

const calories = calculateCalories();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Good morning, Alex 👋
        </h1>
        <p className="text-muted-foreground">
          Here's your nutrition snapshot for today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border bg-card p-5 shadow">
          <div className="text-sm text-muted-foreground">
            Calories
          </div>

          <div className="mt-2 text-3xl font-bold">
            {macroData.calories}
          </div>

          <div className="mt-1 text-sm text-muted-foreground">
            kcal/day
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow">
          <div className="text-sm text-muted-foreground">
            Protein
          </div>

          <div className="mt-2 text-3xl font-bold">
            {macroData.protein}g
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow">
          <div className="text-sm text-muted-foreground">
            Carbs
          </div>

          <div className="mt-2 text-3xl font-bold">
            {macroData.carbs}g
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow">
          <div className="text-sm text-muted-foreground">
            Fats
          </div>

          <div className="mt-2 text-3xl font-bold">
            {macroData.fats}g
          </div>
        </div>

      </div>

      <div className="bg-card p-4 rounded-xl">
        <p>Weight: {userData?.weight || "Not set"}</p>
        <p>Goal: {userData?.goal || "Not set"}</p>
        <p>Height: {userData?.height || "Not set"}</p>
        <p>Age: {userData?.age || "Not set"}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-border bg-[image:var(--gradient-primary)] p-8 text-primary-foreground shadow-[var(--shadow-soft)] lg:col-span-1">
          <div className="flex items-center gap-2 text-sm opacity-90">
            <Target className="h-4 w-4" /> Daily Calories
          </div>
          <div className="mt-4 text-5xl font-bold">{calories}</div>
          <div className="mt-1 text-sm opacity-90">of 2,400 kcal goal</div>
          <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-white/20">
            <div className="h-full rounded-full bg-white" style={{ width: "89%" }} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:col-span-2">
          <Stat icon={Flame} label="Calories Consumed" value="2,150" hint="+320 since lunch" />
          <Stat icon={TrendingDown} label="Calories Remaining" value="250" hint="Stay on track" />
          <Stat icon={Scale} label="Current Weight" value="71.0 kg" hint="-1.4 kg this week" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Weight Progress</h3>
            <span className="text-xs text-muted-foreground">Last 7 days</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 150)" />
                <XAxis dataKey="day" stroke="oklch(0.5 0.02 240)" fontSize={12} />
                <YAxis stroke="oklch(0.5 0.02 240)" fontSize={12} domain={["dataMin - 0.5", "dataMax + 0.5"]} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid oklch(0.92 0.01 150)" }} />
                <Line type="monotone" dataKey="weight" stroke="oklch(0.62 0.16 150)" strokeWidth={3} dot={{ r: 4, fill: "oklch(0.62 0.16 150)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <h3 className="mb-5 text-lg font-semibold">Macronutrients</h3>
          <div className="space-y-5">
            {macros.map((m) => {
              const pct = Math.min(100, (m.value / m.goal) * 100);
              return (
                <div key={m.name}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium">{m.name}</span>
                    <span className="text-muted-foreground">{m.value}g / {m.goal}g</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: m.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
