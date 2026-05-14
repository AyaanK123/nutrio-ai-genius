import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_app/macro-calculator")({
  component: MacroCalculatorPage,
});

function MacroCalculatorPage() {
  const [formData, setFormData] = useState({
    weight: "",
    height: "",
    age: "",
    activity: "moderate",
    goal: "maintain",
  });

  const [loading, setLoading] = useState(false);

  const [results, setResults] = useState<any>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const calculateMacros = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "http://127.0.0.1:5000/calculate-macros",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },

          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      setResults(data);

      setLoading(false);

    } catch (err) {
      console.error(err);

      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">
          Macro Calculator
        </h1>

        <p className="text-muted-foreground">
          Calculate calories and macros instantly
        </p>
      </div>

      {/* Form */}
      <div className="grid gap-4 md:grid-cols-2">
        <input
          type="number"
          name="weight"
          placeholder="Weight (kg)"
          value={formData.weight}
          onChange={handleChange}
          className="rounded-xl border bg-background p-3"
        />

        <input
          type="number"
          name="height"
          placeholder="Height (cm)"
          value={formData.height}
          onChange={handleChange}
          className="rounded-xl border bg-background p-3"
        />

        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          className="rounded-xl border bg-background p-3"
        />

        <select
          name="activity"
          value={formData.activity}
          onChange={handleChange}
          className="rounded-xl border bg-background p-3"
        >
          <option value="sedentary">
            Sedentary
          </option>

          <option value="moderate">
            Moderate
          </option>

          <option value="active">
            Active
          </option>
        </select>

        <select
          name="goal"
          value={formData.goal}
          onChange={handleChange}
          className="rounded-xl border bg-background p-3"
        >
          <option value="maintain">
            Maintain
          </option>

          <option value="loss">
            Weight Loss
          </option>

          <option value="gain">
            Weight Gain
          </option>
        </select>
      </div>

      {/* Button */}
      <button
        onClick={calculateMacros}
        disabled={loading}
        className="rounded-xl bg-primary px-6 py-3 text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
      >
        {loading
          ? "Calculating..."
          : "Calculate Macros"}
      </button>

      {/* Results */}
      {results && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-2xl border bg-card p-5 shadow">
            <div className="text-sm text-muted-foreground">
              Calories
            </div>

            <div className="mt-2 text-3xl font-bold">
              {results.calories}
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
              {results.protein}g
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5 shadow">
            <div className="text-sm text-muted-foreground">
              Carbs
            </div>

            <div className="mt-2 text-3xl font-bold">
              {results.carbs}g
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5 shadow">
            <div className="text-sm text-muted-foreground">
              Fats
            </div>

            <div className="mt-2 text-3xl font-bold">
              {results.fats}g
            </div>
          </div>

        </div>
      )}
    </div>
  );
}