import os
import unittest
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlparse


SITE_DIR = Path(os.environ.get("SITE_DIR", "_site"))
BASEURL = "/preview"
FEATURED_PATH = "/2026/05/15/timeless-principles-1-dependency-inversion-in-ai-agents.html"
OLDER_PATH = "/2025/09/07/the-age-of-professionalism.html"
IMAGE_PATH = "/assets/images/dependency-inversion-in-ai-agents.jpg"


class PageElements(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.images = []
        self.stylesheets = []
        self.regions = []
        self.text = []

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        if tag == "a":
            self.links.append(attributes.get("href", ""))
        if tag == "img":
            self.images.append(attributes)
        if tag == "link" and attributes.get("rel") == "stylesheet":
            self.stylesheets.append(attributes.get("href", ""))
        if tag in ("header", "footer", "nav"):
            self.regions.append(attributes.get("class", ""))

    def handle_data(self, data):
        self.text.append(data)


def page_elements(path):
    page = PageElements()
    page.feed((SITE_DIR / path).read_text())
    return page


def local_file(url):
    path = unquote(urlparse(url).path)
    if not path.startswith(BASEURL + "/"):
        raise AssertionError(f"URL is not relative to the site's baseurl: {url}")
    return SITE_DIR / path[len(BASEURL) + 1 :]


class RenderedSiteTest(unittest.TestCase):
    def test_home_links_to_featured_article(self):
        home = page_elements("index.html")

        featured_link = BASEURL + FEATURED_PATH

        self.assertIn(featured_link, home.links)
        self.assertTrue(local_file(featured_link).is_file())

    def test_home_keeps_older_article_accessible(self):
        home = page_elements("index.html")

        older_link = BASEURL + OLDER_PATH

        self.assertIn(older_link, home.links)
        self.assertTrue(local_file(older_link).is_file())

    def test_featured_image_is_accessible_on_home_and_article(self):
        home = page_elements("index.html")
        article = page_elements(FEATURED_PATH.lstrip("/"))

        image_url = BASEURL + IMAGE_PATH

        self.assertTrue(local_file(image_url).is_file())
        for page in (home, article):
            self.assertTrue(any(image.get("src") == image_url and image.get("alt") for image in page.images))

    def test_featured_card_shows_article_context(self):
        home = page_elements("index.html")

        visible_text = " ".join(home.text)

        self.assertIn("Timeless principles", visible_text)
        self.assertIn("an AI agent depends on a stable contract", visible_text)

    def test_every_page_has_shared_navigation_and_footer(self):
        pages = ("index.html", FEATURED_PATH.lstrip("/"), OLDER_PATH.lstrip("/"))

        rendered_pages = [page_elements(path) for path in pages]

        for page in rendered_pages:
            self.assertIn("site-header", page.regions)
            self.assertIn("site-nav", page.regions)
            self.assertIn("site-footer h-card", page.regions)
            self.assertIn(BASEURL + "/", page.links)

    def test_every_page_loads_an_existing_stylesheet(self):
        pages = ("index.html", FEATURED_PATH.lstrip("/"), OLDER_PATH.lstrip("/"))

        stylesheets = [page_elements(path).stylesheets for path in pages]

        for stylesheet_links in stylesheets:
            self.assertTrue(stylesheet_links)
            self.assertTrue(local_file(stylesheet_links[0]).is_file())


if __name__ == "__main__":
    unittest.main()
