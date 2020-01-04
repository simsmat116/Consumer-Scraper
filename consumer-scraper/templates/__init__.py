from flask import Flask

app = Flask(__name__,
 	static_folder = './public',
 	template_folder="./static")

from templates.search.views import search_blueprint

# Register the blueprint
app.register_blueprint(search_blueprint)
