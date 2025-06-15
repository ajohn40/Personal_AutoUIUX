from flask import Flask, send_from_directory
from flask_cors import CORS
import os

# Directory containing the uploaded files
CONTENT_FOLDER = 'web_content/devportfolio/devportfolio'
os.makedirs(CONTENT_FOLDER, exist_ok=True)

app = Flask(__name__, static_folder=CONTENT_FOLDER, static_url_path='')

# Enable CORS
CORS(app)

@app.route('/')
def index():
    try:
        print(f"Attempting to serve index.html from {CONTENT_FOLDER}")
        return send_from_directory(CONTENT_FOLDER, 'index.html')
    except FileNotFoundError:
        print("ERROR: index.html not found")
        return "Server is running. Upload files to see them here.", 200

@app.route('/<path:path>')
def static_file(path):
    print(f"Attempting to serve: {path}")
    return send_from_directory(CONTENT_FOLDER, path)

if __name__ == '__main__':
    print(f"Hosting uploaded files from: {CONTENT_FOLDER}")
    print("\nCurrent files in directory:")
    for root, dirs, files in os.walk(CONTENT_FOLDER):
        for file in files:
            print(f"- {os.path.join(root, file)}")
    print("\n Server will be available at: http://localhost:8002")
    print("🔧 CORS enabled for cross-origin requests")
    app.run(host='0.0.0.0', port=8002, debug=True) 