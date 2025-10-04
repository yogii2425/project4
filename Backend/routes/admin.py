from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from db.connection import get_connection

admin_bp = Blueprint('admin', __name__)

# -----------------------------------
# ADMIN SIGNUP (Optional - only for setup)
# -----------------------------------
@admin_bp.route('/admin/signup', methods=['POST'])
def admin_signup():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400

    hashed_password = generate_password_hash(password)

    conn = get_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO admin (username, password) VALUES (%s, %s)",
            (username, hashed_password)
        )
        conn.commit()
        return jsonify({'message': 'Admin account created successfully'}), 201
    except Exception as e:
        print(e)
        return jsonify({'error': 'Admin already exists or invalid data'}), 400
    finally:
        cursor.close()
        conn.close()


# -----------------------------------
# ADMIN LOGIN
# -----------------------------------
@admin_bp.route('/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400

    conn = get_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM admin WHERE username = %s", (username,))
    admin = cursor.fetchone()
    cursor.close()
    conn.close()

    if admin and check_password_hash(admin['password'], password):
        session['admin_id'] = admin['id']
        return jsonify({'message': 'Admin login successful'}), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401


# -----------------------------------
# ADMIN LOGOUT
# -----------------------------------
@admin_bp.route('/admin/logout', methods=['POST'])
def admin_logout():
    session.pop('admin_id', None)
    return jsonify({'message': 'Admin logged out successfully'}), 200
