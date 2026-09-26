from typing import Any

from fastapi import HTTPException, status

class DetailedHTTPException(HTTPException):
    STATUS_CODE = status.HTTP_500_INTERNAL_SERVER_ERROR
    DETAIL = "Server error"

    def __init__(self, detail: str, **kwargs: dict[str, Any]) -> None:
        super().__init__(status_code=self.STATUS_CODE, detail=detail or self.DETAIL, **kwargs)


class MetadataException(DetailedHTTPException):
    STATUS_CODE = status.HTTP_400_BAD_REQUEST
    DETAIL = "Failed to extract source metadata"

    def __init__(self, detail: str = None, **kwargs: dict[str, Any]) -> None:
        super().__init__(detail=detail or self.DETAIL, **kwargs)


class InvalidContentType(DetailedHTTPException):
    STATUS_CODE = status.HTTP_400_BAD_REQUEST
    DETAIL = "Invalid content type"

    def __init__(self, detail: str = None, **kwargs: dict[str, Any]) -> None:
        super().__init__(detail=detail or self.DETAIL, **kwargs)