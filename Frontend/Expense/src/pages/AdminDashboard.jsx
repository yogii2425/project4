import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const sections = [
  {
    title: "User Management",
    description: "Manage employees, roles, and relationships",
    icon: "👥",
    content: [
      "➕ Add Employee / Manager",
      "✏️ Edit Role / Delete User",
      "🔁 Change Role (Employee ↔ Manager)",
      "🔗 Define Manager Relationships",
    ],
  },
  {
    title: "Approval Workflow",
    description: "Set approval sequences and conditional rules",
    icon: "⚙️",
    content: [
      "⚙️ Set Approval Sequence",
      "🧮 Configure Conditional Rules (60%, CFO approval, etc.)",
    ],
  },
  {
    title: "Expense Management",
    description: "Monitor and control expense approvals",
    icon: "💸",
    content: [
      "📋 View All Expenses",
      "🧾 Approve / Reject Expense (Override)",
      "📊 Expense Summary / Analytics",
    ],
  },
  {
    title: "Others",
    description: "Company configuration and logout",
    icon: "🏢",
    content: [
      "🧱 Company Settings (Currency, Departments)",
      "🔐 Logout",
    ],
  },
];

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-gray-200 p-6">
      {/* Top Bar */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="text-right">
          <p className="font-semibold text-gray-700">Welcome, Admin 👋</p>
          <p className="text-sm text-gray-500">Company: Acme Corp</p>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            onClick={() => setActiveSection(section)}
            className="cursor-pointer"
          >
            <div className="rounded-2xl shadow-lg bg-white p-6 hover:shadow-xl transition-all">
              <div className="flex flex-col items-start space-y-2">
                <span className="text-4xl">{section.icon}</span>
                <h2 className="text-xl font-semibold text-gray-800">
                  {section.title}
                </h2>
                <p className="text-sm text-gray-500">{section.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal / Expanded View */}
      <AnimatePresence>
        {activeSection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-8 w-11/12 md:w-2/3 lg:w-1/2"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <span>{activeSection.icon}</span> {activeSection.title}
                </h2>
                <button
                  className="text-gray-600 hover:text-gray-800 text-xl font-bold"
                  onClick={() => setActiveSection(null)}
                >
                  ✖
                </button>
              </div>
              <div className="space-y-3">
                {activeSection.content.map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    className="p-3 bg-gray-50 rounded-lg shadow-sm text-gray-700 text-base flex items-center gap-2"
                  >
                    {item}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
