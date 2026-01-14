import os
import httpx
from flask import Flask, Blueprint, jsonify
from dotenv import load_dotenv
from flask_cors import CORS

from scrapper.parse import parse_exam_table
from scrapper.persist import upsert_modules

load_dotenv()


def scrape_from_env():

    url = os.getenv("TIMETABLE_URL")
    if not url:
        raise RuntimeError("timetable url not found")

    headers = {"User-Agent": "Chrome/139.0.0.0"}

    with httpx.Client(
        headers=headers,
        timeout=30,
        follow_redirects=True,
    ) as client:
        response = client.get(url)
        response.raise_for_status()
        html = response.text

    grouped = parse_exam_table(html)
    stats = upsert_modules(grouped)

    return {"url": url, "stats": stats}


def create_app() -> Flask:
    app = Flask(__name__)
    api = Blueprint("api", __name__, url_prefix="/api")

    @api.get("/health")
    def health():
        return jsonify({"ok": True}), 200

    app.register_blueprint(api)

    try:
        result = scrape_from_env()
        app.logger.info(f"Scrape successful: {result['stats']}")
    except Exception as ex:
        app.logger.error(f"Startup scrape failed: {ex}")

    return app


app = create_app()
CORS(app, resources={r"/api/*": {"origins": "*"}})

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.getenv("PORT", "5000")),
        debug=True,
    )
