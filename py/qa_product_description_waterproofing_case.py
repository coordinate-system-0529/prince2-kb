# -*- coding: utf-8 -*-
"""验证卫生间防水系统产品描述页面及三个跨页入口。"""

import argparse
import json
import sys
from pathlib import Path
from urllib.parse import urljoin

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By


sys.stdout.reconfigure(encoding="utf-8")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--url",
        default="http://127.0.0.1:8000/cases/product-description-waterproofing.html",
    )
    parser.add_argument(
        "--screenshot",
        default="cases/product-description-waterproofing-case-qa.png",
    )
    parser.add_argument(
        "--chrome",
        default=r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    )
    parser.add_argument("--driver", default="")
    return parser.parse_args()


def overflows(driver: webdriver.Chrome, selector: str) -> bool:
    element = driver.find_element(By.CSS_SELECTOR, selector)
    return bool(
        driver.execute_script(
            "return arguments[0].scrollWidth > arguments[0].clientWidth;",
            element,
        )
    )


def main() -> int:
    args = parse_args()
    options = webdriver.ChromeOptions()
    options.binary_location = args.chrome
    options.add_argument("--headless=new")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.set_capability("goog:loggingPrefs", {"browser": "ALL"})
    service = Service(executable_path=args.driver) if args.driver else Service()
    driver = webdriver.Chrome(service=service, options=options)

    try:
        driver.set_window_size(1600, 1200)
        driver.get(args.url)
        driver.execute_script("document.documentElement.style.scrollBehavior = 'auto';")

        title = driver.find_element(By.ID, "page-title").text
        toc_links = driver.find_elements(By.CSS_SELECTOR, ".brief-toc a")
        sections = driver.find_elements(By.CSS_SELECTOR, ".brief-section")
        toc_targets = [
            len(driver.find_elements(By.ID, link.get_attribute("href").split("#")[-1]))
            == 1
            for link in toc_links
        ]
        counts = {
            "composition": len(
                driver.find_elements(By.CSS_SELECTOR, ".waterproof-composition > section")
            ),
            "interfaces": len(
                driver.find_elements(By.CSS_SELECTOR, ".interface-table tbody tr")
            ),
            "specifications": len(
                driver.find_elements(By.CSS_SELECTOR, ".waterproof-spec-table tbody tr")
            ),
            "responsibilities": len(
                driver.find_elements(By.CSS_SELECTOR, ".waterproof-responsibility > section")
            ),
            "methodSteps": len(
                driver.find_elements(By.CSS_SELECTOR, ".method-flow > section")
            ),
            "holdPoints": len(
                driver.find_elements(By.CSS_SELECTOR, ".hold-points > section")
            ),
            "failureSummary": len(
                driver.find_elements(By.CSS_SELECTOR, ".failure-summary > div")
            ),
            "eventRows": len(
                driver.find_elements(By.CSS_SELECTOR, ".event-record-table tbody tr")
            ),
            "traceability": len(
                driver.find_elements(By.CSS_SELECTOR, ".traceability-chain > div")
            ),
        }
        versions = [
            element.text
            for element in driver.find_elements(
                By.CSS_SELECTOR, ".version-distinction > div strong"
            )
        ]

        details = driver.find_element(By.CSS_SELECTOR, ".version-history")
        summary = details.find_element(By.TAG_NAME, "summary")
        initially_closed = details.get_attribute("open") is None
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", summary)
        before_scroll = driver.execute_script("return window.scrollY;")
        summary.click()
        after_scroll = driver.execute_script("return window.scrollY;")
        details_result = {
            "initiallyClosed": initially_closed,
            "open": details.get_attribute("open") is not None,
            "rowCount": len(
                driver.find_elements(By.CSS_SELECTOR, ".version-history tbody tr")
            ),
            "scrollStable": before_scroll == after_scroll,
            "focused": driver.execute_script(
                "return document.activeElement === arguments[0];", summary
            ),
        }
        overflow = {
            "page": driver.execute_script(
                "return document.documentElement.scrollWidth > window.innerWidth;"
            ),
            "document": overflows(driver, ".waterproof-document"),
            "specification": overflows(driver, ".waterproof-spec-wrap"),
        }

        screenshot = Path(args.screenshot)
        screenshot.parent.mkdir(parents=True, exist_ok=True)
        driver.execute_script("window.scrollTo(0, 0);")
        driver.save_screenshot(str(screenshot))
        for section_id, suffix in (("specification", "specification"), ("current-event", "event")):
            section = driver.find_element(By.ID, section_id)
            driver.execute_script(
                "arguments[0].scrollIntoView({block: 'start'});", section
            )
            target = screenshot.with_name(
                f"{screenshot.stem}-{suffix}{screenshot.suffix}"
            )
            driver.save_screenshot(str(target))

        driver.get(urljoin(args.url, "project-product-description.html"))
        project_link = driver.find_element(
            By.CSS_SELECTOR,
            ".composition-grid article.is-current a[href='product-description-waterproofing.html']",
        ).get_attribute("href")

        driver.get(urljoin(args.url, "renovation.html"))
        catalogue_link = driver.find_element(
            By.CSS_SELECTOR,
            ".product-sidebar a[href='product-description-waterproofing.html']",
        ).get_attribute("href")

        driver.get(urljoin(args.url, "product-register.html"))
        driver.execute_script("document.documentElement.style.scrollBehavior = 'auto';")
        trigger = driver.find_element(
            By.CSS_SELECTOR, ".product-detail-trigger[data-product-id='WPF-011']"
        )
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", trigger)
        before_detail_scroll = driver.execute_script("return window.scrollY;")
        trigger.click()
        after_detail_scroll = driver.execute_script("return window.scrollY;")
        detail = driver.find_element(By.ID, "product-detail-WPF-011")
        register_link = detail.find_element(
            By.CSS_SELECTOR, "a.product-detail-action"
        ).get_attribute("href")
        entry_result = {
            "projectProduct": project_link,
            "catalogue": catalogue_link,
            "register": register_link,
            "detailVisible": detail.get_attribute("hidden") is None,
            "detailScrollStable": before_detail_scroll == after_detail_scroll,
            "detailFocused": driver.execute_script(
                "return document.activeElement === arguments[0];", trigger
            ),
        }

        console_errors = [
            item
            for item in driver.get_log("browser")
            if item.get("level") in {"SEVERE", "WARNING"}
        ]
        output = {
            "title": title,
            "tocCount": len(toc_links),
            "sectionCount": len(sections),
            "tocTargets": toc_targets,
            "counts": counts,
            "versions": versions,
            "versionHistory": details_result,
            "overflow": overflow,
            "entries": entry_result,
            "console": console_errors,
        }
        print(json.dumps(output, ensure_ascii=False, indent=2))

        expected_counts = {
            "composition": 6,
            "interfaces": 4,
            "specifications": 8,
            "responsibilities": 5,
            "methodSteps": 6,
            "holdPoints": 3,
            "failureSummary": 3,
            "eventRows": 3,
            "traceability": 5,
        }
        suffix = "/cases/product-description-waterproofing.html"
        failed = (
            title != "产品描述"
            or len(toc_links) != 7
            or len(sections) != 7
            or not all(toc_targets)
            or counts != expected_counts
            or versions != ["PD-WPF-11 v1.0", "WPF-011 v1.1"]
            or not all(details_result.values())
            or any(overflow.values())
            or not all(entry_result[key].endswith(suffix) for key in ("projectProduct", "catalogue", "register"))
            or not entry_result["detailVisible"]
            or not entry_result["detailScrollStable"]
            or not entry_result["detailFocused"]
            or console_errors
        )
        return 1 if failed else 0
    finally:
        driver.quit()


if __name__ == "__main__":
    raise SystemExit(main())
