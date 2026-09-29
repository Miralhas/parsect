from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel, Field

class Book(BaseModel):
    title: str
    description: str
    alias: str | None = Field(default=None)
    author: str
    genres: list[str]
    tags: list[str]
    chapters: list[dict]

    def serializable_dict(self, **kwargs):
        """Return a dict which contains only serializable fields."""
        default_dict = self.model_dump()

        return jsonable_encoder(default_dict)


class Chapter(BaseModel):
    number: int
    title: str
    body: str
