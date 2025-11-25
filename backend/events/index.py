import json
import os
from datetime import datetime, date
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для управления событиями Хабаровска
    Args: event - dict с httpMethod, body, queryStringParameters
          context - объект с атрибутами request_id, function_name
    Returns: HTTP response с событиями
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database connection not configured'}),
            'isBase64Encoded': False
        }
    
    conn = None
    try:
        conn = psycopg2.connect(database_url)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            category = params.get('category')
            search = params.get('search')
            
            query = '''
                SELECT id, title, category, 
                       TO_CHAR(event_date, 'DD Mon') as date,
                       TO_CHAR(event_time, 'HH24:MI') as time,
                       location, price, image_url as image, 
                       description, lat, lng
                FROM events
                WHERE event_date >= CURRENT_DATE
            '''
            query_params = []
            
            if category and category != 'Все' and category != 'Избранное':
                query += ' AND category = %s'
                query_params.append(category)
            
            if search:
                query += ' AND (LOWER(title) LIKE %s OR LOWER(location) LIKE %s)'
                search_pattern = f'%{search.lower()}%'
                query_params.extend([search_pattern, search_pattern])
            
            query += ' ORDER BY event_date ASC, event_time ASC'
            
            if query_params:
                cur.execute(query, query_params)
            else:
                cur.execute(query)
            
            events = cur.fetchall()
            
            result = []
            for row in events:
                result.append({
                    'id': row['id'],
                    'title': row['title'],
                    'category': row['category'],
                    'date': row['date'],
                    'time': row['time'],
                    'location': row['location'],
                    'price': row['price'],
                    'image': row['image'],
                    'description': row['description'],
                    'lat': float(row['lat']),
                    'lng': float(row['lng']),
                    'isFavorite': False
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(result, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    finally:
        if conn:
            conn.close()
