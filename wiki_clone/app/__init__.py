from flask import Flask
import os

def create_app():
    app = Flask(__name__)

    from . import routes
    routes.init_app(app)

    # Create DB if needed
    from .db import init_db
    if not os.path.exists('wiki.db'):
        init_db()

    return app

