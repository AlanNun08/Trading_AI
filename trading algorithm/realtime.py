import requests
import sqlite3
import time
import json



# Create SQLite database connection and table if it doesn't exist
def create_database():
    conn = sqlite3.connect('new_stock_data.db')  # Create or open the database
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS premarketGainers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            symbol TEXT,
            open REAL,
            high REAL,
            low REAL,
            close REAL,
            volume INTEGER
        )
    ''')
    conn.commit()
    conn.close()

# Function to insert data into the database
def insert_data(timestamp, symbol, open_price, high, low, close, volume):
    conn = sqlite3.connect('stock_data.db')
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO premarketGainers (timestamp, symbol, open, high, low, close, volume) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (timestamp, symbol, open_price, high, low, close, volume))
    conn.commit()
    conn.close()

# Function to fetch stock data from Polygon.io API
def fetch_stock_data(url):
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        return data.get('results', [])  # Return the 'results' list from the response
    else:
        print(f"Error fetching data: {response.status_code}")
        return []

# Process the fetched data and store it in the database
def process_and_store_data():
    stock_list = ["RELI", "SES AI CORPC", "SIDU", "PLRZ"]

    # Define date ranges for each stock
    stock_dates = {
        "RELI": ["2024-12-23"],
        "SES AI CORPC": ["2024-12-26"],
        "SIDU": ["2024-12-16", "2024-12-18", "2024-12-30", "2024-12-31"],
        "PLRZ": ["2024-12-18"],
    }

    for stock, dates in stock_dates.items():
        for date in dates:
            # Construct the API URL
            url = f"https://api.polygon.io/v2/aggs/ticker/{stock}/range/1/second/{date}/{date}?adjusted=true&sort=desc&limit=50000&apiKey="
            
            # Fetch stock data
            stock_data = fetch_stock_data(url)

            # Process and insert data
            for record in stock_data:
                timestamp = time.strftime('%Y-%m-%d %H:%M:%S', time.gmtime(record['t'] / 1000))
                open_price = record['o']
                high = record['h']
                low = record['l']
                close = record['c']
                volume = record['v']

                # Insert the data into the database
                insert_data(timestamp, stock, open_price, high, low, close, volume)


# Main function to fetch, process, and store the data
def main():
    process_and_store_data()

if __name__ == "__main__":
    main()
