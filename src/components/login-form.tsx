"use client";

const LoginForm = () => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Log In</h2>

        <form className="space-y-4">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
          </div>

          {/* Password */}
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
          <a href="#" className="text-gray-800 font-semibold hover:underline">
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
