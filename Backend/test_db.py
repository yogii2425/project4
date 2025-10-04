from db.connection import get_connection

conn = get_connection()
if conn:
    cursor = conn.cursor()
    cursor.execute("SELECT DATABASE();")
    db_name = cursor.fetchone()
    print(f"Connected to database: {db_name[0]}")
    conn.close()
