from pydantic import BaseModel, Field

class Chapter(BaseModel):
    number: int
    title: str
    body: str

class BookRequest(BaseModel):
    title: str
    alias: str | None = None
    author: str
    description: str
    genres: list[str]
    tags: list[str]
    chapters: list[Chapter]