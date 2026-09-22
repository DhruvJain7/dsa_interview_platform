import json
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Agentic DSA Interview Platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# problems dataset
PROBLEMS_FILE = Path(__file__).parent.parent/"data"/"problems.json"

def load_problems():
    with open(PROBLEMS_FILE,"r",encoding = "utf-8") as file:
        return json.load(file)

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/problems")
def get_problems():
    return load_problems()
