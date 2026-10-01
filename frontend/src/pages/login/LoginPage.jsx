import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(event) {
    event.preventDefault();

    setError("");

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      // Store session
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // nav to main page
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setError("Unable to connect to the server");
    }
  }

  return (
    <>
      <div className="flex h-screen w-screen items-center justify-center bg-gray-100 p-4">
        <form
          onSubmit={handleLogin}
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
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>

            <div className="relative mt-1">
              <input
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 pr-11 text-gray-900 placeholder-gray-400 focus:border-[#1A5F3F] focus:outline-none focus:ring-1 focus:ring-[#1A5F3F]"
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            className="block w-full rounded-lg bg-[#1A5F3F] px-4 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-green-700"
            type="submit"
          >
            Login
          </button>
          {error && (
            <p className="italic mt-2 text-center text-sm text-red-600">
              {error}
            </p>
          )}
        </form>
      </div>
    </>
  );
}

export default App;
