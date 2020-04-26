from quart import Quart

app = Quart(__name__,
 	static_folder = './public',
 	template_folder="./static")

import templates.search.views
