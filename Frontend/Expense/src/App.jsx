import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard"; // ✅ check file name spelling/case
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        {/* ✅ Navbar */}
        <nav className="bg-white dark:bg-gray-800 shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">MyApp</h1>
            <div className="space-x-6">
              <Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-blue-500">Dashboard</Link>
              <Link to="/login" className="text-gray-700 dark:text-gray-200 hover:text-blue-500">Login</Link>
              <Link to="/signup" className="text-gray-700 dark:text-gray-200 hover:text-blue-500">Signup</Link>
            </div>
          </div>
        </nav>

        {/* ✅ Page Routes */}
        <div className="p-6">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
