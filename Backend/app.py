from flask import Flask, jsonify
from flask_cors import CORS

# Import all blueprints (routes)
from routes.auth import auth_bp
from routes.expenses import expenses_bp
from routes.approvals import approvals_bp
from routes.admin import admin_bp

# ------------------------------------------------
# Initialize Flask App
# ------------------------------------------------
app = Flask(__name__)

# Secret key for session management (important for login/logout)
app.secret_key = "super_secret_key_123"  # change this before production

# Enable CORS (allow frontend to access backend)
CORS(app)

# ------------------------------------------------
# Register Blueprints (API Modules)
# ------------------------------------------------
app.register_blueprint(auth_bp)
app.register_blueprint(expenses_bp)
app.register_blueprint(approvals_bp)
app.register_blueprint(admin_bp)

# ------------------------------------------------
# Default Route (For Testing)
# ------------------------------------------------
@app.route('/')
def home():
    return jsonify({
        "message": "✅ Expense Management Backend is running successfully!",
        "status": "success"
    }), 200

# ------------------------------------------------
# Run Flask Server
# ------------------------------------------------
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
