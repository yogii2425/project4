<<<<<<< HEAD
import React, { useState } from "react";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import TermsAndConditions from "./pages/TermsAndConditions";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import "./EmployeeDashboard.css";
=======
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
>>>>>>> 3a63b32ff926c914cfea59231c84a6bea588066b



function App() {
<<<<<<< HEAD
  const [page, setPage] = useState("signup"); // login | signup | terms | dashboard
=======
>>>>>>> 3a63b32ff926c914cfea59231c84a6bea588066b

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-indigo-600 text-white p-4 flex justify-between">
        <h1 className="font-bold text-xl">ExpenseFlow</h1>
        <div className="space-x-4">
          <button onClick={() => setPage("login")} className="hover:underline">Login</button>
          <button onClick={() => setPage("signup")} className="hover:underline">Signup</button>
        </div>
      </nav>

      <div className="flex justify-center items-center mt-10">
        {page === "login" && <LoginPage onSwitch={() => setPage("signup")} />}
        {page === "signup" && (
          <SignupPage
            onSwitch={() => setPage("login")}
            onViewTerms={() => setPage("terms")}
          />
        )}
        {page === "terms" && <TermsAndConditions onBack={() => setPage("signup")} />}
        {page === "dashboard" && <EmployeeDashboard />}
      </div>
    </div>
  );
=======
    <>
    <LoginPage/>
    </>
  );
  
      <div className="App">
      <EmployeeDashboard />
    </div>
  )
>>>>>>> 3a63b32ff926c914cfea59231c84a6bea588066b
}

export default App;
