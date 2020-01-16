from bs4 import BeautifulSoup
import requests

def getProductLink(google_link):
    # When the google_link contains "http.." then it's already the product link
    if "http" == google_link[0:4]:
        return google_link
    # Have to add beginning of the url in case of google_link being "/shopping/prod.."
    url = "https://www.google.com" + google_link
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")
    # The link is contained in the "Visit site" link
    elem = soup.find("a", string="Visit Site", href=True)
    if not elem:
        return ""

    return elem["href"]

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
        product_desc, product_name, price, image, link = "", "", "", "", ""
        for element in product:
            if count == 0:
                image = element.find("a").find("img", src=True)["src"]
            elif count == 1:
                # Get the price and exclude first character ($)
                price = element.find("div").text[1:]
                # Sometimes spaces are followed by text, need to remove to convert to float
                if price.find(" ") > 0:
                    price = price[:price.find(" ")]
                    # Need to remove comma before converting to float
                price = float(price.replace(",", ""))
            elif count == 2:
                link = element.find("a", href=True)
                product_name = link.text
                link = getProductLink(link["href"])
                product_desc = element.find("div").text

            count += 1


            cursor = db.cursor()
            insert_info = (search, price, product_name, product_desc, image, link)
            # Add the product info to the database if all fields populated
            if all(insert_info):
                cursor.execute("""INSERT INTO results (search, price, product_name,
                                  product_description, image_link, product_link)
                                  VALUES(%s, %s, %s, %s, %s, %s)""", insert_info)
            db.commit()
            results.append(insert_info)


    results.sort(key=lambda tup: tup[1])

    return results[:10]
