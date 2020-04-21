from bs4 import BeautifulSoup
import requests
import random
import uuid
from nltk.corpus import stopwords
from templates.search.views import get_db
from fake_useragent import UserAgent
import aiohttp, asyncio

class ConsumerScraper:
    def __init__(self):
        self.user_agent = UserAgent()
        self.proxies = self.__get_proxies()

    def __get_proxies(self):
        """Retrieve proxies from www.sslproxies.org."""
        # List for storing proxies
        proxies = []
        # Sending request to get the proxies
        headers={ "User-Agent": self.user_agent.random }
        proxy_resp = requests.get("https://www.sslproxies.org/", headers=headers)
        soup = BeautifulSoup(proxy_resp.text, "html.parser")
        # Find the proxy table
        proxies_table = soup.find(id="proxylisttable")

        # Iterate all rows in the proxy table
        for row in proxies_table.tbody.find_all("tr"):
            entries = row.find_all('td')
            proxy = "http://" + entries[0].string + ":" + entries[1].string
            # Add the proxy to the proxies list
            proxies.append(proxy)

        return proxies

    def __get_random_proxy(self):
        """Retrieve random proxy to be used in web scraping."""
        return random.choice(self.proxies)

    def neiman_search_scrape(self, search):
        proxy = self.get_random_proxy()
        print(proxy)
        url = """https://www.neimanmarcus.com/search.jsp?from=brSearch&responsive=true
                 &request_type=search&search_type=keyword&q=sweatshirt&page=1"""
        resp = requests.get(url, headers={"User-Agent": self.user_agent.random })
        soup = BeautifulSoup(resp.text, "html.parser")

        product_urls = []

        for i in range(1, 6):
            # Craft url for specific page
            url = """https://www.neimanmarcus.com/search.jsp?from=brSearch&responsive=true
                     &request_type=search&search_type=keyword&q=sweatshirt&page=""" + str(i)
            # Set up a proxy handler
            proxy_support = request.ProxyHandler(request.getproxies())
            # Set up a url opener with the proxy handleSearch

class NeimanScraper(ConsumerScraper):
    def __init__(self):
        super(NeimanScraper, self).__init__()
        self.product_links = []

    def retrieve_product_links(self,search):
        loop = asyncio.get_event_loop()
        tasks = []
        # Retreive 10 pages for the given search
        for i in range(1, 10):
            # Create a task for scraping product links on a given page
            task = asyncio.ensure_future(self.__find_page_links(search, str(i)))
            tasks.append(task)
        loop.run_until_complete(asyncio.wait(tasks))
        print(self.product_links)


    async def __find_page_links(self, search, page):
        """Find product pages from the search results."""
        product_urls = []

        # Craft url for specific page
        url = """https://www.neimanmarcus.com/search.jsp?from=brSearch&responsive=true
                 &request_type=search&search_type=keyword&q=sweatshirt&page=""" + page
        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers={"User-Agent": self.user_agent.random}) as resp:
                response = await resp.read()
                soup = BeautifulSoup(response, "html.parser")
                # Obtain the links from the
                product_links = soup.findAll("a", attrs={"class": "product-thumbnail__link"}, href=True)
                # Add the links to the list of links
                self.product_links.extend([link["href"] for link in product_links])


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
    products_one = soup.findAll("div", attrs={"class": "sh-dgr__gr-auto sh-dgr__grid-result"})
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
    index = min(5, len(results))
    return results[:index]
