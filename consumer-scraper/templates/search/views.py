from templates import app
from flask import render_template, request, jsonify
from templates.search import scraper
import mysql.connector

def get_db():
    # Establish connection to consumer_scraper database
    db = mysql.connector.connect(
      host=app.config['MYSQL_HOST'],
      user=app.config["MYSQL_USER"],
      passwd=app.config["MYSQL_PASSWORD"],
      database=app.config["MYSQL_DB"]
    )
    return db

@app.route('/api/search', methods=['GET'])
def get_search_results():
    search = request.args.get('q')
    db = get_db()
    cursor = db.cursor()
    # Query the database to see if there are existing records
    cursor.execute("SELECT product, price FROM results WHERE search = (%s)", (search,))
    row_headers=[x[0] for x in cursor.description]
    results = cursor.fetchall()
    if not results:
        results = scraper.scrape_search_results(search, db)

    json_data = []
    for result in results:
        json_data.append(dict(zip(row_headers,result)))

    return jsonify(json_data)
