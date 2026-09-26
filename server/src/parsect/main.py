from fastapi import FastAPI
from parsect.epub import router as epub

app = FastAPI()

app.include_router(epub.router)