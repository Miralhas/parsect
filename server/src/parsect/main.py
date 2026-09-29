from fastapi import FastAPI
from parsect.epub import router as epub
from parsect.book import router as book
from starlette.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      
    allow_credentials=False,  
    allow_methods=["*"],     
    allow_headers=["*"],
)

app.include_router(epub.router)
app.include_router(book.router)
