import { useState } from "react";
import "./App.css";
import { Link, Links } from "react-router-dom";

function App() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100 p-4">
      <form
        action="#"
        className="w-full max-w-md space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label
            className="block text-sm font-medium text-gray-900"
            htmlFor="username"
          >
            Username
          </label>
          <input
            className="mt-1 w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-gray-900 placeholder-gray-400 focus:border-[#1A5F3F] focus:outline-none focus:ring-1 focus:ring-[#1A5F3F]"
            id="username"
            type="text"
            placeholder="Your username"
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-900"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="mt-1 w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-gray-900 placeholder-gray-400 focus:border-[#1A5F3F] focus:outline-none focus:ring-1 focus:ring-[#1A5F3F]"
            id="password"
            type="text"
            placeholder="Your password"
          />
        </div>

        <Link
          className="block w-full rounded-lg bg-[#1A5F3F] px-4 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-green-700"
          type="login"
          to="/dashboard"
        >
          Login
        </Link>
      </form>
    </div>
  );
}

export default App;
