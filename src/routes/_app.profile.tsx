import { createFileRoute } from "@tanstack/react-router";
import {useState, useEffect} from "react"


export const Route = createFileRoute("/_app/profile")({
  head: () => ({ meta: [{ title: "Profile — NutriAI" }] }),
  component: Profile,
});

function Profile() {
  
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState<any>({});
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/users")
      .then((res) => res.json())
      .then((data) => {

        // Get latest saved user
        const latestUser = data[data.length - 1];

        setUser(latestUser);
        setFormData(latestUser);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const saveProfile = async () => {
    console.log("Saving profile...", formData);
    try {
      const res = await fetch(
        `http://127.0.0.1:5000/update-user/${user.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      console.log(data);

      setUser(formData);

      setEditing(false);

    } catch (err) {
      console.error(err);
    }
  };



    if (!user) {
      return (
        <div className="p-6">
          Loading profile...
        </div>
      );
    }
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
          <p className="text-muted-foreground">Personal info and preferences.</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between">

            <div className="flex items-center gap-5">

              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[image:var(--gradient-primary)] text-2xl font-bold text-primary-foreground shadow-[var(--shadow-soft)]">
                A
              </div>

              <div>
                <div className="text-xl font-semibold">
                  Alex Morgan
                </div>

                <div className="text-sm text-muted-foreground">
                  alex@example.com
                </div>
              </div>

            </div>

            <button
              onClick={() => setEditing(!editing)}
              className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
            >
              {editing ? "Cancel" : "Edit Profile"}
            </button>

          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              { l: "Age", v: user.age },

              { l: "Gender", v: user.gender },

              { l: "Height", v: `${user.height} cm` },

              { l: "Weight", v: `${user.weight} kg` },

              { l: "Goal", v: user.goal },

              { l: "Activity", v: user.activity },

              { l: "Diet", v: user.dietary_preference },
            ].map((i) => (
              <div key={i.l} className="rounded-xl border border-border p-4">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">{i.l}</div>
                <div className="mt-1 text-lg font-semibold">{i.v}</div>
              </div>
            ))}
          </div>

          {editing && (
            <div className="mt-6 space-y-4">

              <div>
                <p className="mb-2 text-sm font-medium">
                  Update Weight
                </p>

                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="Weight"
                  className="w-full rounded-xl border p-3"
                />
              </div>
              <div>

                <p className="mb-2 text-sm font-medium">
                  Update Height
                </p>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="Height"
                  className="w-full rounded-xl border p-3"
                />
              </div>
              

              <button
                onClick={saveProfile}
                className="rounded-xl bg-primary px-5 py-3 text-primary-foreground"
              >
                Save Changes
              </button>

            </div>
          )}


        </div>
      </div>
    );
  
  
}
