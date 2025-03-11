"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Store token and login state
      localStorage.setItem("token", data.token);
      localStorage.setItem("isLoggedIn", "true");

      // Dispatch a storage event to notify other components
      window.dispatchEvent(new Event("storage"));

      // Redirect to home page
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Log In</h2>

        {error && (
          <p className="text-red-600 text-sm text-center mb-4">{error}</p>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          {/* Username Field */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-900 transition"
          >
            Log In
          </button>
        </form>

        {/* Forgot Password & Sign Up Link */}
        <div className="text-center text-sm text-gray-600 mt-4">
          <a
            href="pwreset"
            className="text-gray-800 font-semibold hover:underline"
          >
            Forgot password?
          </a>
          <p className="mt-2">
            Don't have an account?{" "}
            <a
              href="/registration"
              className="text-gray-800 font-semibold hover:underline"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </main>
  );
};

export default LoginForm;
