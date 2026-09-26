from fastapi import UploadFile

from parsect.epub.constants import ACCEPTED_MEDIA_TYPES
from parsect.epub.exceptions import InvalidContentType

async def valid_file_media_type(file: UploadFile) -> UploadFile:
    if file.content_type not in ACCEPTED_MEDIA_TYPES:
        raise InvalidContentType(detail=f"Invalid content type. Accepted types are: {ACCEPTED_MEDIA_TYPES}")

    return file