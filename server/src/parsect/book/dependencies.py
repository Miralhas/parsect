from fastapi import UploadFile

from parsect.epub.constants import ACCEPTED_IMAGE_MEDIA_TYPES
from parsect.exceptions.invalid_content_type_exception import InvalidContentType

async def valid_image_media_type(file: UploadFile) -> UploadFile:
    if file.content_type not in ACCEPTED_IMAGE_MEDIA_TYPES:
        raise InvalidContentType(message=f"Invalid content type. Accepted types are: {ACCEPTED_IMAGE_MEDIA_TYPES}")

    return file