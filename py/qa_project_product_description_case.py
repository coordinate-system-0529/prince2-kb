# -*- coding: utf-8 -*-
"""验证项目产品描述案例页面、质量矩阵和跨页入口。"""

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
        default="http://127.0.0.1:8000/cases/project-product-description.html",
    )
    parser.add_argument(
        "--screenshot",
        default="cases/project-product-description-case-qa.png",
    )
    parser.add_argument(
        "--chrome",
        default=r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    )
    parser.add_argument("--driver", default="")
    return parser.parse_args()


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
        toc_targets = []
        for link in toc_links:
            target_id = link.get_attribute("href").split("#")[-1]
            toc_targets.append(
                {
                    "id": target_id,
                    "exists": len(driver.find_elements(By.ID, target_id)) == 1,
                }
            )

        composition_count = len(
            driver.find_elements(By.CSS_SELECTOR, ".composition-grid article")
        )
        expectation_count = len(
            driver.find_elements(By.CSS_SELECTOR, ".expectation-list > li")
        )
        acceptance_count = len(
            driver.find_elements(By.CSS_SELECTOR, ".acceptance-table tbody tr")
        )
        responsibility_count = len(
            driver.find_elements(By.CSS_SELECTOR, ".responsibility-flow > section")
        )
        evidence_count = len(
            driver.find_elements(By.CSS_SELECTOR, ".evidence-grid > section")
        )
        document_version = driver.find_element(
            By.CSS_SELECTOR,
            ".version-distinction > div:first-child strong",
        ).text
        actual_product_version = driver.find_element(
            By.CSS_SELECTOR,
            ".version-distinction > div:nth-of-type(2) strong",
        ).text

        version_details = driver.find_element(By.CSS_SELECTOR, ".version-history")
        initially_closed = version_details.get_attribute("open") is None
        summary = version_details.find_element(By.TAG_NAME, "summary")
        driver.execute_script(
            "arguments[0].scrollIntoView({block: 'center'});", summary
        )
        before_open_scroll = driver.execute_script("return window.scrollY;")
        summary.click()
        after_open_scroll = driver.execute_script("return window.scrollY;")
        version_rows = driver.find_elements(
            By.CSS_SELECTOR,
            ".version-history tbody tr",
        )
        version_open = version_details.get_attribute("open") is not None
        summary_focused = driver.execute_script(
            "return document.activeElement === arguments[0];", summary
        )

        overflow = {
            "document": driver.execute_script(
                "return document.documentElement.scrollWidth > window.innerWidth;"
            ),
            "description": driver.execute_script(
                "var e=document.querySelector('.product-description-document');"
                "return e.scrollWidth > e.clientWidth;"
            ),
            "acceptance": driver.execute_script(
                "var e=document.querySelector('.acceptance-table-wrap');"
                "return e.scrollWidth > e.clientWidth;"
            ),
        }

        screenshot_path = Path(args.screenshot)
        screenshot_path.parent.mkdir(parents=True, exist_ok=True)
        driver.execute_script("window.scrollTo(0, 0);")
        driver.save_screenshot(str(screenshot_path))
        composition_path = screenshot_path.with_name(
            f"{screenshot_path.stem}-composition{screenshot_path.suffix}"
        )
        composition = driver.find_element(By.ID, "composition")
        driver.execute_script(
            "arguments[0].scrollIntoView({block: 'start'});", composition
        )
        driver.save_screenshot(str(composition_path))
        acceptance_path = screenshot_path.with_name(
            f"{screenshot_path.stem}-acceptance{screenshot_path.suffix}"
        )
        acceptance = driver.find_element(By.ID, "acceptance")
        driver.execute_script(
            "arguments[0].scrollIntoView({block: 'start'});", acceptance
        )
        driver.save_screenshot(str(acceptance_path))

        driver.get(urljoin(args.url, "project-brief.html#project-product"))
        brief_link = driver.find_element(
            By.CSS_SELECTOR,
            "#project-product a[href='project-product-description.html']",
        ).get_attribute("href")

        driver.get(urljoin(args.url, "renovation.html"))
        catalogue_link = driver.find_element(
            By.CSS_SELECTOR,
            ".product-sidebar a[href='project-product-description.html']",
        ).get_attribute("href")

        driver.get(urljoin(args.url, "product-register.html"))
        driver.execute_script("document.documentElement.style.scrollBehavior = 'auto';")
        home_trigger = driver.find_element(
            By.CSS_SELECTOR,
            ".product-detail-trigger[data-product-id='HOME-025']",
        )
        driver.execute_script(
            "arguments[0].scrollIntoView({block: 'center'});", home_trigger
        )
        home_trigger.click()
        register_link = driver.find_element(
            By.CSS_SELECTOR,
            "#product-detail-HOME-025 a.product-detail-action",
        ).get_attribute("href")
        home_detail_visible = driver.find_element(
            By.ID,
            "product-detail-HOME-025",
        ).get_attribute("hidden") is None

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
            "contentCounts": {
                "composition": composition_count,
                "expectations": expectation_count,
                "acceptanceRows": acceptance_count,
                "responsibilities": responsibility_count,
                "evidence": evidence_count,
            },
            "versionDistinction": {
                "document": document_version,
                "actualProduct": actual_product_version,
            },
            "versionHistory": {
                "initiallyClosed": initially_closed,
                "open": version_open,
                "rowCount": len(version_rows),
                "scrollStable": before_open_scroll == after_open_scroll,
                "focused": summary_focused,
            },
            "overflow": overflow,
            "entryLinks": {
                "projectBrief": brief_link,
                "catalogue": catalogue_link,
                "productRegister": register_link,
                "productDetailVisible": home_detail_visible,
            },
            "console": console_errors,
        }
        print(json.dumps(output, ensure_ascii=False, indent=2))

        expected_suffix = "/cases/project-product-description.html"
        failed = (
            title != "项目产品描述"
            or len(toc_links) != 7
            or len(sections) != 7
            or not all(item["exists"] for item in toc_targets)
            or composition_count != 9
            or expectation_count != 6
            or acceptance_count != 6
            or responsibility_count != 4
            or evidence_count != 6
            or document_version != "PPD-HOME-25 v1.1"
            or actual_product_version != "HOME-025 v0.3"
            or not initially_closed
            or not version_open
            or len(version_rows) != 3
            or before_open_scroll != after_open_scroll
            or not summary_focused
            or any(overflow.values())
            or not brief_link.endswith(expected_suffix)
            or not catalogue_link.endswith(expected_suffix)
            or not register_link.endswith(expected_suffix)
            or not home_detail_visible
            or console_errors
        )
        return 1 if failed else 0
    finally:
        driver.quit()


if __name__ == "__main__":
    raise SystemExit(main())
