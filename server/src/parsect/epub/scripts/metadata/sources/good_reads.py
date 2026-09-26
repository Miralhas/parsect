import logging
from pathlib import Path
from typing import ClassVar, Literal

from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from parsect.utils.json_manager import load_json
from parsect.epub.scripts.metadata.sources.abstract_source import AbstractSource
from parsect.epub.scripts.metadata.sources.constants import GENRES 
from parsect.epub.exceptions import MetadataException
from parsect.epub.scripts.metadata.utils import check_not_found


class GoodReadsSource(AbstractSource):
    blacklisted_genres: ClassVar[list[str]]
    tags_mapper: ClassVar[list[dict]]

    def __init__(self, source_id: str):
        super().__init__(source_id=source_id)
        self.blacklisted_genres = load_json(Path("src/parsect/utils/goodreads_tags_map.json"))["blacklist"]
        self.tags_mapper = load_json(Path("src/parsect/utils//goodreads_tags_map.json"))["mapper"]
        

    @property
    def base_url(self) -> Literal["https://www.goodreads.com/book/show/"]:
        return "https://www.goodreads.com/book/show/"
    
    def format_metadata(self, metadata_dict: dict):
        """formats given dict to stalkers-api standards
        Args:
            metadata_dict (Dict): dict containing metadata retrieved through selenium
        """
        genres_and_tags = metadata_dict["genres_and_tags"]
        
        genres_and_tags = [genre for genre in genres_and_tags if genre not in self.blacklisted_genres]
        genres_and_tags = [self.tags_mapper[genre] if genre in self.tags_mapper.keys() else genre for genre in genres_and_tags]

        genres = [genre for genre in genres_and_tags if genre in GENRES]
        genres.append("book")

        metadata_dict["genres"] = genres
        metadata_dict["tags"] = genres_and_tags

        del metadata_dict["genres_and_tags"]

    def extract_metadata(self):
        logging.info("Starting metadata extraction...")

        opts = webdriver.FirefoxOptions()
        opts.add_argument("-headless")

        driver = webdriver.Firefox(options=opts)
        
        metadata = {}
        try:
            driver.get(self.url)

            check_not_found(driver, self.source_id)

            wait = WebDriverWait(driver, 10)

            try:
                wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "div.Overlay__close")))
                overlay = driver.find_element(By.CSS_SELECTOR, "div.Overlay__close button")
                overlay.click()
            except:
                pass

            image_fallback = driver.find_element(By.CSS_SELECTOR, 'div.BookCover__image img')
            image_src = image_fallback.get_attribute("src")
            image_b64 = image_fallback.screenshot_as_base64

            try:
                show_all_genres_btn = driver.find_element(By.CSS_SELECTOR, "div.BookPageMetadataSection__genres div.Button__container button")
                show_all_genres_btn.click()

                wait.until(
                    EC.presence_of_all_elements_located(
                        (By.CSS_SELECTOR, "span.BookPageMetadataSection__genreButton a span")
                    )
                )

                genres_container = driver.find_elements(By.CSS_SELECTOR, "span.BookPageMetadataSection__genreButton a span")
                genres_and_tags = [genre.text.strip().lower() for genre in genres_container]
            except:
                pass

            title = driver.find_element(By.CSS_SELECTOR, "div.BookPageTitleSection__title h1").text
            author = driver.find_element(By.CSS_SELECTOR, "span.ContributorLink__name").text
            description = driver.find_element(By.CSS_SELECTOR, "div.DetailsLayoutRightParagraph__widthConstrained span").get_attribute("outerHTML").strip()
            status = "COMPLETED"

            try:
                alias = driver.find_element(By.CSS_SELECTOR, "div.BookPageTitleSection__title h3").text
            except NoSuchElementException as e:
                logging.warning(f"Failed to get book alias: {e}")

            try:
                driver.get(image_src)
                image_b64 = driver.find_element(By.TAG_NAME, "img").screenshot_as_base64
            except Exception as e:
                logging.warning(f"Failed to get image from source: {e}")
                pass

            metadata.update(
                {
                    "title": title.lower().strip(),
                    "author": author.strip(),
                    "status": status,
                    "description": self.clean_html(description),
                    "genres_and_tags": genres_and_tags,
                    "alias": alias,
                    "image_b64": image_b64
                }
            )

            self.format_metadata(metadata_dict=metadata)

            return metadata

        except MetadataException as MeX:
            raise MeX
        except Exception as e:
            logging.error(f"Failed to process metadata: {e}")
            raise MetadataException(detail=f"Failed to process metadata: {e}")
        finally:
            logging.info("Finished metadata extraction...")
            driver.quit()
