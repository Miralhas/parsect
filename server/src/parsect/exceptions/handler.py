from fastapi import Request
from fastapi.exceptions import RequestValidationError
from rich.pretty import pprint

from parsect.exceptions.problem_detail import ProblemDetail
from parsect.exceptions.business_exception import BusinessException
from parsect.exceptions.stalkers_exception import StalkersException

async def handle_validation_exception(request: Request, exc: RequestValidationError):
    problem = ProblemDetail(
        title="Invalid Fields",
        status=400,
        detail="One or more fields are invalid. Please fill them in correctly and try again"
    )

    errors = {error["loc"][-1]: error["msg"] for error in exc.errors()}
    problem.set_property("errors", errors)

    return problem.to_response()


async def handle_exception(request: Request, exc: Exception):
    problem = ProblemDetail(
        title="Internal Server Error",
        status=500,
        detail="An unexpected internal system error has occurred. Please try again and if the problem persists, please contact your system administrator"
    )

    return problem.to_response()


async def handle_business_exception(request: Request, exc: BusinessException):
    problem = ProblemDetail(
        title="Invalid Request",
        status=400,
        detail=exc.message
    )

    return problem.to_response()


async def handle_stalkers_exception(request: Request, exc: StalkersException):
    return exc.problem_detail.to_response()