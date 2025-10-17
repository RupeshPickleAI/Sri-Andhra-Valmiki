import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import templeImg from "../assets/two.png"; // use a nice devotional image
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "123" && password === "123") {
      setError("");
      navigate("/");
    } else {
      setError("Invalid username or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 via-yellow-200 to-orange-400 relative overflow-hidden">
      {/* Background image */}
      <img
        src={templeImg}
        alt="Temple Background"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-transparent"></div>

      {/* Login Card */}
      <div className="relative z-10 bg-white/20 backdrop-blur-lg rounded-2xl shadow-2xl w-[90%] sm:w-[400px] p-8 border border-white/40 text-center">
        <h1 className="text-3xl font-bold text-white drop-shadow-lg mb-4">
          🙏 Welcome to Bhakti Portal
        </h1>
        <p className="text-yellow-100 text-sm mb-6">
          Please enter your credentials to continue your divine journey.
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="text-left">
            <label className="block text-white text-sm font-semibold mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-4 py-2 rounded-lg bg-white/80 focus:bg-white text-gray-800 placeholder-gray-500 border border-gray-300 focus:ring-2 focus:ring-orange-400 outline-none transition"
              required
            />
          </div>

          <div className="text-left relative">
            <label className="block text-white text-sm font-semibold mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 rounded-lg bg-white/80 focus:bg-white text-gray-800 placeholder-gray-500 border border-gray-300 focus:ring-2 focus:ring-orange-400 outline-none transition"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 text-gray-700"
            >
              {showPassword ?  <Visibility /> : <VisibilityOff />}
            </button>
          </div>

          {error && <p className="text-red-200 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 mt-3 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold rounded-full shadow-lg transition transform hover:scale-105"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-yellow-50 text-sm italic">
          🌼 "Chant the name of the Lord and awaken divine bliss within." 🌼
        </div>
      </div>

      {/* Soft glowing aura effect */}
      <div className="absolute w-96 h-96 bg-orange-300 opacity-20 blur-3xl rounded-full -top-10 -left-10 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-yellow-200 opacity-20 blur-3xl rounded-full bottom-10 right-10 animate-pulse"></div>
    </div>
  );
};

export default Login;
