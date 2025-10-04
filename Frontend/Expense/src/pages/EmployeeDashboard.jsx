import React, { useState, useEffect, useMemo } from 'react';
import '../index.css';           // Global styles
import '../EmployeeDashboard.css'; // Custom dashboard styles

// --- Mock Data ---
const initialExpenses = [
  { id: 1, description: 'Client Lunch at The Grand Hotel', category: 'Food', amount: 3500, currency: 'INR', date: '2025-10-02', status: 'Approved' },
  { id: 2, description: 'Taxi from Airport to Office', category: 'Travel', amount: 850, currency: 'INR', date: '2025-10-01', status: 'Approved' },
  { id: 3, description: 'Software Subscription (Adobe)', category: 'Software', amount: 1800, currency: 'INR', date: '2025-09-28', status: 'Rejected' },
  { id: 4, description: 'Office Stationery', category: 'Supplies', amount: 1200, currency: 'INR', date: '2025-10-03', status: 'Pending' },
  { id: 5, description: 'Team Dinner', category: 'Food', amount: 7200, currency: 'INR', date: '2025-09-25', status: 'Approved' },
];

// --- Helper Icons ---
const AddIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const EmployeeDashboard = () => {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [filteredExpenses, setFilteredExpenses] = useState(initialExpenses);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: '',
    category: 'Travel',
    amount: '',
    currency: 'INR',
    date: new Date().toISOString().slice(0, 10)
  });
  const [receiptFile, setReceiptFile] = useState(null);

  // Filter expenses
  useEffect(() => {
    const results = expenses.filter(expense =>
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredExpenses(results);
  }, [searchTerm, expenses]);

  // Summary data
  const summaryData = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const monthlyTotal = expenses
      .filter(e => new Date(e.date).getMonth() === currentMonth && e.status === 'Approved')
      .reduce((sum, e) => sum + e.amount, 0);
    
    const pendingCount = expenses.filter(e => e.status === 'Pending').length;
    return { monthlyTotal, pendingCount };
  }, [expenses]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReceiptFile(file);
      alert(`Receipt "${file.name}" uploaded. (OCR not implemented yet)`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newExpense.description || !newExpense.amount || !newExpense.date) {
      alert('Please fill all required fields.');
      return;
    }
    const expenseToAdd = {
      id: Date.now(),
      ...newExpense,
      amount: parseFloat(newExpense.amount),
      status: 'Pending'
    };
    setExpenses([expenseToAdd, ...expenses]);
    setShowForm(false);
    setNewExpense({ description: '', category: 'Travel', amount: '', currency: 'INR', date: new Date().toISOString().slice(0, 10) });
    setReceiptFile(null);
  };

  const StatusBadge = ({ status }) => (
    <span className={`status-badge status-${status.toLowerCase()}`}>{status}</span>
  );

  return (
    <div className="dashboard-container animate-fadeIn">
      <header className="dashboard-header animate-slideDown">
        <h1>Employee Dashboard</h1>
        <button className="logout-btn" onClick={() => alert('Logged out!')}>
          <LogoutIcon /> Logout
        </button>
      </header>

      {/* Summary */}
      <section className="summary-section">
        <div className="summary-card">
          <h2>₹{summaryData.monthlyTotal.toLocaleString('en-IN')}</h2>
          <p>Approved this month (Oct 2025)</p>
        </div>
        <div className="summary-card">
          <h2>{summaryData.pendingCount}</h2>
          <p>Pending Expenses</p>
        </div>
      </section>

      {/* Actions */}
      <section className="actions-section">
        <button className="add-expense-btn" onClick={() => setShowForm(true)}>
          <AddIcon /> Add New Expense
        </button>
        <input
          type="text"
          placeholder="🔍 Search by description or category..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </section>

      {/* Add Expense Form */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Submit New Expense</h2>
            <form onSubmit={handleSubmit}>
              <label>Description</label>
              <input type="text" name="description" value={newExpense.description} onChange={handleInputChange} required />

              <label>Category</label>
              <select name="category" value={newExpense.category} onChange={handleInputChange}>
                <option>Travel</option>
                <option>Food</option>
                <option>Software</option>
                <option>Supplies</option>
                <option>Other</option>
              </select>

              <div className="form-row">
                <div>
                  <label>Amount</label>
                  <input type="number" name="amount" value={newExpense.amount} onChange={handleInputChange} required />
                </div>
                <div>
                  <label>Currency</label>
                  <input type="text" name="currency" value={newExpense.currency} onChange={handleInputChange} />
                </div>
                <div>
                  <label>Date</label>
                  <input type="date" name="date" value={newExpense.date} onChange={handleInputChange} required />
                </div>
              </div>

              <label htmlFor="receipt-upload" className="receipt-upload-label">
                <CameraIcon /> {receiptFile ? receiptFile.name : 'Upload Receipt (OCR Scan)'}
              </label>
              <input id="receipt-upload" type="file" onChange={handleFileChange} accept="image/*,.pdf" />

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn-submit">Submit for Approval</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expense History */}
      <section className="expense-history">
        <h2>My Expense History</h2>
        <div className="expense-list">
          {filteredExpenses.map(expense => (
            <div className="expense-item" key={expense.id}>
              <div className="expense-details">
                <p className="expense-desc">{expense.description}</p>
                <p className="expense-meta">{expense.category} • {new Date(expense.date).toLocaleDateString('en-GB')}</p>
              </div>
              <div className="expense-financials">
                <p className="expense-amount">₹{expense.amount.toLocaleString('en-IN')}</p>
                <StatusBadge status={expense.status} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default EmployeeDashboard;
