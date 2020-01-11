from bs4 import BeautifulSoup
import requests

def scrape_search_results(search, db):
    # Url for Google Shopping
    url = "https://www.google.com/search?psb=1&tbm=shop&q=" + search

    # Send request to get results
    response = requests.get(url)

    soup = BeautifulSoup(response.text, "html.parser")

    results = []
    # Loop through the results to get price and product description
    for product in soup.findAll("div", attrs={"class": "pslires"}):
        count = 0
        product_desc,  price  = "", ""
        for element in product:
            if count == 1:
                # Get the price and exclude first character ($)
                price = element.find("div").text[1:]
                # Sometimes spaces are followed by text, need to remove to convert to float
                if price.find(" ") > 0:
                    price = price[:price.find(" ")]
                # Need to remove comma before converting to float
                price = float(price.replace(",", ""))
            elif count == 2:
                product_desc = element.find("div").text
            count += 1

            # Only insert products that have both price and description
            if price and product_desc:
                cursor = db.cursor()
                insert_info = (search, price, product_desc)
                # Add the product info to the database
                cursor.execute("INSERT INTO results (search, price, product) VALUES(%s, %s, %s)", insert_info)
                db.commit()
                results.append((product_desc, price))
    results.sort(key=lambda tup: tup[1])

    return results[:10]
