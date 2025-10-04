from flask import Blueprint, request, jsonify
from db.connection import get_db_connection
from utils.auth import token_required, role_required

admin_bp = Blueprint('admin_bp', __name__)

@admin_bp.route('/rules', methods=['POST'])
@token_required
@role_required(['Admin'])
def create_rule():
    """
    Create or update approval rule for company
    Body: { rule_type: 'Percentage'|'Specific'|'Hybrid', percentage_threshold, specific_approver_id }
    """
    user = request.user
    data = request.json
    rule_type = data.get('rule_type', 'Percentage')
    pct = data.get('percentage_threshold', 100)
    spec = data.get('specific_approver_id')

    conn = get_db_connection()
    cursor = conn.cursor()
    # upsert: if exists update else insert
    cursor.execute("SELECT * FROM approval_rules WHERE company_id=%s", (user['company_id'],))
    exists = cursor.fetchone()
    if exists:
        cursor.execute("""
            UPDATE approval_rules SET rule_type=%s, percentage_threshold=%s, specific_approver_id=%s WHERE company_id=%s
        """, (rule_type, pct, spec, user['company_id']))
    else:
        cursor.execute("""
            INSERT INTO approval_rules (company_id, rule_type, percentage_threshold, specific_approver_id)
            VALUES (%s, %s, %s, %s)
        """, (user['company_id'], rule_type, pct, spec))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message':'Rule saved'})

@admin_bp.route('/approvals/assign', methods=['POST'])
@token_required
@role_required(['Admin'])
def assign_approvers():
    """
    Create explicit approvals for existing expense.
    Body: { expense_id: int, approver_ids: [id1, id2, ...] }
    """
    data = request.json
    expense_id = data.get('expense_id')
    approver_ids = data.get('approver_ids', [])
    if not expense_id or not approver_ids:
        return jsonify({'message':'expense_id and approver_ids required'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    # delete existing approvals for expense if any (careful: you may prefer to keep history)
    cursor.execute("DELETE FROM approvals WHERE expense_id=%s", (expense_id,))
    for idx, aid in enumerate(approver_ids):
        cursor.execute("INSERT INTO approvals (expense_id, approver_id, sequence_no) VALUES (%s,%s,%s)",
                       (expense_id, aid, idx+1))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message':'Approvers assigned'})
