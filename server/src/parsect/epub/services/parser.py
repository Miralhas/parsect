import tempfile

from fastapi import UploadFile

from parsect.epub.scripts.parser.chapter_extractor import chapter_extractor

async def parser(file: UploadFile):
    with tempfile.NamedTemporaryFile(suffix=".epub") as tmp:
        tmp.write(await file.read())
        tmp.flush()

        chapters = chapter_extractor(tmp.name)
    
    return chapters

