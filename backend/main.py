from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.api.routes import complaints

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AIVIO Copilot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(complaints.router, prefix="/api/complaints", tags=["complaints"])

@app.get("/")
def read_root():
    return {"message": "AIVIO Copilot Backend is running"}
