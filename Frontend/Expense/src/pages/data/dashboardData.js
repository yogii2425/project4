// src/data/dashboardData.js

const dashboardCards = [
  {
    id: 1,
    title: "User Management",
    description: "Add, edit, delete users and manage roles",
    icon: "👤",
    content: [
      "Add Employee / Manager",
      "Edit Role / Delete User",
      "Change Role (Employee ↔ Manager)",
      "Define Manager Relationships"
    ]
  },
  {
    id: 2,
    title: "Approval Workflow",
    description: "Set approval sequences and rules",
    icon: "✅",
    content: [
      "Set Approval Sequence",
      "Configure Conditional Rules (e.g., 60%, CFO approval)"
    ]
  },
  {
    id: 3,
    title: "Expense Management",
    description: "View, approve, reject expenses",
    icon: "💰",
    content: [
      "View All Expenses",
      "Approve / Reject Expense",
      "Expense Summary / Analytics"
    ]
  },
  {
    id: 4,
    title: "Company Settings",
    description: "Manage company preferences",
    icon: "⚙️",
    content: [
      "Currency, Departments",
      "Logout"
    ]
  },
  {
    id: 5,
    title: "Reports",
    icon: "📊"
  },
  {
    id: 6,
    title: "Analytics",
    icon: "📈"
  }
];

export default dashboardCards;
