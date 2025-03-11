"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const ChangePasswordForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token"); // Get token from URL

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("/api/auth/pwchange", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password.");
      }

      setMessage("Password reset successfully! Redirecting to login...");

      // Redirect after 3 seconds
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Set New Password
        </h2>

        {error && (
          <p className="text-red-600 text-sm text-center mb-4">{error}</p>
        )}
        {message && (
          <p className="text-green-600 text-sm text-center mb-4">{message}</p>
        )}

        <form className="space-y-4" onSubmit={handleResetPassword}>
          {/* New Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
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

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-900 transition"
          >
            Reset Password
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

export default ChangePasswordForm;
