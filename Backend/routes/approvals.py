from flask import Blueprint, request, jsonify, session
from db.connection import get_connection

approvals_bp = Blueprint('approvals', __name__)

# -----------------------------------
# GET ALL PENDING APPROVALS (Admin only)
# -----------------------------------
@approvals_bp.route('/approvals', methods=['GET'])
def get_pending_approvals():
    if 'admin_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    conn = get_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT a.id AS approval_id, e.id AS expense_id, u.full_name, e.title, e.amount, e.category, e.status
        FROM approvals a
        JOIN expenses e ON a.expense_id = e.id
        JOIN users u ON e.user_id = u.id
        WHERE a.status = 'Pending'
        ORDER BY e.date DESC
    """)
    approvals = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify(approvals), 200


# -----------------------------------
# APPROVE OR REJECT EXPENSE
# -----------------------------------
@approvals_bp.route('/approvals/<int:approval_id>', methods=['PUT'])
def update_approval(approval_id):
    if 'admin_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    data = request.get_json()
    status = data.get('status')  # 'Approved' or 'Rejected'

    if status not in ['Approved', 'Rejected']:
        return jsonify({'error': 'Invalid status'}), 400

    conn = get_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    cursor = conn.cursor()

    # Update the approval record
    cursor.execute("""
        UPDATE approvals 
        SET status=%s, approved_by=%s, approved_at=NOW()
        WHERE id=%s
    """, (status, session['admin_id'], approval_id))

    # Update the related expense status
    cursor.execute("""
        UPDATE expenses e
        JOIN approvals a ON e.id = a.expense_id
        SET e.status = %s
        WHERE a.id = %s
    """, (status, approval_id))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({'message': f'Expense {status.lower()} successfully'}), 200
