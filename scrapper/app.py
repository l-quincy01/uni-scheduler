import os
import httpx
from flask import Flask, Blueprint, request, jsonify
from dotenv import load_dotenv
from flask_cors import CORS

from scrapper.parse import parse_exam_table
from scrapper.persist import upsert_modules
from db import modules_coll

load_dotenv()


def create_app() -> Flask:
    app = Flask(__name__)
    api = Blueprint("api", __name__, url_prefix="/api")

    @api.get("/health")
    def health():
        return jsonify({"ok": True}), 200

    @api.get("/modules")
    def list_modules():
        docs = list(modules_coll.find({}, {"_id": 0}))
        return jsonify(docs), 200

    @api.get("/modules/<category>")
    def get_category(category: str):
        doc = modules_coll.find_one(
            {"category": {"$regex": f"^{category}$", "$options": "i"}},
            {"_id": 0},
        )
        if not doc:
            return jsonify({"message": "Category not found"}), 404
        return jsonify(doc), 200

    @api.post("/ingest-html")
    def ingest_html():
        """
        Accepts HTML via:
          - multipart form-data: field name 'html'
          - raw text/html body
        Parses per rules, groups by Department, upserts into Mongo,
        and returns the grouped JSON + simple stats.
        """
        if "html" in request.files:
            html = request.files["html"].read().decode("utf-8", "replace")
        else:
            html = request.get_data(as_text=True)

        if not html:
            return jsonify({"error": "No HTML provided"}), 400

        try:
            grouped = parse_exam_table(html)
            stats = upsert_modules(grouped)
            return jsonify({"stats": stats, "data": grouped}), 200
        except Exception as ex:
            return jsonify({"error": str(ex)}), 500

    @api.post("/scrape-url")
    def scrape_url():
        """
        Scrape a specific URL once: POST /api/scrape-url?url=https://...
        """
        url = request.args.get("url")
        if not url:
            return jsonify({"error": "Provide ?url=https://..."}), 400

        headers = {"User-Agent": "Chrome/139.0.0.0"}
        try:
            with httpx.Client(headers=headers, timeout=30, follow_redirects=True) as c:
                r = c.get(url)
                r.raise_for_status()
                html = r.text

            grouped = parse_exam_table(html)
            stats = upsert_modules(grouped)
            return jsonify({"url": url, "stats": stats, "data": grouped}), 200
        except httpx.HTTPError as http_err:
            return jsonify({"error": f"HTTP error: {http_err}"}), 502
        except Exception as ex:
            return jsonify({"error": str(ex)}), 500

    @api.post("/scrape-latest")
    def scrape_latest():
        """
        Scrape the URL configured in .env (SCRAPE_SOURCE_URL) once.
        """
        url = os.getenv("SCRAPE_SOURCE_URL")
        if not url:
            return jsonify({"error": "SCRAPE_SOURCE_URL not set"}), 400

        headers = {"User-Agent": "ExamSchedulerBot/1.0 (+contact@example.com)"}
        try:
            with httpx.Client(headers=headers, timeout=30, follow_redirects=True) as c:
                r = c.get(url)
                r.raise_for_status()
                html = r.text

            grouped = parse_exam_table(html)
            stats = upsert_modules(grouped)
            return jsonify({"url": url, "stats": stats, "data": grouped}), 200
        except httpx.HTTPError as http_err:
            return jsonify({"error": f"HTTP error: {http_err}"}), 502
        except Exception as ex:
            return jsonify({"error": str(ex)}), 500

    app.register_blueprint(api)

    try:
        from scheduler import start_scheduler  # noqa: WPS433

        start_scheduler()
    except Exception:

        pass

    return app


app = create_app()
CORS(app, resources={r"/api/*": {"origins": "*"}})
if __name__ == "__main__":

    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "5000")), debug=True)
