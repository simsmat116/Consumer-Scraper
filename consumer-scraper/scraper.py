from bs4 import BeautifulSoup
import requests
import mysql.connector

# Function for querying the database based on the search entered.
def check_database(database, search):
    cursor = database.cursor()
    cursor.execute("SELECT product, price FROM results WHERE search=(%s)", (search,))
    query_results = cursor.fetchall()
    return query_results

# Establish connection to consumer_scraper database
db = mysql.connector.connect(
  host="localhost",
  user="root",
  passwd="",
  database="consumer_scraper"
)

# Get user search input
search = input("Hello, what are you shopping for today? ")

db_results = check_database(db, search)

if not db_results:

    url = "https://www.google.com/search?psb=1&tbm=shop&q=" + search

    response = requests.get(url)

    soup = BeautifulSoup(response.text, "html.parser")

    # Loop through the top 100 results provided in response
    for product in soup.findAll("div", attrs={"class": "pslires"}):
        count = 0
        product_desc,  price  = "", ""
        for element in product:
            if count == 1:
                # Get the price and exclude first character ($)
                price = element.find("div").text[1:]
                # Need to remove comma before converting to float
                price = float(price.replace(",", ""))
            elif count == 2:
                product_desc = element.find("div").text
            count += 1

        # Only insert products with a description and price
        if price and product_desc:
            cursor = db.cursor()
            insert_info = (search, price, product_desc)
            cursor.execute("INSERT INTO results (search, price, product) VALUES(%s, %s, %s)", insert_info)
            db.commit()

else:
    for result in db_results:
        print(result)
