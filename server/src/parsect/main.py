from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from starlette.middleware.cors import CORSMiddleware

from parsect.epub import router as epub
from parsect.book import router as book
from parsect.exceptions.business_exception import BusinessException
from parsect.exceptions.stalkers_exception import StalkersException
from parsect.exceptions.business_exception import BusinessException
from parsect.exceptions.handler import (
  handle_business_exception,
  handle_exception,
  handle_stalkers_exception,
  handle_validation_exception,
)

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

app.add_exception_handler(BusinessException, handle_business_exception)
app.add_exception_handler(StalkersException, handle_stalkers_exception)
app.add_exception_handler(RequestValidationError, handle_validation_exception)
app.add_exception_handler(Exception, handle_exception)
