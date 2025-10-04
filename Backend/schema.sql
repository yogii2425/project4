CREATE DATABASE IF NOT EXISTS expense_management;
USE expense_management;

-- Companies
CREATE TABLE IF NOT EXISTS companies (
    company_id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(150),
    country VARCHAR(100),
    currency_code VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT,
    name VARCHAR(100),
    email VARCHAR(150) UNIQUE,
    password VARCHAR(255),
    role ENUM('Admin','Manager','Employee') DEFAULT 'Employee',
    manager_id INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(company_id)
);

-- Categories (optional, frontend can manage categories too)
CREATE TABLE IF NOT EXISTS categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT,
    category_name VARCHAR(100),
    FOREIGN KEY (company_id) REFERENCES companies(company_id)
);

-- Expenses
CREATE TABLE IF NOT EXISTS expenses (
    expense_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    company_id INT,
    amount DECIMAL(12,2),
    currency VARCHAR(10),
    category VARCHAR(100),
    description TEXT,
    expense_date DATE,
    status ENUM('Pending','Approved','Rejected') DEFAULT 'Pending',
    approver_comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (company_id) REFERENCES companies(company_id)
);

-- Approvals (per-expense multi-level approvals)
CREATE TABLE IF NOT EXISTS approvals (
    approval_id INT AUTO_INCREMENT PRIMARY KEY,
    expense_id INT,
    approver_id INT,
    sequence_no INT,
    is_approved TINYINT NULL, -- NULL = pending, 1 = approved, 0 = rejected
    comments TEXT,
    decided_at TIMESTAMP NULL,
    FOREIGN KEY (expense_id) REFERENCES expenses(expense_id),
    FOREIGN KEY (approver_id) REFERENCES users(user_id)
);

-- Approval rules per company
CREATE TABLE IF NOT EXISTS approval_rules (
    rule_id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT,
    rule_type ENUM('Percentage','Specific','Hybrid') DEFAULT 'Percentage',
    percentage_threshold INT DEFAULT 100,
    specific_approver_id INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(company_id),
    FOREIGN KEY (specific_approver_id) REFERENCES users(user_id)
);
