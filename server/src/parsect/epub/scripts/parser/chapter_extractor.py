from pathlib import Path

from ebooklib import epub, ITEM_DOCUMENT
from ebooklib.epub import Link, Section
from bs4 import BeautifulSoup
import nh3

ALLOWED_TAGS = nh3.ALLOWED_TAGS - {'div', 'strong', 'a', 'img', 'article', 'section', 'header', "b"}

HEADING = {"h1", "h2"}

def get_chapter_title(html: str):
    soup = BeautifulSoup(html, "html.parser")
    title = None

    for tag in soup.find_all():
        if tag.name in HEADING:
          title = tag.text
    
    return title

def sanitize(body):
  soup = BeautifulSoup(body, "html.parser")
  
  for tag in soup.find_all():
    if tag.name in HEADING:
      tag.decompose()

  clean_html = nh3.clean(str(soup), tags=ALLOWED_TAGS, attribute_filter=None)

  clean_html = (
    clean_html
    .replace('"', "&quot;")
    .replace("'", "&#39;")
    .replace("\n", " ")
  )
  
  return clean_html

def walk_toc(entries):
    toc_map = {}
    for entry in entries:
        if isinstance(entry, Link):
            toc_map[entry.href.split("#")[0]] = entry.title
        elif isinstance(entry, Section):
            if entry.href:
                toc_map[entry.href.split("#")[0]] = entry.title
        elif isinstance(entry, tuple):
            walk_toc(entry)
    return toc_map


def chapter_extractor(epub_path: Path) -> list:
  book = epub.read_epub(epub_path)
  toc_map = walk_toc(book.toc)
  result = []
  
  for item in book.get_items_of_type(ITEM_DOCUMENT):
    body = sanitize(item.get_content()).strip()
    if (len(body)):
      filename = item.get_name()
      title = toc_map.get(filename)
      result.append({
        "title": title or get_chapter_title(item.get_content().decode('utf-8')),
        "body": body,
      })

  return result
