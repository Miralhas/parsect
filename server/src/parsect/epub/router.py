from pathlib import Path
from typing import Annotated

from fastapi import APIRouter, UploadFile, Depends

from parsect.epub.services.parser import parser
from parsect.utils.file_manager import save_file
from parsect.epub.schemas.metadata import MetadataRequest
from parsect.epub.dependencies import valid_epub_media_type

router = APIRouter()

@router.post("/epub/parse")
async def parse_epub(file: UploadFile = Depends(valid_epub_media_type)):
    print(file)
    chapters = await parser(file)
    return chapters


@router.post("/epub/metadata/{source}/{source_id:path}")
async def metadata_epub(request: Annotated[MetadataRequest, Depends()],):
    source = request.get_source()
    metadata = source.extract_metadata()
    return metadata
