from bs4 import BeautifulSoup
import requests
import uuid
from nltk.corpus import stopwords
from templates.search.views import get_db

def format_product_name(product_name):
    # Remove the ... from end of string if it exists
    product_name = product_name.replace('.', '')
    # Remove stop words such as 'and' from the string
    filtered_words = [word for word in product_name.split(' ') if word not in stopwords.words('english')]
    return ' '.join(filtered_words)


def format_price(price):
    # Remove the $ and end period
    price = price[1:-1].replace(",", "")
    # Return the price as a float
    return float(price)


def db_insert_product(results):
        db = get_db()
        cursor = db.cursor()
        cursor.execute("""INSERT INTO results (search, price, product_name,
                          product_id, product_link)
                          VALUES(%s, %s, %s, %s, %s)""", results)
        db.commit()


def scrape_info(search, product, html_classes):
    # Get the product name / description and formatting it
    product_name = product.find(html_classes["name_element"], attrs={"class": html_classes["name"]}).getText()
    formatted_name = format_product_name(product_name)

    # Get the product link
    product_elem = product.find("a", attrs={"class": html_classes["link"]}, href=True)
    product_link = "https://www.google.com" + product_elem["href"]

    # Get the product price
    price = product.find("span", attrs={"class": html_classes["price"]}).getText()
    float_price = format_price(price)

    # Create a 32 character id for the product to be uniquely identified with
    id = uuid.uuid1().hex

    return (search, float_price, formatted_name, id, product_link, )


def get_product_info(search, products, html_classes):
    """Gather products based on the type one product HTML."""
    results = []

    for product in products:
        # Get the product information
        insert_info = scrape_info(search, product, html_classes)
        if all(insert_info):
            db_insert_product(insert_info)
            results.append(insert_info)

    return results


def scrape_search_results(search):
    # Url for Google Shopping
    url = "https://www.google.com/search?psb=1&tbm=shop&q=" + search

    # Header to make it seem like it is being sent from Chrome browser
    headers = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.3"}
    # Send request to get results
    response = requests.get(url, headers=headers)

    soup = BeautifulSoup(response.text, "html.parser")
    results = []
    # Loop through the results to get price and product description
    products_one = soup.findAll("div", attrs={"class": "uMfazd EpWqse"})
    products_two = soup.findAll("div", attrs={"class": "sh-dlr__list-result"})

    if products_one:
        # The classes of html elements containing information
        html_classes = {
            "name_element": "h4",
            "name": "A2sOrd",
            "link": "VQN8fd sHaywe translate-content",
            "price": "Nr22bf"
        }
        results = get_product_info(search, products_one, html_classes)
    else:
        html_classes = {
            "name_element": "h3",
            "name": "xsRiS",
            "link": "shntl hy2WroIfzrX__merchant-name",
            "price": "Nr22bf"
        }
        results = get_product_info(search, products_two, html_classes)

    results.sort(key=lambda tup: tup[1])
    # Return eight results if possible
    index = min(8, len(results))
    return results[:index]
