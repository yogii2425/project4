// src/components/SignupPage.jsx
import React, { useState, useEffect, useMemo } from "react";

export default function SignupPage({ onSwitch }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [currency, setCurrency] = useState("");
  const [password, setPassword] = useState("");

  const [validation, setValidation] = useState({});

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    console.log("Signing up:", {
      username,
      email,
      country,
      currency,
      password,
    });
    alert("Signup functionality would be here!");
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800">Create an Account</h2>
        <p className="mt-2 text-sm text-gray-600">
          Sign up to start managing your expenses.
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {validation.username && !validation.username.isValid && (
          <p className="text-sm text-red-600">{validation.username.message}</p>
        )}

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {validation.email && !validation.email.isValid && (
          <p className="text-sm text-red-600">{validation.email.message}</p>
        )}

        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="block w-full px-3 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select Country</option>
          <option value="India">India</option>
          <option value="USA">USA</option>
          <option value="UK">UK</option>
        </select>

        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="block w-full px-3 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select Currency</option>
          <option value="INR">INR</option>
          <option value="USD">USD</option>
          <option value="GBP">GBP</option>
        </select>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {validation.password && !validation.password.isValid && (
          <p className="text-sm text-red-600">{validation.password.message}</p>
        )}

        <button
          type="submit"
          disabled={!isFormValid}
          className="w-full py-3 px-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-all duration-300"
        >
          Sign Up
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <button
          onClick={onSwitch}
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Log in
        </button>
      </p>
    </div>
  );
}
