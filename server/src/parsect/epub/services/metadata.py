from parsect.epub.scripts.metadata.sources.abstract_source import AbstractSource 

async def extract_metadata(source: AbstractSource):
    metadata = source.extract_metadata()
    return metadata