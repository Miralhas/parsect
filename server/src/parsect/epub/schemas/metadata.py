from enum import StrEnum
from pydantic import BaseModel, Field

from parsect.epub.scripts.metadata.sources import good_reads, royal_road


class MetadataSourceEnum(StrEnum):
    GOODREADS = "GOODREADS"
    ROYALROAD = "ROYALROAD"


class MetadataRequest(BaseModel):
    source: MetadataSourceEnum
    source_id: str = Field(min_length=1, max_length=128)

    def get_source(self):
        match self.source:
            case MetadataSourceEnum.GOODREADS:
                return good_reads.GoodReadsSource(source_id=self.source_id)
            case MetadataSourceEnum.ROYALROAD:
                return royal_road.RoyalRoadSource(source_id=self.source_id)
