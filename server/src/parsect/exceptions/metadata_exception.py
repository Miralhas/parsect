from parsect.exceptions.business_exception import BusinessException

class MetadataException(BusinessException):
    def __init__(self, message: str):
      self.message = message
      super().__init__(self.message)
  