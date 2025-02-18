import mysql.connector
import json
import pandas as pd

# Establish the connection
def get_db_connection():
    conn = mysql.connector.connect(
        host="localhost",
        port=3306,
        user="root",
        password="Auraiya12",
        database="jee_predictor"
    )
    return conn

# Fetch the data from 'jee_final_cleaned' table
def fetch_colleges(conn):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM jee_final_cleaned")
    rows = cursor.fetchall()
    cursor.close() 
    return rows

# Filter colleges based on the closing rank
def filter_colleges_by_rank(input_rank):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(f"""
        SELECT Institute, `Academic Program Name`, `Closing Rank`
        FROM jee_final_cleaned
        WHERE `Closing Rank` >= {input_rank}
    """)
    colleges_within_range = cursor.fetchall()
    cursor.close()
    conn.close()
    return colleges_within_range

if __name__ == '__main__':
    import sys
    rank = int(sys.argv[1])  # Read rank from command line argument
    colleges_within_range = filter_colleges_by_rank(rank)
    
    # Convert to dictionary format for JSON output
    colleges = [{"Institute": college[0], "Academic Program Name": college[1]} for college in colleges_within_range]
    
    # Print as JSON
    print(json.dumps(colleges))
