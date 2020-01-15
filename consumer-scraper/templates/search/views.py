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
    offset = (int(page) - 1) * 10
    db = get_db()
    cursor = db.cursor()
    # Query the database to see if there are existing records
    cursor.execute("""SELECT product_name, price FROM results WHERE search = %s ORDER BY price
                      LIMIT 10 OFFSET %s""", (search, offset))
    row_headers=[x[0] for x in cursor.description]
    results = cursor.fetchall()
    # If no results in the database, scrape Google Shopping
    if not results:
        results = scraper.scrape_search_results(search, db)

    context = { "results": [] }
    for result in results:
        context["results"].append({
            "product_desc": result[0],
            "price": result[1]
        })

    cursor.execute("SELECT COUNT(*) FROM results WHERE search = %s", (search,))
    num_records = cursor.fetchone()[0]

    context["num_pages"] = math.ceil(int(num_records) / 10)

    return jsonify(**context)
