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
        await cursor.execute("""
            INSERT INTO scraped_products (product_id, name, description, price, search, link, image_link, website)
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
                 &request_type=search&search_type=keyword&q={}&page={}""".format(search, page)
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
                image_link = "https:" + soup.find("div", attrs=image_class).find("img")["src"]
                # Define dictionary used to find the description
                description_class = {"class": "product-description__content__cutline-standard"}
                # Description is a unordered list of items
                description_items = soup.find("div", attrs=description_class).find("ul").findAll("li")
                description = " ".join([item.getText() for item in description_items])
                return (str(uuid.uuid4()), name, description, price, search, url, image_link, "Neiman Marcus")
            except:
                return None

    async def handle_products_search(self, search):
        """Handle all processes for scraping products from Neiman Marcus."""
        # Retrieve the product pages and store in list
        await self._retrieve_product_pages(search)
        # Run the process for scraping product pages
        await self._schedule_product_page_process(search)
