import { createFileRoute } from "@tanstack/react-router";
import { Sunrise, Sun, Moon, Cookie } from "lucide-react";
import { useState, useEffect } from "react";


export const Route = createFileRoute("/_app/meal-plan")({
  head: () => ({ meta: [{ title: "Meal Plan — NutriAI" }] }),
  component: MealPlan,
});

// function MealPlan() {
//   const userData = JSON.parse(localStorage.getItem("userData") || "{}");

//   const generateMeals = () => {
//     if (userData.goal === "loss") {
//       return [
//         { type: "Breakfast", name: "Oats + Apple", calories: 300 },
//         { type: "Lunch", name: "Rice + Dal + Salad", calories: 500 },
//         { type: "Dinner", name: "Chapati + Veggies", calories: 400 },
//         { type: "Snacks", name: "Fruit Bowl", calories: 200 },
//       ];
//     }

//     if (userData.goal === "gain") {
//       return [
//         { type: "Breakfast", name: "Oats + Peanut Butter + Banana", calories: 500 },
//         { type: "Lunch", name: "Rice + Chicken/Paneer", calories: 700 },
//         { type: "Dinner", name: "Chapati + Paneer + Eggs", calories: 600 },
//         { type: "Snacks", name: "Nuts + Milkshake", calories: 400 },
//       ];
//     }

//     return [
//       { type: "Breakfast", name: "Poha", calories: 350 },
//       { type: "Lunch", name: "Rice + Dal", calories: 500 },
//       { type: "Dinner", name: "Chapati + Sabzi", calories: 450 },
//       { type: "Snacks", name: "Tea + Biscuit", calories: 200 },
//     ];
//   };

//   const meals = generateMeals();

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">
//           Today's Meal Plan
//         </h1>
//         <p className="text-muted-foreground">
//           Curated for your goals and preferences.
//         </p>
//       </div>

//       <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
//         {meals.map((m) => (
//           <div
//             key={m.type}
//             className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]"
//           >
//             <h3 className="text-base font-semibold">{m.type}</h3>
//             <p className="mt-2 text-sm text-muted-foreground">{m.name}</p>

//             <div className="mt-4 text-2xl font-bold text-primary">
//               {m.calories} kcal
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

function MealPlan() {
  const [mealPlan, setMealPlan] = useState("Loading...");

  useEffect(() => {
    // 🔒 safe localStorage
    let userData = {};
    try {
      userData = JSON.parse(localStorage.getItem("userData") || "{}");
    } catch {
      userData = {};
    }

    // 🚫 DO NOT crash if backend fails
    fetch("http://localhost:5000/generate-meal-plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Backend error");
        }
        return res.json();
      })
      .then((data) => {
        setMealPlan(data.meal_plan || "No response");
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setMealPlan("⚠️ Backend not responding");
      });
  }, []);


  const parseMealPlan = (text: string) => {
    const sections: any = {
      breakfast: "",
      lunch: "",
      dinner: "",
      snacks: "",
    };

    text.split("\n").forEach((line) => {
      const lower = line.toLowerCase();

      if (lower.includes("breakfast")) sections.breakfast = line;
      else if (lower.includes("lunch")) sections.lunch = line;
      else if (lower.includes("dinner")) sections.dinner = line;
      else if (lower.includes("snack")) sections.snacks = line;
    });

    return sections;
  };

  const parsed = parseMealPlan(mealPlan);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Meal Plan</h1>
      </div>

      <div className="bg-card p-4 rounded-xl border">
      ////
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-4 border rounded-xl bg-card">
            <h3 className="font-semibold">Breakfast</h3>
            <p className="text-sm mt-2">{parsed.breakfast || "—"}</p>
          </div>

          <div className="p-4 border rounded-xl bg-card">
            <h3 className="font-semibold">Lunch</h3>
            <p className="text-sm mt-2">{parsed.lunch || "—"}</p>
          </div>

          <div className="p-4 border rounded-xl bg-card">
            <h3 className="font-semibold">Dinner</h3>
            <p className="text-sm mt-2">{parsed.dinner || "—"}</p>
          </div>

          <div className="p-4 border rounded-xl bg-card">
            <h3 className="font-semibold">Snacks</h3>
            <p className="text-sm mt-2">{parsed.snacks || "—"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}