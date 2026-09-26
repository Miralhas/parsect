from abc import ABC, abstractmethod
from typing import ClassVar, Dict

import nh3
from bs4 import BeautifulSoup

ALLOWED_TAGS = nh3.ALLOWED_TAGS - {'div', 'strong', 'a', 'img'}

class AbstractSource(ABC):
    source_id = ClassVar[str]

    def __init__(self, source_id: str):
        self.source_id = source_id

    @property
    @abstractmethod
    def base_url(self) -> str:
        pass

    @property
    def url(self) -> str:
        return self.base_url + self.source_id

    @abstractmethod
    def extract_metadata(self) -> Dict | None:
        pass

    def format_metadata(self, metadata_dict: Dict) -> None:
        pass

    def clean_html(self, html: str) -> str:
        """format and clean given html

        Args:
            html (str): html to be cleaned / formatted

        Returns:
            str: formatted html
        """

        html = nh3.clean(html, tags=ALLOWED_TAGS)
        soup = BeautifulSoup(html, "html.parser")

        for tag in soup.find_all():
            if "class" in tag.attrs:
                del tag["class"]

        final_html = (
            str(html).replace('"', "&quot;").replace("'", "&#39;").replace("\n", "")
        )

        return final_html

    def __str__(self):
        return f"{self.__class__.__name__}({self.__dict__})"
