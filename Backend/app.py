from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

# Blueprints
from routes.auth import auth_bp
from routes.expenses import expense_bp
from routes.approvals import approvals_bp
from routes.admin import admin_bp

app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(expense_bp, url_prefix='/api')
app.register_blueprint(approvals_bp, url_prefix='/api')
app.register_blueprint(admin_bp, url_prefix='/api')

@app.route('/')
def home():
    return "Expense Manager Backend (Flask) is running."

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
