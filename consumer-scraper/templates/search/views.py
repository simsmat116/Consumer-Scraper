from templates import app
from flask import render_template
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


@app.route('/')
@app.route('/hello')
def index():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT product, price FROM results")
    print(cursor.fetchall())
    return render_template("index.html")
