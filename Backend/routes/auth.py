from flask import Blueprint, request, jsonify
from db.connection import get_db_connection
from utils.auth import hash_password, verify_password, create_access_token
import mysql.connector

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """
    If company_name provided and company does not exist -> create company and set user as Admin
    JSON expected: { name, email, password, company_name (optional), role (optional), manager_id (optional), company_id (optional) }
    """
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    company_name = data.get('company_name')
    role = data.get('role', 'Employee')
    manager_id = data.get('manager_id')

    if not (name and email and password):
        return jsonify({'message':'name,email,password required'}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # If company_name provided -> create company and set this user as Admin
    company_id = data.get('company_id')
    if company_name and not company_id:
        cursor.execute("INSERT INTO companies (company_name, country, currency_code) VALUES (%s, %s, %s)",
                       (company_name, data.get('country', ''), data.get('currency_code', '')))
        conn.commit()
        company_id = cursor.lastrowid

    try:
        hashed = hash_password(password)
        cursor.execute("""
            INSERT INTO users (company_id, name, email, password, role, manager_id)
            VALUES (%s,%s,%s,%s,%s,%s)
        """, (company_id, name, email, hashed, role, manager_id))
        conn.commit()
        user_id = cursor.lastrowid
        cursor.close()
        conn.close()

        token = create_access_token({'user_id': user_id, 'email': email, 'role': role, 'company_id': company_id})
        return jsonify({'message':'User registered','token': token, 'user_id': user_id})
    except mysql.connector.errors.IntegrityError:
        cursor.close()
        conn.close()
        return jsonify({'message':'Email already exists'}), 400
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    if not (email and password):
        return jsonify({'message':'email and password required'}), 400

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    if not user:
        return jsonify({'message':'Invalid credentials'}), 401

    if not verify_password(user['password'], password):
        return jsonify({'message':'Invalid credentials'}), 401

    token = create_access_token({'user_id': user['user_id'], 'email': user['email'], 'role': user['role'], 'company_id': user['company_id']})
    # remove hashed password from response
    user.pop('password', None)
    return jsonify({'message':'Login successful', 'token': token, 'user': user})
