# -*- coding: utf-8 -*-
"""验证装修案例项目概述文件页面、目录和跨页入口。"""

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
        default="http://127.0.0.1:8000/cases/project-brief.html",
    )
    parser.add_argument(
        "--screenshot",
        default="cases/project-brief-case-qa.png",
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
        decision = driver.find_element(By.CSS_SELECTOR, ".decision-stamp strong").text
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
            "brief": driver.execute_script(
                "var e=document.querySelector('.brief-document');"
                "return e.scrollWidth > e.clientWidth;"
            ),
            "decision": driver.execute_script(
                "var e=document.querySelector('.decision-summary');"
                "return e.scrollWidth > e.clientWidth;"
            ),
        }

        screenshot_path = Path(args.screenshot)
        screenshot_path.parent.mkdir(parents=True, exist_ok=True)
        driver.execute_script("window.scrollTo(0, 0);")
        driver.save_screenshot(str(screenshot_path))
        document_path = screenshot_path.with_name(
            f"{screenshot_path.stem}-document{screenshot_path.suffix}"
        )
        document_header = driver.find_element(By.CSS_SELECTOR, ".document-header")
        driver.execute_script(
            "arguments[0].scrollIntoView({block: 'start'});", document_header
        )
        driver.save_screenshot(str(document_path))
        definition_path = screenshot_path.with_name(
            f"{screenshot_path.stem}-definition{screenshot_path.suffix}"
        )
        definition = driver.find_element(By.ID, "definition")
        driver.execute_script(
            "arguments[0].scrollIntoView({block: 'start'});", definition
        )
        driver.save_screenshot(str(definition_path))

        driver.get(urljoin(args.url, "renovation.html"))
        catalogue_link = driver.find_element(
            By.CSS_SELECTOR,
            ".product-sidebar a[href='project-brief.html']",
        )
        timeline_link = driver.find_element(
            By.CSS_SELECTOR,
            ".timeline-dimensions a[href='project-brief.html']",
        )
        catalogue_target = catalogue_link.get_attribute("href")
        timeline_target = timeline_link.get_attribute("href")

        driver.get(urljoin(args.url, "product-register.html"))
        driver.execute_script("document.documentElement.style.scrollBehavior = 'auto';")
        mgt_trigger = driver.find_element(
            By.CSS_SELECTOR,
            ".product-detail-trigger[data-product-id='MGT-001']",
        )
        driver.execute_script(
            "arguments[0].scrollIntoView({block: 'center'});", mgt_trigger
        )
        mgt_trigger.click()
        product_link = driver.find_element(
            By.CSS_SELECTOR,
            "#product-detail-MGT-001 a.product-detail-action",
        )
        product_target = product_link.get_attribute("href")
        product_detail_visible = driver.find_element(
            By.ID,
            "product-detail-MGT-001",
        ).get_attribute("hidden") is None

        console_errors = [
            item
            for item in driver.get_log("browser")
            if item.get("level") in {"SEVERE", "WARNING"}
        ]

        output = {
            "title": title,
            "decision": decision,
            "tocCount": len(toc_links),
            "sectionCount": len(sections),
            "tocTargets": toc_targets,
            "versionHistory": {
                "initiallyClosed": initially_closed,
                "open": version_open,
                "rowCount": len(version_rows),
                "scrollStable": before_open_scroll == after_open_scroll,
                "focused": summary_focused,
            },
            "overflow": overflow,
            "entryLinks": {
                "catalogue": catalogue_target,
                "timeline": timeline_target,
                "productRegister": product_target,
                "productDetailVisible": product_detail_visible,
            },
            "console": console_errors,
        }
        print(json.dumps(output, ensure_ascii=False, indent=2))

        expected_suffix = "/cases/project-brief.html"
        failed = (
            title != "项目概述文件"
            or decision != "批准进入项目启动"
            or len(toc_links) != 7
            or len(sections) != 7
            or not all(item["exists"] for item in toc_targets)
            or not initially_closed
            or not version_open
            or len(version_rows) != 3
            or before_open_scroll != after_open_scroll
            or not summary_focused
            or any(overflow.values())
            or not catalogue_target.endswith(expected_suffix)
            or not timeline_target.endswith(expected_suffix)
            or not product_target.endswith(expected_suffix)
            or not product_detail_visible
            or console_errors
        )
        return 1 if failed else 0
    finally:
        driver.quit()


if __name__ == "__main__":
    raise SystemExit(main())
