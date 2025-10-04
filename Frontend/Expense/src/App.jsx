import React from "react";
import AdminDashboard from "./pages/Admindashboard.JSX";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <AdminDashboard />
    </div>
  );
}

export default App;
// src/App.jsx
import React, { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import LoginPage from "./pages/Loginpage";
import SignupPage from "./pages/SignupPage";
import { useState } from 'react'

import EmployeeDashboard from   './pages/EmployeeDashboard.JSX'
import './index.css';



function App() {

// Login Page Component
function LoginPage({ onSwitch }) {
  return (
    <>
    <LoginPage/>
    </>
  );
  
      <div className="App">
      <EmployeeDashboard />
    </div>
  )
}
