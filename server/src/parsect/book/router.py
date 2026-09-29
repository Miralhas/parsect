from pathlib import Path
from typing import Annotated

from fastapi import APIRouter, Depends, UploadFile
from parsect.utils.file_manager import save_file
from parsect.book.schemas.book import BookRequest

router = APIRouter()

@router.post("/book")
async def metadata_epub(book: BookRequest):
    return "book"

@router.post("/book/cover")
async def metadata_epub(file: UploadFile):
    output = Path(f'./imgs/{file.filename}')
    await save_file(file, output)
    return file