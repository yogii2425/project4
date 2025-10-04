from flask import Blueprint, request, jsonify
from db.connection import get_db_connection
from utils.auth import token_required
import mysql.connector
from datetime import datetime

expense_bp = Blueprint('expense_bp', __name__)

@expense_bp.route('/add_expense', methods=['POST'])
@token_required
def add_expense():
    """
    JSON: { amount, currency, category, description, expense_date (YYYY-MM-DD), approver_ids (optional list) }
    If approver_ids provided -> create approvals from that list in given order.
    If not provided and user has manager_id -> create single approval entry for manager.
    """
    user = request.user
    data = request.json
    amount = data.get('amount')
    currency = data.get('currency', 'INR')
    category = data.get('category', 'General')
    description = data.get('description', '')
    expense_date = data.get('expense_date', datetime.utcnow().date().isoformat())

    if amount is None:
        return jsonify({'message':'amount required'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO expenses (user_id, company_id, amount, currency, category, description, expense_date)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, (user['user_id'], user['company_id'], amount, currency, category, description, expense_date))
    conn.commit()
    expense_id = cursor.lastrowid

    # create approvals
    approver_ids = data.get('approver_ids')
    if approver_ids and isinstance(approver_ids, list) and len(approver_ids) > 0:
        for idx, aid in enumerate(approver_ids):
            cursor.execute("""
                INSERT INTO approvals (expense_id, approver_id, sequence_no)
                VALUES (%s, %s, %s)
            """, (expense_id, aid, idx + 1))
        conn.commit()
    else:
        # fallback: add manager as approver if exists
        cursor.execute("SELECT manager_id FROM users WHERE user_id=%s", (user['user_id'],))
        row = cursor.fetchone()
        if row and row[0]:
            cursor.execute("""
                INSERT INTO approvals (expense_id, approver_id, sequence_no)
                VALUES (%s, %s, %s)
            """, (expense_id, row[0], 1))
            conn.commit()

    cursor.close()
    conn.close()
    return jsonify({'message':'Expense created', 'expense_id': expense_id})

@expense_bp.route('/expenses', methods=['GET'])
@token_required
def list_expenses():
    """
    Returns expenses based on role:
     - Admin: all company expenses
     - Manager: expenses of their team (users who have manager_id == manager's id) and expenses they must approve
     - Employee: own expenses
    """
    user = request.user
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    if user['role'] == 'Admin':
        cursor.execute("SELECT * FROM expenses WHERE company_id=%s ORDER BY created_at DESC", (user['company_id'],))
    elif user['role'] == 'Manager':
        # expenses of team members
        cursor.execute("""
            SELECT e.* FROM expenses e
            JOIN users u ON e.user_id = u.user_id
            WHERE e.company_id=%s AND u.manager_id=%s
            ORDER BY e.created_at DESC
        """, (user['company_id'], user['user_id']))
    else:
        cursor.execute("SELECT * FROM expenses WHERE user_id=%s ORDER BY created_at DESC", (user['user_id'],))

    expenses = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(expenses)

@expense_bp.route('/expense/<int:expense_id>', methods=['GET'])
@token_required
def get_expense(expense_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM expenses WHERE expense_id=%s", (expense_id,))
    expense = cursor.fetchone()
    cursor.close()
    conn.close()
    if not expense:
        return jsonify({'message':'Not found'}), 404
    return jsonify(expense)

@expense_bp.route('/summary/<int:user_id>', methods=['GET'])
@token_required
def summary(user_id):
    """
    Return total spent per category for the given user (or admin can pass any user)
    """
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT category, SUM(amount) as total
        FROM expenses
        WHERE user_id=%s
        GROUP BY category
    """, (user_id,))
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(rows)
