import sqlite3
from datetime import datetime, timedelta
import sys



def convert_to_pst(row):
    # Define the format of the time string
    time_format = "%Y-%m-%d %H:%M:%S"

    # Convert the time string to a datetime object in Eastern Time (ET)
    et_time = datetime.strptime(row[1], time_format)

    # Subtract 3 hours to convert to Pacific Standard Time (PST)
    pst_time = et_time - timedelta(hours=3)

    # Convert the datetime object back to a string, but only get the time part
    time_only = pst_time.strftime("%H:%M:%S")  # Only get the time part

    # Return the converted time in PST
    return time_only



# Full file path to the database
file_path = r"new_stock_data.db"

# Connect to the database
try:

    conn = sqlite3.connect(file_path)  # Use the full file path
    cursor = conn.cursor()

    # Retrieve all data from the premarketGainersNew table
    cursor.execute('SELECT * FROM premarketGainersNew')
    rows = cursor.fetchall()  # Fetch all rows from the query

    old_ten_percent_value = rows[0]
    ten_percent_value = rows[1]

    old_twenty_percent_value = rows[0]
    twenty_percent_value = rows[2]

    old_thirty_percent_value = rows[0]
    thirty_percent_value = rows[3]

    ticker = old_ten_percent_value[2]
    date_old = old_ten_percent_value[1].split(" ")[0]

    # This will hold the info for the percentages and it will later be used to add them to a dictionary to then insert inside of a database
    ten_percentage_info = []
    twenty_percentage_info = []
    thirty_percentage_info =[]


    # Print the retrieved rows
    for row in rows:
        date_new = row[1].split(" ")[0]

        time = convert_to_pst(row)

        if row[2] != ticker or date_old != date_new:
            ticker = row[2]

            # you need to reset the values for ten percent, twenty percent, thirty percent
            # for some reason the row[0] = 23987 but it registers as 23988 when you plug it in rows[row[0]]
            new_position = row[0] - 1
            old_ten_percent_value = rows[new_position]
            ten_percent_value = rows[new_position + 1]

            old_twenty_percent_value = rows[new_position]
            twenty_percent_value = rows[new_position + 2]

            old_thirty_percent_value = rows[new_position]
            thirty_percent_value = rows[new_position + 3]
            date_old = date_new

        else:

            if ((ten_percent_value[3] - old_ten_percent_value[3]) / old_ten_percent_value[3]) * 100 >= 10 and ((ten_percent_value[3] - 
                                                                                                            old_ten_percent_value[3]) / old_ten_percent_value[3]) * 100 < 20 :
                old_time = convert_to_pst(old_ten_percent_value)
                new_time = convert_to_pst(ten_percent_value)
                price_change_percentage = ((ten_percent_value[3] - old_ten_percent_value[3]) / old_ten_percent_value[3]) * 100
                print(f"Ticker: {ticker}")
                print(f"Old time: {old_time}")
                print(f"Old Price: ${old_ten_percent_value[3]:.2f}")
                print(f"New time: {new_time}")
                print(f"New price: ${ten_percent_value[3]:.2f}")
                print(f"Percentage change: {price_change_percentage:.2f}%")
                print(" ")
                
                # Create a dictionary with the data
                entry = {
                    "Ticker": ticker,
                    "Old time": old_time,
                    "Old Price": round(old_ten_percent_value[3], 2),
                    "New time": new_time,
                    "New price": ten_percent_value[3],
                    "Percentage change": round(price_change_percentage, 2)
                }

                # Append the dictionary to the list
                ten_percentage_info.append(entry)

                ten_percent_value = row
                old_ten_percent_value = row

            else:
                ten_percent_value = row

            if ((twenty_percent_value[3] - old_twenty_percent_value[3]) / old_twenty_percent_value[3]) * 100 >= 20 and ((twenty_percent_value[3] - 
                                                                                                                        old_twenty_percent_value[3]) / old_twenty_percent_value[3]) * 100 < 30 :
                old_time = convert_to_pst(old_twenty_percent_value)
                new_time = convert_to_pst(twenty_percent_value)
                price_change_percentage = ((twenty_percent_value[3] - old_twenty_percent_value[3]) / old_twenty_percent_value[3]) * 100
                print(f"Ticker: {ticker}")
                print(f"Old Time: {old_time}")
                print(f"Old Price: ${old_twenty_percent_value[3]:.2f}")
                print(f"New Time: {new_time}")
                print(f"New price: ${twenty_percent_value[3]:.2f}")
                print(f"Percentage change: {price_change_percentage:.2f}%")
                print(" ")
                twenty_percent_value = row
                old_twenty_percent_value = row

            else:

                twenty_percent_value = row
                
            if ((thirty_percent_value[3] - old_thirty_percent_value[3]) / old_thirty_percent_value[3]) * 100 >= 30 and ((thirty_percent_value[3]
                                                                                                                        - old_thirty_percent_value[3]) / old_thirty_percent_value[3]) * 100 < 40 :
                old_time = convert_to_pst(old_thirty_percent_value)
                new_time = convert_to_pst(thirty_percent_value)
                price_change_percentage = ((thirty_percent_value[3] - old_thirty_percent_value[3]) / old_thirty_percent_value[3]) * 100
                print(f"Ticker: {ticker}")
                print(f"Old Time: {old_time}")
                print(f"Old Price: ${old_thirty_percent_value[3]:.2f}")
                print(f"New Time: {new_time}")
                print(f"New price: ${thirty_percent_value[3]:.2f}")
                print(f"Percentage change: {price_change_percentage:.2f}%")
                print(" ")
                thirty_percent_value = row
                old_thirty_percent_value = row
                
            else:
                thirty_percent_value = row
           
except sqlite3.Error as e:
    print(f"An error occurred with the database: {e}")
finally:
    # Close the database connection
    if conn:
        conn.close()
