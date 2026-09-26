from fastapi import UploadFile
from pathlib import Path 

import aiofiles
import aiofiles.os


async def save_file(file: UploadFile, output_path: Path):
    async with aiofiles.open(output_path, 'wb') as out_file:
        content = await file.read()
        await out_file.write(content)

async def remove_file(path: Path):
    await aiofiles.os.remove(path)