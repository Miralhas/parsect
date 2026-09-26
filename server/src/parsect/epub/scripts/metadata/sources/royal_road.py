import logging
from typing import Literal

from rich import print
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from parsect.epub.scripts.metadata.sources.abstract_source import AbstractSource
from parsect.epub.scripts.metadata.sources.constants import GENRES 
from parsect.epub.exceptions import MetadataException
from parsect.epub.scripts.metadata.utils import check_not_found


class RoyalRoadSource(AbstractSource):
    def __init__(self, source_id: str):
        super().__init__(source_id=source_id)

    @property
    def base_url(self) -> Literal["https://www.royalroad.com/fiction/"]:
        return "https://www.royalroad.com/fiction/"
    
    def extract_metadata(self):
        logging.info("Starting metadata extraction...")
        
        opts = webdriver.FirefoxOptions()
        opts.add_argument("-headless")

        driver = webdriver.Firefox(options=opts)

        metadata = {}
        try:
            driver.get(self.url)

            check_not_found(driver, self.source_id)

            wait = WebDriverWait(driver, 60)

            # Main container
            wait.until(EC.presence_of_element_located((By.XPATH, "/html/body/div[3]/div/div/div/div[1]/div")))

            image_fallback = driver.find_element(By.XPATH, '/html/body/div[3]/div/div/div/div[1]/div/div[1]/div[1]/div/img')
            image_b64 = image_fallback.screenshot_as_base64

            raw_description = driver.find_element(By.CSS_SELECTOR, "div.hidden-content").get_attribute("innerHTML").strip()
            description = self.clean_html(raw_description)

            raw_status = driver.find_element(By.XPATH, "/html/body/div[3]/div/div/div/div[1]/div/div[2]/div/div[2]/div[1]/div[2]/div[1]/span[2]").text.strip()
            status = "COMPLETED" if raw_status == "COMPLETED" else "ON_GOING"

            title = driver.find_element(By.XPATH, "/html/body/div[3]/div/div/div/div[1]/div/div[1]/div[2]/div/h1").text

            author = driver.find_element(By.XPATH, "/html/body/div[3]/div/div/div/div[1]/div/div[1]/div[2]/div/h4/span[2]/a").text

            description = self.clean_html(raw_description)

            status = "COMPLETED" if raw_status == "COMPLETED" else "ON_GOING"

            try:
                # To show all tags, this button needs to be clicked
                show_tags_button = driver.find_element(By.XPATH, "/html/body/div[3]/div/div/div/div[1]/div/div[2]/div/div[2]/div[1]/div[2]/div[1]/span[3]/label")
                show_tags_button.click()
            except Exception as e:
                logging.warning(f"Failed to click show tags button: {e}")

            tags_container = driver.find_elements(By.CSS_SELECTOR, "a.fiction-tag")

            tags = []
            genres = []

            for tag_element in tags_container:
                tag = tag_element.text.lower().strip()
                if (tag in GENRES):
                    genres.append(tag)
                else:
                    tags.append(tag)

            try:
                image_src = image_fallback.get_attribute("src")
                
                driver.get(image_src)

                image_b64 = driver.find_element(By.TAG_NAME, "img").screenshot_as_base64
            except Exception as e:
                logging.warning(f"Failed to get image from source: {e}")
                pass
            
            metadata.update({
                "title": title.lower().strip(),
                "author": author.strip(),
                "status": status,
                "description": description,
                "genres": genres,
                "tags": tags,
                "image_b64": image_b64
            })

            return metadata

        except MetadataException as MeX:
            raise MeX
        except Exception as e:
            logging.error(f"Failed to process metadata: {e}")
            raise MetadataException()
        finally:
            logging.info("Finished metadata extraction...")
            driver.quit()