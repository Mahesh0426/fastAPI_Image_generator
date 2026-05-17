from fastapi import Depends ,FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import create_db_and_tables
from routes import router

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(
    title="Thumbnail Generator API",
    description="API for generating thumbnails based on user prompts and headshots.",
    lifespan= lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","http://localhost:5174"],
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], 
    allow_headers=["Content-Type", "Authorization", "Accept", "X-Requested-With"],
    allow_credentials=True,
    )

@app.get("/")
async def root():
    return {"message": "FastAPI is running!"}

app.include_router(router)

# use this  cmd if you want to add bwlow  python main.py
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)
