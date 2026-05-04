import { createFileRoute } from "@tanstack/react-router";
import { Sunrise, Sun, Moon, Cookie } from "lucide-react";

export const Route = createFileRoute("/_app/meal-plan")({
  head: () => ({ meta: [{ title: "Meal Plan — NutriAI" }] }),
  component: MealPlan,
});

const meals = [
  {
    type: "Breakfast", icon: Sunrise, name: "Greek Yogurt Bowl", calories: 420,
    protein: 28, carbs: 45, fats: 12,
    img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80",
  },
  {
    type: "Lunch", icon: Sun, name: "Grilled Chicken Quinoa", calories: 620,
    protein: 48, carbs: 65, fats: 18,
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
  },
  {
    type: "Dinner", icon: Moon, name: "Salmon & Roasted Veggies", calories: 580,
    protein: 42, carbs: 38, fats: 24,
    img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80",
  },
  {
    type: "Snacks", icon: Cookie, name: "Almonds & Apple", calories: 280,
    protein: 8, carbs: 32, fats: 14,
    img: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=600&q=80",
  },
];

function MealPlan() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Today's Meal Plan</h1>
        <p className="text-muted-foreground">Curated for your goals and preferences.</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {meals.map((m) => (
          <div key={m.type} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]">
            <div className="relative h-40 overflow-hidden">
              <img src={m.img} alt={m.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1 text-xs font-medium backdrop-blur">
                <m.icon className="h-3.5 w-3.5 text-primary" /> {m.type}
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-base font-semibold">{m.name}</h3>
              <div className="mt-1 text-2xl font-bold text-primary">{m.calories} <span className="text-sm font-normal text-muted-foreground">kcal</span></div>
              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4 text-center text-xs">
                <div><div className="font-semibold text-foreground">{m.protein}g</div><div className="text-muted-foreground">Protein</div></div>
                <div><div className="font-semibold text-foreground">{m.carbs}g</div><div className="text-muted-foreground">Carbs</div></div>
                <div><div className="font-semibold text-foreground">{m.fats}g</div><div className="text-muted-foreground">Fats</div></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
