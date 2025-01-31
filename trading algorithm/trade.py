from datetime import datetime, timezone
import sqlite3
import requests
import finnhub
import time
import insert_data_into_combined_stock_data as insert_data

# This program will research what the stock price was for given date
# As well as the stock news and insider transactions for stock



def fetch_stock_data(ticker, start_date, end_date, api_key):
    url = f"https://api.polygon.io/v2/aggs/ticker/{ticker}/range/1/day/{start_date}/{end_date}?adjusted=true&sort=asc&apiKey={api_key}"
    
    response = requests.get(url)
    response.raise_for_status()
    return response.json()

def fetch_news(ticker, from_date, to_date):

    finnhub_client = finnhub.Client(api_key="")  # Replace with your Finnhub API key

    news_data = finnhub_client.company_news(ticker, _from=from_date, to=to_date)

    return news_data

def fetch_insider_trasnactions(ticker, from_date, to_date):

    finnhub_client = finnhub.Client(api_key="")  # Replace with your Finnhub API key

    # Fetch insider transactions from the API
    response = finnhub_client.stock_insider_transactions(ticker, from_date, to_date)

    return response.get('data', [])

def organize_data(stock_data, stock_news, insider_transactions):
    
    # Initialize lists
    news_list = []
    transactions_list = []
    stock_list = []

    # Process stock data
    for stock_entry in stock_data['results']:
        stock_date = datetime.fromtimestamp(stock_entry['t'] / 1000, tz=timezone.utc).strftime('%Y-%m-%d')
        open_price = stock_entry['o']
        close_price = stock_entry['c']
        
        stock_list.append({
            'stock_date': stock_date,
            'open': open_price,
            'close': close_price
        })
    
    # Process stock news
    for news in stock_news:
        headline = news['headline']
        source = news['source']
        news_date = datetime.fromtimestamp(news['datetime'], tz=timezone.utc).strftime('%Y-%m-%d')
        summary = news['summary']
        
        news_list.append({
            'headline': headline,
            'source': source,
            'news_date': news_date,
            'summary': summary
        })

    # Process insider transactions
    for transaction in insider_transactions:
        name = transaction['name']
        share = transaction['share']
        change = transaction['change']
        transaction_date = transaction['transactionDate']
        price = transaction['transactionPrice']
        
        transactions_list.append({
            'name': name,
            'share': share,
            'change': change,
            'transaction_date': transaction_date,
            'price': price
        })

    stock_list = sorted(stock_list, key=lambda x: x['stock_date'])
    news_list = sorted(news_list, key=lambda x: x['news_date'])
    transactions_list = sorted(transactions_list, key=lambda x: x['transaction_date'])

    list_for_sql_insert = []

    # Iterate over stock_list
    for stock in stock_list:
        
        # Iterate over news_list and check if dates match

        if len(news_list) != 0:
            for news in news_list:

                if stock['stock_date'] == news['news_date']:
                    stock.update(news)  # Merge news info into stock
                    
                    if len(transactions_list) == 0:
                        new_stock = stock.copy()
                        list_for_sql_insert.append(new_stock)
                        news_list.remove(news)  # Remove the news from the list
                        pass
                        
                    else:
                        # Iterate over transactions_list and check if dates match

                        for transaction in transactions_list:
                            if stock['stock_date'] == transaction['transaction_date']:
                                
                                new_stock = stock.copy()  # Create a copy of the updated stock data
                                new_stock.update(transaction)
                                list_for_sql_insert.append(new_stock)  # Append to the new_list
                                transactions_list.remove(transaction)  # Remove the transaction from the list
                                pass
                            else:

                                new_stock = stock.copy()
                                list_for_sql_insert.append(new_stock)
                                
                                break
                    
                else:
                    if len(transactions_list) != 0:
                        for transaction in transactions_list:
                            if stock['stock_date'] == transaction['transaction_date']:
                                
                                new_stock = stock.copy()  # Create a copy of the updated stock data
                                new_stock.update(transaction)  # Merge transaction info into stock
                                list_for_sql_insert.append(new_stock)  # Append to the new_list
                                transactions_list.remove(transaction)
                            
                                pass
                            elif 'headline' not in stock and 'transaction_date' not in stock and stock not in list_for_sql_insert:
                                new_stock = stock.copy()
                                list_for_sql_insert.append(new_stock)
                            else:
                                break
                                
                    
                    elif 'headline' not in stock and 'transaction_date' not in stock and stock not in list_for_sql_insert:
                        new_stock = stock.copy()
                        list_for_sql_insert.append(new_stock)

                    else:
                        break
                    
        else:
            for transaction in transactions_list:
                if stock['stock_date'] == transaction['transaction_date']:
                   
                    new_stock = stock.copy()  # Create a copy of the updated stock data
                    new_stock.update(transaction)  # Merge transaction info into stock
                    list_for_sql_insert.append(new_stock)  # Append to the new_list
                    transactions_list.remove(transaction)
                    
                     # Break out of the transaction loop once we find a match
                
            if 'headline' not in stock and 'transaction_date' not in stock and stock not in list_for_sql_insert:
                new_stock = stock.copy()
                list_for_sql_insert.append(new_stock)

    return list_for_sql_insert

def main():

    # these stocks were the ones with the most gainers from oct 2 to oct 10th

    tickers = ["TTC"]

    POLYGON_API_KEY = ""  # Replace with your Polygon.io API key
    # Constants
    START_DATE = input("Start Date: ")  # Replace with the start date polygon ignores the start date but not the end
    END_DATE = input("End Date: ") # Replace with the end date
    API_CALLS_PER_MINUTE = 5
    TIME_INTERVAL = 60 / API_CALLS_PER_MINUTE  # Time interval between calls in seconds

    # Loop through each ticker
    for ticker in tickers:
        insert_data.create_new_database()
        conn = sqlite3.connect('stock_data.db')
        cursor = conn.cursor()
        
        # Fetch stock data
        stock_data = fetch_stock_data(ticker, START_DATE, END_DATE, POLYGON_API_KEY)

        # Fetch stock news
        stock_news = fetch_news(ticker, START_DATE, END_DATE)

        # Fetch insider transactions
        insider_transactions = fetch_insider_trasnactions(ticker, START_DATE, END_DATE)
        if 'results' in stock_data:
            data_ready_to_insert = organize_data(stock_data, stock_news, insider_transactions)

            for entry in data_ready_to_insert:
                # Check if 'headline' is a key in the dictionary
                if 'headline' in entry:
                    # Check if 'transaction_date' is a key in the dictionary
                    if 'transaction_date' in entry:
                        insert_data.insert_stock_news_transaction(cursor, ticker, entry)
                    else:
                        insert_data.insert_stock_news(cursor, ticker, entry)
                elif 'transaction_date' in entry:
                    insert_data.insert_stock_transaction(cursor, ticker, entry)
                else:
                    insert_data.insert_stock_data(cursor, ticker, entry)
        
        insert_data.close_connection(conn)
        print(f"Data inserted successfully for ticker: {ticker}")
       

        # Wait before the next API call
        time.sleep(TIME_INTERVAL)

if __name__ == "__main__":
    main()
