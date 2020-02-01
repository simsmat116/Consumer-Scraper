from templates import app
from flask import render_template, request, jsonify
from templates.search import scraper
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
def home_page():
    return render_template('index.html')

@app.route('/search')
def search_page():
    return render_template('index.html')

@app.route('/api/search', methods=['GET'])
def get_search_results():
    search = request.args.get('q')
    page = request.args.get('p')
    offset = (int(page) - 1) * 8
    db = get_db()
    cursor = db.cursor()
    # Query the database to see if there are existing records
    cursor.execute("""SELECT * FROM results WHERE search = %s ORDER BY price LIMIT 8 OFFSET %s""", (search, offset))
    results = cursor.fetchall()
    # If no results in the database, scrape Google Shopping
    if not results:
        results = scraper.scrape_search_results(search, db)

    context = { "results": [] }
    for result in results:
        context["results"].append({
            "product_name": result[2],
            "price": result[1],
            "image_link": result[5],
            "product_link": result[4],
            "product_id": result[3]
        })

    cursor.execute("SELECT COUNT(*) FROM results WHERE search = %s", (search,))
    num_records = cursor.fetchone()[0]

    context["num_pages"] = math.ceil(int(num_records) / 8)

    return jsonify(**context)

@app.route('/api/popular-products/<int:product_id>', methods=['POST'])
def update_product_vistits(product_id):
    db = get_db()
    cursor = db.cursor()
    # Check the popular_products table to see if the product exists
    cursor.execute("SELECT num_visits FROM popular_products WHERE product_id = %s", (product_id))
    record = cursor.fetchone()

    if not record:
        cursor.execute("INSERT INTO popular_products(product_id, num_vists) VALUES(%s, %s)", (product_id, 1))
    else:
        updated_visits = record[0] + 1
        cursor.execute("UPDATE popular_products SET num_vists = %s WHERE product_id = %s", (updated_visits, product_id))

    db.commit()

    return
