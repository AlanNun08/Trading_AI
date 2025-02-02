# insert into the database main
import sqlite3

def create_database():
    # Create a connection to the database
    conn = sqlite3.connect("financial_data.db")
    cursor = conn.cursor()

    # Create the table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS stock (
            ticker TEXT PRIMARY KEY,
            date TEXT,
            price Text,
            
        )
        CREATE TABLE IF NOT EXISTS news (
            ticker TEXT PRIMARY KEY,
            date TEXT,
            headline TEXT,
            source TEXT,
            ai-summary TEXT,
            FOREIGN KEY (ticker) REFERENCES Stock(ticker)
            
        )
        CREATE TABLE IF NOT EXISTS insider_transaction (
            ticker TEXT PRIMARY KEY,
            date TEXT,
            share TEXT,
            change TEXT,
            transaction_price TEXT,
            ai-transaction_insights TEXT,
            FOREIGN KEY (ticker) REFERENCES Stock(ticker)
        )
        """)


    # Commit the changes
    conn.commit()

    # Close the connection
    conn.close()

def insert_stock(cursor, stock_data):
    cursor.execute('''
        INSERT INTO stock (
            ticker, date, price
        ) VALUES (?, ?, ?)
    ''', (stock_data['ticker'], stock_data['date'], stock_data['price']))
    
def insert_news(cursor, ticker, stock_data):
    cursor.execute('''
        INSERT INTO news (
            ticker, date, headline, source, ai-summary
        ) VALUES (?, ?, ?, ?, ?)
    ''', (ticker, stock_data['date'], stock_data['headline'],stock_data['source'], stock_data['ai-summary']))


def insert_transactions(cursor, ticker, transaction_data):
    cursor.execute('''
        INSERT INTO combined_data (
            ticker, date, share, change, transaction_price, ai-transaction-insights
        ) VALUES (?, ?, ?, ?, ?, ?)
    ''', (ticker, transaction_data['date'], transaction_data['share'], transaction_data['change'],
          transaction_data['transaction_price'], transaction_data['ai-transaction_insights']))
    
    