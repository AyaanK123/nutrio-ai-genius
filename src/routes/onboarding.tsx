import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { User, Users, Ruler, Weight, Activity, Target, Apple, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navbar } from "@/components/Navbar";
import { useState } from "react";



export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Get Started — NutriAI" },
      { name: "description", content: "Tell us about yourself and let AI build your personalized nutrition plan." },
    ],
  }),
  component: Onboarding,
});

function Field({ icon: Icon, label, children }: { icon: any; label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-sm font-medium">
        <Icon className="h-4 w-4 text-primary" />
        {label}
      </Label>
      {children}
    </div>
  );
}

function Onboarding() {
  const [gender, setGender] = useState("");
  const [dietaryPreference, setDietaryPreference] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [goal, setGoal] = useState("");
  const [activity, setActivity] = useState("");
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[image:var(--gradient-soft)]">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Build your nutrition profile</h1>
            <p className="mt-2 text-muted-foreground">A few quick details — we'll handle the science.</p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();

              const userData = {
                age,
                gender,
                height,
                weight,
                activity,
                goal,
                dietaryPreference,
              };
              console.log("Submitting:", userData);
              localStorage.setItem("userData", JSON.stringify(userData));

              fetch(
                `https://nutrio-ai-genius-1.onrender.com/update-user/${localStorage.getItem("user_id")}`,
                {
                  method: "PUT",

                  headers: {
                    "Content-Type": "application/json",
                  },

                  body: JSON.stringify(userData),
                }
              )
                .then((res) => res.json())

                .then((data) => {

                  console.log(data);

                  navigate({
                    to: "/dashboard",
                  });

                })
                .catch((err) => {
                  console.error(err);
                });
              navigate({ to: "/dashboard" });
            }}
            className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-card)]"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <Field icon={User} label="Age">
                <Input
                  type="number"
                  placeholder="28"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </Field>
              <Field icon={Users} label="Gender">
                <Select  onValueChange={setGender}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field icon={Ruler} label="Height (cm)">
                <Input
                  type="number"
                  placeholder="175"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </Field>
              <Field icon={Weight} label="Weight (kg)">
                <Input
                  type="number"
                  placeholder="70"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </Field>
              <Field icon={Activity} label="Activity Level">
                <Select onValueChange={setActivity}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field icon={Target} label="Goal">
                <Select onValueChange={setGoal}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="loss">Weight Loss</SelectItem>
                    <SelectItem value="gain">Muscle Gain</SelectItem>
                    <SelectItem value="maintain">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <div className="sm:col-span-2">
                <Field icon={Apple} label="Dietary Preference">
                  <Select onValueChange={setDietaryPreference}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="veg">Vegetarian</SelectItem>
                      <SelectItem value="nonveg">Non-Vegetarian</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </div>
            <Button type="submit" size="lg" className="mt-8 h-12 w-full text-base shadow-[var(--shadow-soft)]">
              Generate Plan <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

