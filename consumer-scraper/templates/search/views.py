from flask import render_template, Blueprint

search_blueprint = Blueprint('search', __name__)

@search_blueprint.route('/')
@search_blueprint.route('/hello')
def index():
 return render_template("index.html")
