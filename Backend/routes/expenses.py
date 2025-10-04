from flask import Blueprint, request, jsonify, session
from db.connection import get_connection

expenses_bp = Blueprint('expenses', __name__)

# -----------------------------------
# GET ALL EXPENSES (for logged-in user)
# -----------------------------------
@expenses_bp.route('/expenses', methods=['GET'])
def get_expenses():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    conn = get_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM expenses WHERE user_id = %s ORDER BY date DESC", (session['user_id'],))
    expenses = cursor.fetchall()

    cursor.close()
    conn.close()
    return jsonify(expenses), 200


# -----------------------------------
# ADD NEW EXPENSE
# -----------------------------------
@expenses_bp.route('/expenses', methods=['POST'])
def add_expense():
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    data = request.get_json()
    title = data.get('title')
    amount = data.get('amount')
    category = data.get('category')
    date = data.get('date')

    if not all([title, amount, date]):
        return jsonify({'error': 'Title, amount, and date are required'}), 400

    conn = get_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO expenses (user_id, title, amount, category, date) VALUES (%s, %s, %s, %s, %s)",
        (session['user_id'], title, amount, category, date)
    )
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({'message': 'Expense added successfully'}), 201


# -----------------------------------
# UPDATE EXPENSE
# -----------------------------------
@expenses_bp.route('/expenses/<int:expense_id>', methods=['PUT'])
def update_expense(expense_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    data = request.get_json()
    title = data.get('title')
    amount = data.get('amount')
    category = data.get('category')
    date = data.get('date')
    status = data.get('status', 'Pending')

    conn = get_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    cursor = conn.cursor()
    cursor.execute("""
        UPDATE expenses 
        SET title=%s, amount=%s, category=%s, date=%s, status=%s 
        WHERE id=%s AND user_id=%s
    """, (title, amount, category, date, status, expense_id, session['user_id']))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({'message': 'Expense updated successfully'}), 200


# -----------------------------------
# DELETE EXPENSE
# -----------------------------------
@expenses_bp.route('/expenses/<int:expense_id>', methods=['DELETE'])
def delete_expense(expense_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    conn = get_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    cursor = conn.cursor()
    cursor.execute("DELETE FROM expenses WHERE id=%s AND user_id=%s", (expense_id, session['user_id']))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({'message': 'Expense deleted successfully'}), 200
