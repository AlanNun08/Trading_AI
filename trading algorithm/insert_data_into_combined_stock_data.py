# 1 Database and 4 tables
import sqlite3
def create_new_database():

    # Connect to the new SQLite database (it will be created if it doesn't exist)
    conn = sqlite3.connect('stock_data.db')
    cursor = conn.cursor()

    # Create a new table to hold the combined data
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS combined_data (
            Ticker TEXT,
            Open REAL,
            Close REAL,
            Stock_Date TEXT,
            Headline TEXT,
            Source TEXT,
            News_Date TEXT,
            Summary TEXT,
            Name TEXT,
            Share INTEGER,
            Change INTEGER,
            Transaction_Date TEXT,
            Transaction_Price REAL
        )
    ''')
    conn.commit()
    return conn, cursor


def insert_stock_news_transaction(cursor, ticker, stock_data):
    cursor.execute('''
        INSERT INTO combined_data (
            Ticker, Open, Close, Stock_Date, Headline, Source, News_Date, Summary, Name, Share, Change, Transaction_Date, Transaction_Price
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (ticker, stock_data['open'], stock_data['close'], stock_data['stock_date'],
            stock_data['headline'], stock_data['source'], stock_data['news_date'], stock_data['summary'],
            stock_data['name'], stock_data['share'], stock_data['change'], stock_data['transaction_date'], stock_data['price']))
    
def insert_stock_data(cursor, ticker, stock_data):
    cursor.execute('''
        INSERT INTO combined_data (
            Ticker, Open, Close, Stock_Date
        ) VALUES (?, ?, ?, ?)
    ''', (ticker, stock_data['open'], stock_data['close'], stock_data['stock_date'],))


def insert_stock_news(cursor, ticker, stock_data):
    cursor.execute('''
        INSERT INTO combined_data (
            Ticker, Open, Close, Stock_Date, Headline, Source, News_Date, Summary
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (ticker, stock_data['open'], stock_data['close'], stock_data['stock_date'],
            stock_data['headline'], stock_data['source'], stock_data['news_date'], stock_data['summary']))
    
    

def insert_stock_transaction(cursor, ticker, stock_data):
    cursor.execute('''
        INSERT INTO combined_data (
            Ticker, Open, Close, Stock_Date, Name, Share, Change, Transaction_Date, Transaction_Price
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (ticker, stock_data['open'], stock_data['close'], stock_data['stock_date'],
            stock_data['name'], stock_data['share'], stock_data['change'], stock_data['transaction_date'], stock_data['price']))
    
    
def close_connection(conn):
    conn.commit()
    conn.close()
