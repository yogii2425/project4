// src/components/SignupPage.jsx
import React, { useState, useEffect, useMemo } from "react";

export default function SignupPage({ onSwitch, onViewTerms }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [currency, setCurrency] = useState("");
  const [password, setPassword] = useState("");

  const [validation, setValidation] = useState({});

  // ✅ Validation Logic
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setValidation({
      username: {
        isValid: username.length >= 3,
        message: "Username must be at least 3 characters.",
      },
      email: {
        isValid: emailRegex.test(email),
        message: "Enter a valid email.",
      },
      password: {
        isValid: password.length >= 6,
        message: "Password must be at least 6 characters.",
      },
    });
  }, [username, email, password]);

  const isFormValid = useMemo(
    () =>
      validation.username?.isValid &&
      validation.email?.isValid &&
      validation.password?.isValid &&
      country &&
      currency,
    [validation, country, currency]
  );

  // ✅ Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    alert("🎉 Signup successful!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      {/* Card */}
      <div
        className="relative w-full max-w-md p-8 space-y-8 bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30
         animate-fadeIn hover:scale-105 transition-transform duration-300 ease-in-out"
      >
        {/* Glow Background Animation */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

        {/* Header */}
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-white drop-shadow-lg animate-slideDown">
            Create Your Account
          </h2>
          <p className="mt-2 text-sm text-white/80">
            Join us and start managing your expenses easily.
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {/* Username */}
          <input
            type="text"
            placeholder="👤 Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="block w-full px-4 py-3 bg-white/70 rounded-lg placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
          />
          {validation.username && !validation.username.isValid && (
            <p className="text-sm text-yellow-200">{validation.username.message}</p>
          )}

          {/* Email */}
          <input
            type="email"
            placeholder="📧 Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full px-4 py-3 bg-white/70 rounded-lg placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
          />
          {validation.email && !validation.email.isValid && (
            <p className="text-sm text-yellow-200">{validation.email.message}</p>
          )}

          {/* Country */}
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="block w-full px-4 py-3 bg-white/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
          >
            <option value="">🌍 Select Country</option>
            <option value="India">India 🇮🇳</option>
            <option value="USA">USA 🇺🇸</option>
            <option value="UK">UK 🇬🇧</option>
          </select>

          {/* Currency */}
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="block w-full px-4 py-3 bg-white/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
          >
            <option value="">💰 Select Currency</option>
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
            <option value="GBP">GBP (£)</option>
          </select>

          {/* Password */}
          <input
            type="password"
            placeholder="🔑 Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full px-4 py-3 bg-white/70 rounded-lg placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
          />
          {validation.password && !validation.password.isValid && (
            <p className="text-sm text-yellow-200">{validation.password.message}</p>
          )}

          {/* Terms & Conditions */}
          <p className="text-sm text-white text-center">
            By signing up, you agree to our{" "}
            <button
              type="button"
              onClick={onViewTerms}
              className="underline text-yellow-300 hover:text-yellow-400 transition-colors"
            >
              Terms & Conditions
            </button>
          </p>

          {/* Submit */}
          <button
            type="submit"
            disabled={!isFormValid}
            className="w-full py-3 px-4 text-lg font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg shadow-lg hover:from-purple-600 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
          >
            🚀 Sign Up
          </button>
        </form>

        {/* Switch to Login */}
        <p className="mt-6 text-center text-sm text-white">
          Already have an account?{" "}
          <button
            onClick={onSwitch}
            className="font-medium underline hover:text-yellow-300 transition-colors"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}
