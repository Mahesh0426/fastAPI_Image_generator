from sqlmodel import SQLModel, create_engine, Session
from models import Job, Thumbnail  # noqa: F401  (registers tables on metadata)
from config import DATABASE_URL

# Create the database engine using the DATABASE_URL from config
engine = create_engine(DATABASE_URL, echo=True, connect_args={"check_same_thread": False} )

#create tables in the database
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

# Dependency to get a session for database operations
def get_session():
    with Session(engine) as session:
        yield session
