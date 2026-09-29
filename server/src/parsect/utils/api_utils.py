def check_if_is_problem_detail(json: dict) -> bool:
  if json.get('detail') and json.get('title') and json.get('status'):
    return True
  return False