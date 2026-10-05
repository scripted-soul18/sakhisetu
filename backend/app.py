import os
import sys
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add current directory to path
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from database import init_db, SessionLocal
from seed import seed_database
from models import Job
from routes.auth import auth_bp
from routes.profile import profile_bp
from routes.jobs import jobs_bp
from routes.courses import courses_bp
from routes.schemes import schemes_bp
from routes.childcare import childcare_bp
from routes.recommendations import recommendations_bp

def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "sakhi-setu-dev-secret-key-2026")
    app.config["JSON_SORT_KEYS"] = False

    # Enable CORS for frontend clients
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    # Initialize Database and seed if empty
    with app.app_context():
        try:
            init_db()
            db = SessionLocal()
            if db.query(Job).count() == 0:
                print("Database is empty. Running initial seeder...")
                seed_database()
            db.close()
        except Exception as e:
            print(f"Database initialization note: {e}")

    # Register Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(jobs_bp)
    app.register_blueprint(courses_bp)
    app.register_blueprint(schemes_bp)
    app.register_blueprint(childcare_bp)
    app.register_blueprint(recommendations_bp)

    @app.route("/api/health", methods=["GET"])
    def health_check():
        return jsonify({
            "status": "healthy",
            "service": "SakhiSetu Backend API",
            "version": "1.0.0",
            "recommendation_engine": "Rule-Based Smart Matching Active"
        }), 200

    @app.route("/", methods=["GET"])
    def root():
        return jsonify({
            "message": "Welcome to SakhiSetu API - Empowering Single Mothers",
            "docs": "/api/health",
            "status": "online"
        }), 200

    # Friendly Error Handlers
    @app.errorhandler(404)
    def handle_404(e):
        return jsonify({
            "error": "The requested resource was not found.",
            "status_code": 404
        }), 404

    @app.errorhandler(500)
    def handle_500(e):
        return jsonify({
            "error": "An internal server error occurred. Our team has been alerted.",
            "status_code": 500
        }), 500

    return app

app = create_app()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    print(f"Starting SakhiSetu Backend on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=True)
