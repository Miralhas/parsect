import tempfile

from fastapi import UploadFile

from parsect.book.schemas import Book
from parsect.scripts.client import client

def upload_book(book: Book):
  return client.book_request(book)

async def upload_cover(file: UploadFile, slug: str):
   suffix = file.content_type.split('/')[-1]
   with tempfile.NamedTemporaryFile(suffix=f'.{suffix}') as tmp:
        tmp.write(await file.read())
        tmp.flush()

        return client.novel_cover(tmp.name, slug, file.content_type)