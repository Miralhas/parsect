from pydantic import BaseModel

class Chapter(BaseModel):
    title: str | None
    body: str


class ParserResponse(BaseModel):
    chapters: list[Chapter]
