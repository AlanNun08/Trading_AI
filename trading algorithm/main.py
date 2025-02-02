# info to get before creating the main part of this program 

    # check on other stocks if someone buys a lot of stock like 150,000 shares and then someone sells that much volume then its time to pullout

    # also make sure you are running the part of the program that searches for news

        # make sure to investigate what type of news can be good or bad so you can have a list of good and bad news so you can match it with the current news 
        # are coming out in the moring of the time you are running the program

#main

    # get the gainers around 2 am 

    # using the info that you got from calculate_percentage_in_timeframe to predict what the probabilty is to get a 10 - 30% gain

        # when you check ( accurately ) how many times there are chances to get a 10 - 30% gain make sure to also time it 
        # so how long did it take to get these gains and also at what time did this happen to try to find a pattern overall to get a accurate prediction

    # also make sure you are running the part of the program that searches for news

        # make sure to have a way to match the news that is coming out to previous news of other stocks to see if there is a match 
        # for possible positive or negative effects on the stock


# get the gainers

# you want to run this program from 4 am to 6 am and see how many chances there were for 10 - 30 % gains and also what were those prices

    # check what was the highest price you have seen the stock go up to and how long did it stay there or for how long


import requests
from datetime import datetime
import sys
from openai import OpenAI
import sql_statements as sql
import sqlite3
import finnhub


def financial_advisor_prompt(insider_transactions, client):

    # Process insider transactions
    for transaction in insider_transactions:
        name = transaction['name']
        share = transaction['share']
        change = transaction['change']
        transaction_date = transaction['transactionDate']
        price = transaction['transactionPrice']

        user_prompt =  f"""
        Financial Transaction Details:
        - Name: {name}
        - Share: {share}
        - Change: {change}
        - Transaction Date: {transaction_date}
        - Price: {price}
        """


        system_prompt = """
        You are a highly experienced financial advisor with deep expertise in analyzing stock transactions and providing actionable insights. Your task is to evaluate financial transactions based on the details provided by the user. 

        When analyzing the transaction, consider the following factors:
        1. **Market Trends**: Assess the current market conditions and how they might impact the stock.
        2. **Transaction Details**: Analyze the significance of the change in share value, the timing of the transaction, and the price at which the transaction occurred.
        3. **Client Goals**: Tailor your advice to help the client make informed decisions aligned with their financial goals.

        Provide a clear, concise, and professional analysis. Include recommendations on whether the client should buy, sell, or hold the shares, and explain your reasoning. If additional information is needed to make a more informed decision, specify what is required.
        """

        # Call the API
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            stream=False
        )
    
        print("\nFinancial Advisor's Insider Transactions Insights:")
        print(response.choices[0].message.content)

def stock_news_advisor_ai_prompt(news, client):

    for news in news:
        headline = news['headline']
        source = news['source']
        summary = news['summary']
        
        news = ({
            'headline': headline,
            'source': source,
            'summary': summary
        })


        # Define the system and user prompts
        system_prompt = """
        You are a knowledgeable and experienced financial advisor. Your task is to analyze news articles and provide clear, actionable insights to help users make informed financial decisions. When given a news headline, source, and summary, follow these steps:

        1. **Contextualize the News**: Briefly explain the significance of the news and how it relates to the financial markets, industries, or the economy.
        2. **Assess the Impact**: Analyze the potential short-term and long-term implications for investors, businesses, or the general public.
        3. **Provide Recommendations**: Offer practical advice or strategies for individuals or businesses to consider based on the news.
        4. **Use Simple Language**: Ensure your explanation is easy to understand, even for those without a financial background.
        """

        user_prompt = f"""
        Here is the news article for analysis:
        - **Headline**: {news['headline']}
        - **Source**: {news['source']}
        - **Summary**: {news['summary']}

        Please provide your insights and recommendations as a financial advisor.
        """

        # Call the API
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            stream=False
        )

        # Print the AI's response
        print("\nFinancial Advisor's Insights:")
        print(response.choices[0].message.content)
        print(" ")
        print(" ")
        print(" ")

def get_gainers():
    url = "https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/gainers?apiKey=qHykCRiI5wv36E1mBT4xsEG0wp5GXucJ"
    
    list_of_gainers = []

    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        gainers = data.get("tickers", [])
        
        # Extract and display key information for each gainer
        for ticker in gainers:
            list_of_gainers.append(ticker.get("ticker"))

    else:
        print(f"Error: Unable to fetch data (Status Code: {response.status_code})")

    return list_of_gainers

def get_live_stock_prices(stock, API_KEY, date):

    # Make the API request
    url = f"https://api.polygon.io/v2/last/trade/{stock}?apiKey={API_KEY}"


    response = requests.get(url)
    return_list = []

    # Check if the request was successful
    if response.status_code == 200:
        data = response.json()
        last_trade_price = data["results"]["p"]  # Last trade price
        return_list.append({
            "ticker": stock,
            "date": date,
            "price": last_trade_price
        })
    else:
        print(f"Error: {response.status_code} - {response.text}")

def fetch_insider_trasnactions(ticker, from_date, to_date):

    finnhub_client = finnhub.Client(api_key="")  # Replace with your Finnhub API key

    # Fetch insider transactions from the API
    response = finnhub_client.stock_insider_transactions(ticker, from_date, to_date)

    return response.get('data', [])

def fetch_news(ticker, from_date, to_date):

    finnhub_client = finnhub.Client(api_key="")  # Replace with your Finnhub API key

    news_data = finnhub_client.company_news(ticker, _from=from_date, to=to_date)

    return news_data

# After you get the gainers you want to start getting the price and start getting the news and running through a ai language model to see 
# how impactful the news is.
# You are going to want to run price, news, and transactions at the same time
# As the code gets the prices you want to run the algorithm to see what the percentage is for the stock to go up or down

def main():

    sql.create_database()
    today_date = datetime.today().date() # Current Date ( needed to get the stock price, news, and transactions)

    # store stock gainers
    gainer_data = get_gainers()

    while True:

        # Get stock prices, news, and insider transaction from today's gainer
        for stock in gainer_data:
            print(f"Fetching data for {stock}...")
            POLYGON_API_KEY = ""

            stock = get_live_stock_prices(stock, POLYGON_API_KEY)

            conn = sqlite3.connect("financial_data.db")
            cursor = conn.cursor()
            sql.insert_stock(cursor, stock)
            

            client = OpenAI(api_key="<DeepSeek API Key>", base_url="https://api.deepseek.com")

            # Feed deepseek the news info
            # going to need an algorithm so you dont repeat the news inside of the database
            # also will need another algorithm to display the news in the program from the database
            stock_news = fetch_news(stock, today_date, today_date)
            stock_news.append(stock_news_advisor_ai_prompt(stock_news, client))
            sql.insert_news(cursor, stock, stock_news)

            # Feed deepseek the insider transactions info
            # going to need an algorithm so you dont repeat the tranasactions inside of the database
            # also will need another algorithm to display the transactions in the program from the database
            insider_transactions = fetch_insider_trasnactions(stock, today_date, today_date)
            insider_transactions.append(financial_advisor_prompt(insider_transactions, client))
            sql.insert_transactions(cursor, stock, insider_transactions)
            



            # and then run the calculations to see how many times there are chances to get a 10 - 30% gain
            # use todays date to run calculations on all of the stocks that you have gotten the data for



           
if __name__ == "__main__":
    main()  