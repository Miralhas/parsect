from fastapi import APIRouter, Depends, UploadFile
from parsect.book.schemas import Book
from parsect.book import service
from parsect.book.dependencies import valid_image_media_type

router = APIRouter()

@router.post("/book")
async def post_book(book: Book):
    res = service.upload_book(book)
    return res


@router.post("/book/{slug}/cover")
async def post_book(
    slug: str,
    file: UploadFile = Depends(valid_image_media_type),
):
    res = await service.upload_cover(file, slug)
    return res