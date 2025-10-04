from flask import Blueprint, request, jsonify
from db.connection import get_db_connection
from utils.auth import token_required
from datetime import datetime

approvals_bp = Blueprint('approvals_bp', __name__)

@approvals_bp.route('/approvals/pending', methods=['GET'])
@token_required
def pending_approvals():
    user = request.user
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT a.*, e.user_id as expense_owner, e.amount, e.currency, e.category, e.description, e.expense_id
        FROM approvals a
        JOIN expenses e ON a.expense_id = e.expense_id
        WHERE a.approver_id = %s AND a.is_approved IS NULL
        ORDER BY a.sequence_no ASC
    """, (user['user_id'],))
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(rows)

@approvals_bp.route('/approvals/<int:approval_id>/decide', methods=['POST'])
@token_required
def decide(approval_id):
    """
    Body: { action: 'approve' or 'reject', comments: '...' }
    Sequence enforcement: current approver can only decide if all previous sequences are decided (no pending earlier sequences).
    After each decision evaluate approval_rules for the expense and update expense status if rules met.
    """
    user = request.user
    data = request.json
    action = data.get('action')
    comments = data.get('comments', '')

    if action not in ['approve', 'reject']:
        return jsonify({'message':'action must be approve or reject'}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # get approval row
    cursor.execute("SELECT * FROM approvals WHERE approval_id=%s", (approval_id,))
    row = cursor.fetchone()
    if not row:
        cursor.close()
        conn.close()
        return jsonify({'message':'approval not found'}), 404

    if row['approver_id'] != user['user_id']:
        cursor.close()
        conn.close()
        return jsonify({'message':'Forbidden: not the approver for this item'}), 403

    # ensure earlier sequence decisions are done
    cursor.execute("""
        SELECT COUNT(*) as cnt FROM approvals
        WHERE expense_id=%s AND sequence_no < %s AND is_approved IS NULL
    """, (row['expense_id'], row['sequence_no']))
    pending_before = cursor.fetchone()['cnt']
    if pending_before > 0:
        cursor.close()
        conn.close()
        return jsonify({'message':'Previous approver(s) must decide first'}), 400

    is_approved = 1 if action == 'approve' else 0
    now = datetime.utcnow()

    cursor.execute("""
        UPDATE approvals SET is_approved=%s, comments=%s, decided_at=%s WHERE approval_id=%s
    """, (is_approved, comments, now, approval_id))
    conn.commit()

    # Evaluate the overall approval based on company's rule
    # 1) fetch all approvals for expense
    cursor.execute("SELECT * FROM approvals WHERE expense_id=%s", (row['expense_id'],))
    approvals = cursor.fetchall()

    total = len(approvals)
    approved_cnt = len([a for a in approvals if a['is_approved'] == 1])
    rejected_cnt = len([a for a in approvals if a['is_approved'] == 0])
    pending_cnt = len([a for a in approvals if a['is_approved'] is None])

    # 2) fetch rule for company
    cursor.execute("""
        SELECT ar.* FROM approval_rules ar
        JOIN expenses e ON e.company_id = ar.company_id
        WHERE e.expense_id=%s LIMIT 1
    """, (row['expense_id'],))
    rule = cursor.fetchone()

    expense_status = None
    # Default: if any rejection -> mark Rejected (you can change to require all approvers)
    if rejected_cnt > 0:
        expense_status = 'Rejected'
    else:
        if not rule:
            # default behavior: all approvers must approve
            if pending_cnt == 0 and approved_cnt == total:
                expense_status = 'Approved'
        else:
            rtype = rule['rule_type']
            if rtype == 'Percentage':
                pct = (approved_cnt / total) * 100 if total > 0 else 0
                if pct >= rule['percentage_threshold']:
                    expense_status = 'Approved'
            elif rtype == 'Specific':
                # if specific approver approved, auto-approve
                spec = rule['specific_approver_id']
                if spec:
                    for a in approvals:
                        if a['approver_id'] == spec and a['is_approved'] == 1:
                            expense_status = 'Approved'
                            break
                    # if pending and not yet decided - don't auto-approve
                # else fallback to default all approve
                if not expense_status and pending_cnt == 0 and approved_cnt == total:
                    expense_status = 'Approved'
            elif rtype == 'Hybrid':
                pct = (approved_cnt / total) * 100 if total>0 else 0
                spec = rule.get('specific_approver_id')
                spec_approved = any(a['approver_id'] == spec and a['is_approved'] == 1 for a in approvals) if spec else False
                if pct >= rule['percentage_threshold'] or spec_approved:
                    expense_status = 'Approved'
                elif pending_cnt == 0 and approved_cnt == total:
                    expense_status = 'Approved'

    # Update expense status if decided
    if expense_status:
        cursor.execute("UPDATE expenses SET status=%s WHERE expense_id=%s", (expense_status, row['expense_id']))
        conn.commit()

    cursor.close()
    conn.close()
    return jsonify({'message': f'Approval {action} recorded', 'expense_status': expense_status})
