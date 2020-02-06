from templates import app
from flask import render_template, request, jsonify
from templates.search import scraper, account_helper
import mysql.connector
import math

def get_db():
    # Establish connection to consumer_scraper database
    db = mysql.connector.connect(
      host=app.config['MYSQL_HOST'],
      user=app.config["MYSQL_USER"],
      passwd=app.config["MYSQL_PASSWORD"],
      database=app.config["MYSQL_DB"]
    )
    return db

@app.route('/')
@app.route('/search')
@app.route('/popular_products')
def home_page():
    return render_template('index.html')

@app.route('/api/search', methods=['GET'])
def get_search_results():
    search = request.args.get('q')
    page = request.args.get('p')
    offset = (int(page) - 1) * 8
    db = get_db()
    cursor = db.cursor()
    # Query the database to see if there are existing records
    cursor.execute('SELECT * FROM results WHERE search = %s ORDER BY price LIMIT 8 OFFSET %s', (search, offset))
    results = cursor.fetchall()
    # If no results in the database, scrape Google Shopping
    if not results:
        results = scraper.scrape_search_results(search, db)

    context = { "results": [] }
    for result in results:
        context["results"].append({
            "product_name": result[2],
            "price": result[1],
            "product_link": result[4],
            "product_id": result[3]
        })

    cursor.execute("SELECT COUNT(*) FROM results WHERE search = %s", (search,))
    num_records = cursor.fetchone()[0]

    context["num_pages"] = math.ceil(int(num_records) / 8)

    return jsonify(**context)

@app.route('/api/popular_products/<string:product_id>', methods=['POST'])
def update_product_vistits(product_id):
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
def login_user():
    if account_helper.check_account_post(request):
        return 'Invalid Request', '400'

    content = request.get_json()
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT password FROM users WHERE username = %s', (content['username'],))
    db_password = cursor.fetchone()[0]

    context = {"login_status": "failure"}
    if account_helper.verify_password(content['password'], db_password):
        context["login_status"] = "success"

    return jsonify(**context)

@app.route('/api/accounts/create', methods=['POST'])
def create_account():
    if account_helper.check_account_post(request):
        return 'Invalid Request', '400'

    content = request.get_json()

    db_password = account_helper.set_password(content['password'])

    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM users WHERE username = %s', (content['username'],))
    result = cursor.fetchone()

    context = {'account_status': '', "message": '' }

    if result:
        context['account_status'] = 'failure'
        context['message'] = 'Account already exists.'
        return jsonify(**context)

    print("Making it here.")
    cursor.execute('INSERT INTO users (username, password) VALUES(%s, %s)', (content['username'], db_password,))
    db.commit()

    context['account_status'] = 'success'
    context['message'] = 'Account successfully created.'
    return jsonify(**context)
