from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel, Field

class Book(BaseModel):
    title: str = Field(min_length=1) 
    description: str = Field(min_length=1) 
    alias: str | None = Field(default=None)
    author: str = Field(min_length=1) 
    genres: list[str] = Field(min_length=1) 
    tags: list[str] = Field(min_length=1) 
    chapters: list[dict] = Field(min_length=1) 

    def serializable_dict(self, **kwargs):
        """Return a dict which contains only serializable fields."""
        default_dict = self.model_dump()

        return jsonable_encoder(default_dict)


class Chapter(BaseModel):
    number: int
    title: str
    body: str
