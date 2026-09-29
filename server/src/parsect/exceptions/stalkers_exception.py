from parsect.exceptions.problem_detail import ProblemDetail

class StalkersException(Exception):
    problem_detail: ProblemDetail

    def __init__(self, problem: ProblemDetail):
        self.problem_detail = problem
        super().__init__(problem.detail)
