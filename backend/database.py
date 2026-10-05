import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Define base paths
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
ROOT_DIR = os.path.abspath(os.path.join(BASE_DIR, ".."))
DATABASE_DIR = os.path.join(ROOT_DIR, "database")

# Ensure database directory exists
os.makedirs(DATABASE_DIR, exist_ok=True)

# Database URL from environment or default to SQLite file in database folder
DB_PATH = os.path.join(DATABASE_DIR, "sakhi_setu.db")
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DB_PATH}")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {},
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """Dependency helper to get a DB session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Initializes tables in the database."""
    import models  # Ensure all models are imported before creating tables
    Base.metadata.create_all(bind=engine)
    print("Database tables initialized successfully.")
