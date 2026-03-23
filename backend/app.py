from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
import json
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Конфигурация БД из переменных окружения
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'database': os.getenv('DB_NAME', 'medical_trainer'),
    'user': os.getenv('DB_USER', 'postgres'),
    'password': os.getenv('DB_PASSWORD', 'postgres'),
    'port': os.getenv('DB_PORT', 5432)
}

def get_db_connection():
    """Получение подключения к PostgreSQL"""
    return psycopg2.connect(**DB_CONFIG)

@app.route('/api/execute', methods=['POST'])
def execute_query():
    """Выполнение SQL запроса"""
    data = request.json
    query = data.get('query', '')
    
    # Блокировка опасных запросов
    dangerous_keywords = ['DROP', 'DELETE', 'UPDATE', 'INSERT', 'ALTER', 'TRUNCATE', 'CREATE']
    query_upper = query.upper()
    
    for keyword in dangerous_keywords:
        if keyword in query_upper and keyword not in ['SELECT']:
            return jsonify({'error': 'В демо-режиме разрешены только SELECT запросы'}), 400
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute(query)
        
        # Для SELECT запросов
        if query_upper.strip().startswith('SELECT'):
            results = cursor.fetchall()
            row_count = len(results)
        else:
            results = []
            row_count = cursor.rowcount
        
        cursor.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'data': results,
            'row_count': row_count
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/schema', methods=['GET'])
def get_schema():
    """Получение информации о схеме базы данных"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Получение списка таблиц
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name;
        """)
        tables = cursor.fetchall()
        
        schema_info = {}
        for table in tables:
            table_name = table[0]
            # Получение информации о колонках
            cursor.execute("""
                SELECT column_name, data_type, is_nullable
                FROM information_schema.columns
                WHERE table_name = %s
                ORDER BY ordinal_position;
            """, (table_name,))
            columns = cursor.fetchall()
            schema_info[table_name] = columns
        
        cursor.close()
        conn.close()
        
        return jsonify(schema_info)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/exercises', methods=['GET'])
def get_exercises():
    """Получение списка упражнений по категориям"""
    
    json_path = os.path.join(os.path.dirname(__file__), 'database', 'exercises.json')
    
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            exercises = json.load(f)
        return jsonify(exercises)
    except FileNotFoundError:
        # Если файл не найден, вернуть базовый набор
        return jsonify([
            {
                "id": 1,
                "category": "select",
                "category_name": "Базовые запросы",
                "title": "Все пациенты",
                "description": "Выведите список всех пациентов",
                "solution": "SELECT * FROM patients;",
                "difficulty": "beginner"
            }
        ])

@app.route('/api/health', methods=['GET'])
def health_check():
    """Проверка подключения к БД"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        cursor.close()
        conn.close()
        return jsonify({'status': 'healthy', 'database': 'connected'})
    except Exception as e:
        return jsonify({'status': 'unhealthy', 'database': 'disconnected', 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)