import os
from dotenv import load_dotenv
import mysql.connector

load_dotenv()

DB_CONFIG = {
    'host': os.getenv('DB_HOST', '127.0.0.1'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'database': os.getenv('DB_NAME', 'expense_management'),
    'auth_plugin': 'mysql_native_password'
}

def get_db_connection():
    conn = mysql.connector.connect(**DB_CONFIG)
    return conn
