from parsect.epub.exceptions import MetadataException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.remote.webdriver import WebDriver

def check_not_found(driver: WebDriver, source_id: str):
    WebDriverWait(driver, 2).until(lambda d: d.title.strip() != "")
    if "NOT FOUND" in driver.title.upper():
        raise MetadataException(detail=f"Source Id: '{source_id}' is invalid")