from bs4 import BeautifulSoup
import requests
import uuid
from nltk.corpus import stopwords

def formatProductName(product_name):
    # Remove the ... from end of string if it exists
    product_name = product_name.replace('.', '')
    # Remove stop words such as 'and' from the string
    filtered_words = [word for word in product_name.split(' ') if word not in stopwords.words('english')]
    return ' '.join(filtered_words)

def formatPrice(price):
    # Remove the $ and end period
    price = price[1:-1].replace(",", "")
    # Return the price as a float
    return float(price)

def scrape_search_results(search, db):
    # Url for Google Shopping
    url = "https://www.google.com/search?psb=1&tbm=shop&q=" + search

    # Header to make it seem like it is being sent from Chrome browser
    headers = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.3"}
    # Send request to get results
    response = requests.get(url, headers=headers)

    soup = BeautifulSoup(response.text, "html.parser")
    results = []
    # Loop through the results to get price and product description
    for product in soup.findAll("div", attrs={"class": "uMfazd EpWqse"}):
        # Get the product name / description and formatting it
        product_name = product.find("h4", attrs={"class": "A2sOrd"}).getText()
        formatted_name = formatProductName(product_name)

        # Get the product link
        product_elem = product.find("a", attrs={"class": "sHaywe VQN8fd translate-content"}, href=True)
        product_link = product_elem["href"]

        # Get the image link
        img_elem = product.find("div", attrs={"class": "sh-dgr__thumbnail"}).find("a", href=True)
        image_link = img_elem["href"]

        # Get the product price
        price = product.find("span", attrs={"class": "Nr22bf"}).getText()
        float_price = formatPrice(price)

        cursor = db.cursor()
        # Create a 32 character id for the product to be uniquely identified with
        id = uuid.uuid1().hex

        insert_info = (search, float_price, formatted_name, image_link, product_link, id)
        print(insert_info)
        # Add the product info to the database if all fields populated
        if all(insert_info):
            cursor.execute("""INSERT INTO results (search, price, product_name,
                              image_link, product_link, product_id)
                              VALUES(%s, %s, %s, %s, %s, %s)""", insert_info)
            db.commit()
            results.append(insert_info)

    results.sort(key=lambda tup: tup[1])

    return results[:10]
