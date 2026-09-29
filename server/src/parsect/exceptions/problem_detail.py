from typing import Any

from pydantic import BaseModel, ConfigDict

class ProblemDetail(BaseModel):
    model_config = ConfigDict(
        extra="allow",
    )
    title: str 
    status: int 
    detail: str 

    def set_property(self, name: str, value: Any) -> "ProblemDetail":
        setattr(self, name, value)
        return self

    def to_response(self):
        from fastapi.responses import JSONResponse

        if self.status is None:
            raise ValueError(
                "ProblemDetail.status must be set before creating a response"
            )

        return JSONResponse(
            status_code=self.status,
            content=self.model_dump(exclude_none=True),
            media_type="application/problem+json",
        )

