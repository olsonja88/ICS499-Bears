"use client";

import { useState } from "react";

const PasswordResetForm = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetRequest = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/pwreset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send reset link.");
      }

      setMessage("If this email exists, a reset link has been sent.");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>

        {error && (
          <p className="text-red-600 text-sm text-center mb-4">{error}</p>
        )}
        {message && (
          <p className="text-green-600 text-sm text-center mb-4">{message}</p>
        )}

        <form className="space-y-4" onSubmit={handleResetRequest}>
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-900 transition"
          >
            Send Reset Link
          </button>
        </form>

        {/* Back to Login Link */}
        <div className="text-center text-sm text-gray-600 mt-4">
          <p>
            Remembered your password?{" "}
            <a
              href="/login"
              className="text-gray-800 font-semibold hover:underline"
            >
              Log in
            </a>
          </p>
        </div>
      </div>
    </main>
  );
};

export default PasswordResetForm;
