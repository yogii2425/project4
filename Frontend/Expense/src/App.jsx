import React, { useState, useEffect } from 'react';
import './App.css';

// --- Reusable Modal Component ---
const Modal = ({ children, onClose }) => (
    <div className="modal-backdrop">
        <div className="modal-content">
            <button className="modal-close" onClick={onClose}>×</button>
            {children}
        </div>
    </div>
);

// --- Dashboard Overview Card (My Idea) ---
const DashboardOverview = () => (
    <div className="card overview-card">
        <h2>Dashboard Overview</h2>
        <div className="metrics">
            <div className="metric-item">
                <span className="metric-value">12</span>
                <span className="metric-label">Pending Approvals</span>
            </div>
            <div className="metric-item">
                <span className="metric-value">$15,430</span>
                <span className="metric-label">Expenses This Month</span>
            </div>
            <div className="metric-item">
                <span className="metric-value">47</span>
                <span className="metric-label">Active Users</span>
            </div>
        </div>
    </div>
);

// --- User Management Card ---
const UserManagement = () => {
    const [users, setUsers] = useState([
        { id: 1, name: 'Alice Smith', role: 'Manager', manager: null },
        { id: 2, name: 'Bob Johnson', role: 'Employee', manager: 'Alice Smith' },
        { id: 3, name: 'Charlie Brown', role: 'Employee', manager: 'Alice Smith' },
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDeleteUser = (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            setUsers(users.filter(user => user.id !== userId));
        }
    };

    return (
        <div className="card">
            <h2>User Management</h2>
            <button onClick={() => setIsModalOpen(true)}>+ Add User</button>
            {isModalOpen && <Modal onClose={() => setIsModalOpen(false)}><h3>Add New User Form</h3><p>Form fields for name, email, role, etc. would go here.</p></Modal>}
            <table className="data-table">
                <thead>
                    <tr><th>Name</th><th>Role</th><th>Actions</th></tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.role}</td>
                            <td>
                                <button className="action-button edit">Edit</button>
                                <button className="action-button delete" onClick={() => handleDeleteUser(user.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// --- Approval Workflow Card ---
const ApprovalWorkflow = () => (
    <div className="card">
        <h2>Approval Workflow</h2>
        <div className="section">
            <h4>Approval Sequence</h4>
            <ol className="sequence-list">
                <li>Direct Manager</li>
                <li>Department Head</li>
                <li>Finance Team</li>
            </ol>
        </div>
        <div className="section">
            <h4>Conditional Rules</h4>
            <ul className="rules-list">
                <li><strong>IF</strong> Amount > $5,000 <strong>ADD</strong> CFO</li>
                <li><strong>IF</strong> Department is 'IT' <strong>ADD</strong> CTO</li>
            </ul>
        </div>
    </div>
);

// --- Expense Management Card ---
const ExpenseManagement = () => {
    const [expenses, setExpenses] = useState([]);
    useEffect(() => {
        setExpenses([
            { id: 101, employee: 'Bob Johnson', amount: 350, status: 'Pending' },
            { id: 102, employee: 'Alice Smith', amount: 6200, status: 'Pending' },
            { id: 103, employee: 'Charlie Brown', amount: 120, status: 'Approved' },
        ]);
    }, []);

    const handleApproval = (expenseId, newStatus) => {
        setExpenses(expenses.map(exp => exp.id === expenseId ? { ...exp, status: newStatus } : exp));
    };

    return (
        <div className="card">
            <h2>Expense Management</h2>
            <table className="data-table">
                <thead>
                    <tr><th>Employee</th><th>Amount</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                    {expenses.map(exp => (
                        <tr key={exp.id}>
                            <td>{exp.employee}</td>
                            <td>${exp.amount.toLocaleString()}</td>
                            <td><span className={`status-pill ${exp.status.toLowerCase()}`}>{exp.status}</span></td>
                            <td>
                                {exp.status === 'Pending' && (
                                    <>
                                        <button className="action-button approve" onClick={() => handleApproval(exp.id, 'Approved')}>✓</button>
                                        <button className="action-button reject" onClick={() => handleApproval(exp.id, 'Rejected')}>×</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// --- Company Settings Card ---
const CompanySettings = () => (
     <div className="card">
        <h2>Company Settings</h2>
        <form className="settings-form">
            <label>Default Currency:</label>
            <select defaultValue="USD">
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
            </select>
            <label>Manage Departments:</label>
            <input type="text" defaultValue="Engineering, Sales, Marketing" />
            <button type="button" className="save-button">Save Settings</button>
        </form>
    </div>
);


// --- Main App Component (Dashboard) ---
function App() {
    const handleLogout = () => {
        alert('You have been logged out!');
        // In a real app, you would clear auth tokens and redirect.
    };

    return (
        <div className="app-container">
            <header className="dashboard-header">
                <h1>Admin Dashboard 🚀</h1>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </header>
            <main className="dashboard-grid">
                <DashboardOverview />
                <UserManagement />
                <ExpenseManagement />
                <ApprovalWorkflow />
                <CompanySettings />
            </main>
        </div>
    );
}

export default App;