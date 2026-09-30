from parsect.exceptions.metadata_exception import MetadataException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.remote.webdriver import WebDriver

def check_not_found(driver: WebDriver, source_id: str):
    WebDriverWait(driver, 10).until(lambda d: d.title.strip() != "")
    if "NOT FOUND" in driver.title.upper():
        raise MetadataException(message=f"Source Id: '{source_id}' is invalid")