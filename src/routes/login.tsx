import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { useState } from "react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const handleLogin = async () => {

    try {

      setLoading(true);

      const res = await fetch(
        "http://127.0.0.1:5000/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {

        setMessage(data.message);

        return;
      }

      // ✅ Store JWT token
      localStorage.setItem(
        "token",
        data.token
      );


      localStorage.setItem(
        "user_id",
        data.user_id
      );

      setMessage("Login successful");

      // 🚀 Redirect after login
      setTimeout(() => {

        navigate({
          to: "/",
        });

      }, 1000);

    } catch (err) {

      console.error(err);

      setMessage("Login failed");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">

      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-lg">

        <h1 className="mb-6 text-3xl font-bold">
          Login
        </h1>

        <div className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border p-3"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border p-3"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full rounded-xl bg-primary px-5 py-3 text-primary-foreground"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {message && (
            <p className="text-sm text-muted-foreground">
              {message}
            </p>
          )}

        </div>

      </div>

    </div>
  );
}