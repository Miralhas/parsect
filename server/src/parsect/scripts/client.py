import json
from typing import ClassVar, Dict
from rich import print
from pathlib import Path

import requests

from parsect.config import settings
from parsect.utils.api_utils import check_if_is_problem_detail
from parsect.book.schemas import Book
from parsect.exceptions.business_exception import BusinessException
from parsect.exceptions.stalkers_exception import StalkersException
from parsect.exceptions.problem_detail import ProblemDetail

TIMEOUT = 60 * 2.5 # 2 and 1/2 Minutes

def create_problem_detail(json: dict) -> ProblemDetail: 
    problem = ProblemDetail(
        title=json["title"],
        detail=json["detail"],
        status=json["status"],
    )
    if json.get("errors", None):
        problem.set_property("errors", json["errors"])
    
    return problem

class Client():
    base_url: ClassVar[str]

    def __init__(self):
        self.base_url = settings.STALKERS_URL

    def __post_book(self, book: Book):
        url = f"{self.base_url}/novels"
        headers = {
            settings.ROBOT_HEADER: settings.ROBOT_SECRET,
            "Content-Type": "application/json",
        }

        data = json.dumps(book.serializable_dict())

        return requests.post(url=url, headers=headers, data=data, timeout=TIMEOUT)

    def __put_cover(self, novel_slug: str, cover: Path, content_type: str):
        url = f"{self.base_url}/novels/{novel_slug}/image"
        suffix = content_type.split('/')[-1]

        files = [
            ('file',(f'{novel_slug}_cover.{suffix}', open(cover, 'rb'), content_type))
        ]
        payload = {'description': f'{novel_slug} cover'}
        headers = {settings.ROBOT_HEADER: settings.ROBOT_SECRET}

        return requests.put(url, headers = headers, files=files, data=payload, timeout=TIMEOUT)


    def novel_cover(self, cover: Path, novel_slug: str, content_type: str):
        try:
            r = self.__put_cover(cover=cover, novel_slug=novel_slug, content_type=content_type)
            r.raise_for_status()

            return r.json()

        except requests.HTTPError:
            ex_json = r.json()
            if (check_if_is_problem_detail(ex_json)):
                problem = create_problem_detail(ex_json)
                raise StalkersException(problem=problem)
            raise BusinessException(message=f"Failed to send request: {r.json()}")

    def book_request(self, data: Book):        
        try:
            if not data:
                raise BusinessException(message="Book cannot be empty")
            r = self.__post_book(data)
            r.raise_for_status()

            book_info: Dict = r.json()

            return book_info
        except requests.HTTPError:
            ex_json = r.json()
            if (check_if_is_problem_detail(ex_json)):
                problem = create_problem_detail(ex_json)
                raise StalkersException(problem=problem)
            raise BusinessException(message=f"Failed to send request: {r.json()}")

client = Client()