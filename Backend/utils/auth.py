import os
import jwt
from functools import wraps
from flask import request, jsonify
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta

load_dotenv()
SECRET = os.getenv('SECRET_KEY', 'secret-for-dev')
JWT_EXP_SECONDS = int(os.getenv('JWT_EXP_SECONDS', '86400'))

def hash_password(raw):
    return generate_password_hash(raw)

def verify_password(hashed, raw):
    return check_password_hash(hashed, raw)

def create_access_token(payload):
    exp = datetime.utcnow() + timedelta(seconds=JWT_EXP_SECONDS)
    token = jwt.encode({**payload, 'exp': exp}, SECRET, algorithm='HS256')
    # pyjwt returns str in v2
    if isinstance(token, bytes):
        token = token.decode('utf-8')
    return token

def decode_token(token):
    try:
        data = jwt.decode(token, SECRET, algorithms=['HS256'])
        return data
    except jwt.ExpiredSignatureError:
        return None
    except Exception:
        return None

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization', None)
        if not auth_header:
            return jsonify({'message': 'Missing authorization header'}), 401
        parts = auth_header.split()
        if parts[0].lower() != 'bearer' or len(parts) != 2:
            return jsonify({'message': 'Invalid authorization header'}), 401
        token = parts[1]
        user_data = decode_token(token)
        if not user_data:
            return jsonify({'message': 'Invalid or expired token'}), 401
        # attach user_data to request context
        request.user = user_data
        return f(*args, **kwargs)
    return decorated

def role_required(required_roles):
    def wrapper(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            user = getattr(request, 'user', None)
            if not user or user.get('role') not in required_roles:
                return jsonify({'message': 'Forbidden: insufficient role'}), 403
            return f(*args, **kwargs)
        return decorated
    return wrapper
