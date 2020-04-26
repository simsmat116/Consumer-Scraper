from bs4 import BeautifulSoup
import requests, random, uuid
from fake_useragent import UserAgent
from templates import app
import aiohttp, asyncio, aiomysql


class ConsumerScraper:
    def __init__(self):
        """Initalize class with user agent, proxies, product pages, and database connection."""
        self.user_agent = UserAgent()
        self.proxies = self._get_proxies()
        self.product_links = []


    def _get_proxies(self):
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


    def _get_random_proxy(self):
        """Retrieve random proxy to be used in web scraping."""
        return random.choice(self.proxies)


    async def _get_db(self):
        """Retrieve a connection to the database."""
        conn = await aiomysql.connect(host=app.config["MYSQL_HOST"],
                                   port=app.config["MYSQL_PORT"],
                                   user=app.config["MYSQL_USER"],
                                   password=app.config["MYSQL_PASSWORD"],
                                   db=app.config["MYSQL_DB"])
        return conn

    async def _insert_product_db(self, product):
        """Insert product information into the results table."""
        # Connect to the database
        conn = await self._get_db()
        cursor = await conn.cursor()
        # Insert the product information into the database
        await cursor.execute("""INSERT INTO scraped_products (name, description, price, type, search, link, image_link, website)
                                VALUES(%s, %s, %s, %s, %s, %s, %s, %s)""", product)

        # Commit the changes to the database
        await conn.commit()
        # Close the connection
        await cursor.close()
        conn.close()


class NeimanScraper(ConsumerScraper):
    def __init__(self):
        super(NeimanScraper, self).__init__()

    async def _retrieve_product_pages(self,search):
        """Retrieve the product pages using asynchronous requests."""
        tasks = []
        # Retreive 10 pages for the given search
        loop = asyncio.get_event_loop()
        tasks = []
        for i in range(1, 2):
            # Create a task for scraping product links on a given page
            tasks.append(loop.create_task(self._find_product_links(search, str(i))))

        await asyncio.gather(*tasks)


    async def _find_product_links(self, search, page):
        """Find product pages from the search results."""
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

    async def _schedule_product_page_process(self, search):
        self._session = aiohttp.ClientSession()
        try:
            for product_url in self.product_links:
                product_info = await self._find_product_information(product_url, search)
                # Add the found information into the database
                if product_info:
                    await self._insert_product_db(product_info)
        finally:
            await self._session.close()


    async def _find_product_information(self, url, search):
        async with self._session.get(url, headers={"User-Agent": self.user_agent.random}) as resp:
            response = await resp.read()
            soup = BeautifulSoup(response, "html.parser")
            try:
                name = soup.find("span", attrs={"class": "product-heading__name__product"}).getText()
                price = soup.find("span", attrs={ "class": "promo-final-price" })
                # If there is no promo price, try to find the retail price
                if not price:
                    price = soup.find("span", attrs={ "class": "retailPrice" })
                price = float(price.getText().replace("$", "").replace(",", ""))
                # Define dctionary used to find the image link
                image_class = {"class": "slick-slide slick-active slick-current"}
                image_link = soup.find("div", attrs=image_class).find("img")["src"]
                # Define dictionary used to find the description
                description_class = {"class": "product-description__content__cutline-standard"}
                # Description is a unordered list of items
                description_items = soup.find("div", attrs=description_class).find("ul").findAll("li")
                description = " ".join([item.getText() for item in description_items])
                return (name, description, price, "", search, url, image_link, "Neiman Marcus")
            except:
                return None

    async def handle_products_search(self, search):
        """Handle all processes for scraping products from Neiman Marcus."""
        # Retrieve the product pages and store in list
        await self._retrieve_product_pages(search)
        # Run the process for scraping product pages
        print(self.product_links)
        await self._schedule_product_page_process(search)



# def format_product_name(product_name):
#     # Remove the ... from end of string if it exists
#     product_name = product_name.replace('.', '')
#     # Remove stop words such as 'and' from the string
#     filtered_words = [word for word in product_name.split(' ') if word not in stopwords.words('english')]
#     return ' '.join(filtered_words)
#
#
# def format_price(price):
#     # Remove the $ and end period
#     price = price[1:-1].replace(",", "")
#     # Return the price as a float
#     return float(price)
#
#
# def db_insert_product(results):
#         db = get_db()
#         cursor = db.cursor()
#         cursor.execute("""INSERT INTO results (search, price, product_name,
#                           product_id, product_link)
#                           VALUES(%s, %s, %s, %s, %s)""", results)
#         db.commit()
#
#
# def scrape_info(search, product, html_classes):
#     # Get the product name / description and formatting it
#     product_name = product.find(html_classes["name_element"], attrs={"class": html_classes["name"]}).getText()
#     formatted_name = format_product_name(product_name)
#
#     # Get the product link
#     product_elem = product.find("a", attrs={"class": html_classes["link"]}, href=True)
#     product_link = "https://www.google.com" + product_elem["href"]
#
#     # Get the product price
#     price = product.find("span", attrs={"class": html_classes["price"]}).getText()
#     float_price = format_price(price)
#
#     # Create a 32 character id for the product to be uniquely identified with
#     id = uuid.uuid1().hex
#
#     return (search, float_price, formatted_name, id, product_link, )
#
#
# def get_product_info(search, products, html_classes):
#     """Gather products based on the type one product HTML."""
#     results = []
#
#     for product in products:
#         # Get the product information
#         insert_info = scrape_info(search, product, html_classes)
#         if all(insert_info):
#             db_insert_product(insert_info)
#             results.append(insert_info)
#
#     return results
#
#
# def scrape_search_results(search):
#     # Url for Google Shopping
#     url = "https://www.google.com/search?psb=1&tbm=shop&q=" + search
#
#     # Header to make it seem like it is being sent from Chrome browser
#     headers = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.3"}
#     # Send request to get results
#     response = requests.get(url, headers=headers)
#
#     soup = BeautifulSoup(response.text, "html.parser")
#     results = []
#     # Loop through the results to get price and product description
#     products_one = soup.findAll("div", attrs={"class": "sh-dgr__gr-auto sh-dgr__grid-result"})
#     products_two = soup.findAll("div", attrs={"class": "sh-dlr__list-result"})
#
#     if products_one:
#         # The classes of html elements containing information
#         html_classes = {
#             "name_element": "h4",
#             "name": "A2sOrd",
#             "link": "VQN8fd sHaywe translate-content",
#             "price": "Nr22bf"
#         }
#         results = get_product_info(search, products_one, html_classes)
#     else:
#         html_classes = {
#             "name_element": "h3",
#             "name": "xsRiS",
#             "link": "shntl hy2WroIfzrX__merchant-name",
#             "price": "Nr22bf"
#         }
#         results = get_product_info(search, products_two, html_classes)
#
#     results.sort(key=lambda tup: tup[1])
#     # Return eight results if possible
#     index = min(5, len(results))
#     return results[:index]
