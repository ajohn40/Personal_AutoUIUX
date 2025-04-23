import sqlite3

DB_FILE = 'wiki.db'

def init_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('CREATE TABLE pages (title TEXT PRIMARY KEY, content TEXT)')
    c.execute('INSERT INTO pages VALUES (?, ?)', ('Home', 'Welcome to your mini Wikipedia!'))
    conn.commit()
    conn.close()

def get_page(title):
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('SELECT content FROM pages WHERE title = ?', (title,))
    row = c.fetchone()
    conn.close()
    return row[0] if row else None

def save_page(title, content):
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('REPLACE INTO pages (title, content) VALUES (?, ?)', (title, content))
    conn.commit()
    conn.close()

