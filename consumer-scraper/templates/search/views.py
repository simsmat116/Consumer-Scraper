from templates import app
from quart import render_template, request, jsonify, make_response
from templates.search import account_helper
from templates.search.scraper import NeimanScraper
import mysql.connector
import math
import asyncio

def get_db():
    # Establish connection to consumer_scraper database
    db = mysql.connector.connect(
      host=app.config['MYSQL_HOST'],
      user=app.config["MYSQL_USER"],
      passwd=app.config["MYSQL_PASSWORD"],
      database=app.config["MYSQL_DB"]
    )
    return db


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
async def catch_all(path):
    return await render_template("index.html")

@app.route('/api/scrape_products', methods=['POST'])
async def scrape_results():
    """Receive POST request and scraped information from proper websites."""
    # Retrieve the search from the request
    search = (await request.get_json())["search"]

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM scraped_products WHERE search = %s", (search,))
    # Return if this search already exists in the database
    if cursor.fetchone():
        print("yes")
        return await make_response('Product Exists', '200')


    # Create list of scrapers objects and tasks to be executed
    scrapers, tasks = [ NeimanScraper()], []
    loop = asyncio.get_event_loop()

    for scraper in scrapers:
        loop.create_task(scraper.handle_products_search(search))

    return await make_response('Created', '201')


@app.route('/api/retrieve_products', methods=['GET'])
def retrieve_results():
    """Retrieve the results from the database based on the search"""
    username = request.cookies.get('username')
    search = request.args.get('q')
    page = request.args.get('p')
    print(page)
    offset = (int(page) - 1) * 10
    conn = get_db()
    cursor = conn.cursor()
    # Query the database to see if there are existing records
    cursor.execute("""SELECT name, description, price, link, image_link, website
                      FROM scraped_products WHERE search = %s ORDER BY created_at LIMIT 5 OFFSET %s""", (search, offset))

    columns = [col[0] for col in cursor.description]
    # Store each record in a dictionary with appropriate column names
    results = [dict(zip(columns, row)) for row in cursor.fetchall()]

    context = { "results": [] }
    for result in results:
        context["results"].append(result)
        
    cursor.execute("SELECT COUNT(*) FROM scraped_products WHERE search = %s", (search,))
    num_records = cursor.fetchone()[0]

    context["num_pages"] = max(3, math.ceil(int(num_records) / 10))

    return jsonify(**context)


@app.route('/api/popular_products/<string:product_id>', methods=['POST'])
def update_product_visits(product_id):
    db = get_db()
    cursor = db.cursor()
    # Check the popular_products table to see if the product exists
    cursor.execute('SELECT num_visits FROM popular_products WHERE product_id= %s ',  (product_id, ))
    record = cursor.fetchone()

    if not record:
        cursor.execute('INSERT INTO popular_products (product_id, num_visits) VALUES(%s, %s)',
                       (product_id, 1))
    else:
        updated_visits = record[0] + 1
        cursor.execute('UPDATE popular_products SET num_visits = %s WHERE product_id=%s',
                        (updated_visits, product_id))

    db.commit()
    return '200'


@app.route('/api/popular_products/', methods=['GET'])
def get_popular_products():
    db = get_db()
    cursor = db.cursor()

    # Get the 12 most popular products in the database
    cursor.execute('''SELECT r.product_name, r.price, r.product_link, r.product_id FROM results AS r INNER JOIN popular_products
                      AS pp ON r.product_id = pp.product_id ORDER BY pp.num_visits LIMIT 12''')

    products = cursor.fetchall()

    context = { "results": [] }
    # Iterate through all of the products found
    for product in products:
        context["results"].append({
            "product_name": product[0],
            "price": product[1],
            "product_link": product[2],
            "product_id": product[3]
        })

    return jsonify(**context)


@app.route('/api/accounts/login', methods=['POST'])
async def login_user():
    content = await request.get_json()
    if 'username' not in content or 'password' not in content:
        return ('Invalid Request', '400')

    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT password FROM users WHERE username = %s', (content['username'],))
    db_password = cursor.fetchone()

    if not db_password:
        return ('Login Failure', 401)

    if account_helper.verify_password(content['password'], db_password[0]):
        resp = await make_response(('Login Success', 200))
        resp.set_cookie('username', content['username'])
        return resp

    return ('Login Failure', 401)


@app.route('/api/accounts/create', methods=['POST'])
async def create_account():
    content = await request.get_json()
    if 'username' not in content or 'password' not in content:
        return await make_response(('There was a problem processing your request.', 400))

    db_password = account_helper.set_password(content['password'])

    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM users WHERE username = %s', (content['username'],))
    result = cursor.fetchone()

    if result:
        return await make_response(('An account with this username already exists.', 400))

    cursor.execute('INSERT INTO users (username, password, first_name, last_name) VALUES(%s, %s, %s, %s)',
                    (content['username'], db_password, content['first_name'], content['last_name']))
    db.commit()

    resp = await make_response(('Account Created', 201))
    resp.set_cookie('username', content['username'])

    return resp
