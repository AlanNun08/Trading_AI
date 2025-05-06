# info to get before creating the main part of this program 

    # check on other stocks if someone buys a lot of stock like 150,000 shares and then someone sells that much volume then its time to pullout
    # Haven't done this

#main

    # get the gainers around 2 am 

    # using the info that you got from calculate_percentage_in_timeframe to predict what the probabilty is to get a 10 - 30% gain

        # when you check ( accurately ) how many times there are chances to get a 10 - 30% gain make sure to also time it 
        

# get the gainers

# you want to run this program from 4 am to 6 am and see how many chances there were for 10 - 30 % gains and also what were those prices

    # check what was the highest price you have seen the stock go up to and how long did it stay there or for how long


import requests
from datetime import datetime
from openai import OpenAI
import sql_statements as sql
import sqlite3
import finnhub
import calculate_percentage_in_timefram as calculate



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
        You are a **Financial News Analysis Assistant** for a financial advisor. Your goal is to analyze each provided news article and deliver insights in a clear, accessible manner. For **every article**, make sure to include the following in your response:

        1. **Context** – Provide relevant background or context for the news. Explain why this story is significant (e.g. related industry trends, recent events, or historical background that helps put the news in perspective).

        2. **Short-Term Impact** – Analyze the immediate or short-term implications of the news. Discuss how markets, specific stocks or sectors, or investor sentiment might be affected in the coming days or weeks.

        3. **Long-Term Impact** – Discuss the potential long-range consequences. Consider effects on the company’s fundamentals, the industry as a whole, or economic/market trends over the next several months or years.

        4. **Recommendation** – Offer a practical recommendation or actionable advice for the financial advisor and their clients. This might include investment strategy adjustments, risk management tips, or talking points for client communication, based on the news.

        **Language and Tone:** Use simple, clear language that a non-expert can understand. Avoid financial jargon (or explain it briefly if you must use it). Keep a professional but **friendly tone**, as if translating complex news for a client. 

        **Format:** Organize your answer into distinct sections (you can use headings or bullet points for each of the above parts). This structure will make it easy to scan and understand. Keep paragraphs short and to the point. 

        """

        user_prompt = f"""
        Here is the news article for analysis:
        - **Headline**: {news['headline']}
        - **Source**: {news['source']}
        - **Summary**: {news['summary']}

        Given this news, please provide an analysis covering the context, short-term impact, long-term impact, and a recommendation.
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
    url = "https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/gainers?apiKey="
    
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
            calculate.calculate_gains(stock, today_date)
            

            client = OpenAI(api_key="<DeepSeek API Key>", base_url="https://api.deepseek.com")

            # Feed deepseek the news info
            # going to need an algorithm so you dont repeat the news inside of the database
            # also will need another algorithm to display the news in the program from the database
            stock_news = fetch_news(stock, today_date, today_date)
            stock_news.append(stock_news_advisor_ai_prompt(stock_news, client))
            sql.insert_news(cursor, stock, stock_news)

            # going to need an algorithm so you dont repeat the tranasactions inside of the database
            # also will need another algorithm to display the transactions in the program from the database
            insider_transactions = fetch_insider_trasnactions(stock, today_date, today_date)
            sql.insert_transactions(cursor, stock, insider_transactions)
            



            conn.commit()
            conn.close()


            # and then run the calculations to see how many times there are chances to get a 10 - 30% gain
            # use todays date to run calculations on all of the stocks that you have gotten the data for



           
if __name__ == "__main__":
    main()  