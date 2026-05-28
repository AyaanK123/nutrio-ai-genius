import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_app/weekly-plan")({
  component: WeeklyPlanPage,
});

function WeeklyPlanPage() {
  const [weeklyPlan, setWeeklyPlan] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const fetchWeeklyPlan = async () => {
    try {
        const userData = JSON.parse(
        localStorage.getItem("userData") || "{}"
        );
        setLoading(true);
        const res = await fetch(
        "https://nutrio-ai-genius-1.onrender.com/weekly-plan",
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        }
        );

        const data = await res.json();

        setWeeklyPlan(data.weekly_plan);
        setLoading(false);

    } catch (err) {
        setLoading(false);
        console.error(err);
    }
    };

    useEffect(() => {
    fetchWeeklyPlan();
    }, []);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold">
            Weekly Meal Planner
            </h1>

            <p className="text-muted-foreground">
            Personalized meals for your week
            </p>
        </div>

        <button
        onClick={fetchWeeklyPlan}
        disabled={loading}
        className="rounded-xl bg-primary px-4 py-2 text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
        >
        {loading ? "Generating..." : "Regenerate"}
        </button>
        </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Object.entries(weeklyPlan).map(
          ([day, meals]: any) => (
            <div
              key={day}
              className="rounded-2xl border bg-card p-5 shadow"
            >
              <h2 className="mb-4 text-xl font-semibold">
                {day}
              </h2>

              <div className="space-y-3">
                {Object.entries(meals).map(
                  ([mealType, meal]: any) => (
                    <div
                      key={mealType}
                      className="rounded-xl bg-muted p-3"
                    >
                      <div className="text-sm font-medium">
                        {mealType}
                      </div>

                      <div className="mt-1 text-sm text-muted-foreground">
                        {meal}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}