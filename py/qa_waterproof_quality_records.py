# -*- coding: utf-8 -*-
"""验证防水质量记录包内容、入口和产品登记单交互。"""

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
        default="http://127.0.0.1:8000/cases/waterproof-quality-records.html",
    )
    parser.add_argument(
        "--screenshot",
        default="cases/waterproof-quality-records-case-qa.png",
    )
    parser.add_argument(
        "--chrome",
        default=r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    )
    parser.add_argument("--driver", default="")
    return parser.parse_args()


def element_overflows(driver: webdriver.Chrome, selector: str) -> bool:
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
        toc = driver.find_elements(By.CSS_SELECTOR, ".quality-record-toc a")
        sections = driver.find_elements(By.CSS_SELECTOR, ".quality-record-section")
        toc_targets = [
            len(driver.find_elements(By.ID, link.get_attribute("href").split("#")[-1]))
            == 1
            for link in toc
        ]
        counts = {
            "chain": len(driver.find_elements(By.CSS_SELECTOR, ".evidence-chain article")),
            "firstMeta": len(driver.find_elements(By.CSS_SELECTOR, "#first-inspection .record-meta-grid > div")),
            "observations": len(driver.find_elements(By.CSS_SELECTOR, ".inspection-observations tbody tr")),
            "firstEvidence": len(driver.find_elements(By.CSS_SELECTOR, ".evidence-strip article")),
            "failureFacts": len(driver.find_elements(By.CSS_SELECTOR, ".nonconformity-summary > div")),
            "reworkSteps": len(driver.find_elements(By.CSS_SELECTOR, ".rework-flow article")),
            "signoffs": len(driver.find_elements(By.CSS_SELECTOR, ".action-signoff-table tbody tr")),
            "secondMeta": len(driver.find_elements(By.CSS_SELECTOR, "#reinspection .record-meta-grid > div")),
            "preconditions": len(driver.find_elements(By.CSS_SELECTOR, ".precondition-checklist li")),
            "blankResults": len(driver.find_elements(By.CSS_SELECTOR, ".blank-result-grid > div")),
            "evidenceIndex": len(driver.find_elements(By.CSS_SELECTOR, ".evidence-index-table tbody tr")),
            "traceability": len(driver.find_elements(By.CSS_SELECTOR, ".record-traceability > a, .record-traceability > div")),
        }
        status = {
            "progress": driver.find_element(By.CSS_SELECTOR, ".quality-progress-card > strong").text,
            "first": driver.find_element(By.CSS_SELECTOR, "#first-inspection .record-state").text,
            "rework": driver.find_element(By.CSS_SELECTOR, "#failure-rework .record-state").text,
            "second": driver.find_element(By.CSS_SELECTOR, "#reinspection .record-state").text,
            "secondResult": driver.find_element(By.CSS_SELECTOR, "#reinspection .is-empty dd").text,
        }
        overflow = {
            "page": driver.execute_script(
                "return document.documentElement.scrollWidth > window.innerWidth;"
            ),
            "document": element_overflows(driver, ".quality-record-document"),
            "firstTable": element_overflows(driver, ".inspection-observations"),
            "evidenceTable": element_overflows(driver, ".evidence-index-wrap"),
        }

        screenshot = Path(args.screenshot)
        screenshot.parent.mkdir(parents=True, exist_ok=True)
        driver.execute_script("window.scrollTo(0, 0);")
        driver.save_screenshot(str(screenshot))
        for section_id, suffix in (
            ("first-inspection", "first-inspection"),
            ("failure-rework", "rework"),
            ("reinspection", "reinspection"),
        ):
            section = driver.find_element(By.ID, section_id)
            driver.execute_script("arguments[0].scrollIntoView({block: 'start'});", section)
            target = screenshot.with_name(f"{screenshot.stem}-{suffix}{screenshot.suffix}")
            driver.save_screenshot(str(target))

        driver.get(urljoin(args.url, "product-description-waterproofing.html"))
        description_links = driver.find_elements(
            By.CSS_SELECTOR, "main a[href^='waterproof-quality-records.html']"
        )

        driver.get(urljoin(args.url, "product-register.html#update-04"))
        driver.execute_script("document.documentElement.style.scrollBehavior = 'auto';")
        panel_link = driver.find_element(
            By.CSS_SELECTOR, "#update-panel-04 a[href='waterproof-quality-records.html']"
        ).get_attribute("href")
        trigger = driver.find_element(
            By.CSS_SELECTOR, ".product-detail-trigger[data-product-id='WPF-011']"
        )
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", trigger)
        driver.execute_async_script(
            "const done = arguments[arguments.length - 1];"
            "requestAnimationFrame(() => requestAnimationFrame(done));"
        )
        before_scroll = driver.execute_script("return window.scrollY;")
        trigger.click()
        after_scroll = driver.execute_script("return window.scrollY;")
        detail = driver.find_element(By.ID, "product-detail-WPF-011")
        detail_link = detail.find_element(By.CSS_SELECTOR, ".product-evidence-action").get_attribute("href")
        detail_visible = detail.get_attribute("hidden") is None
        detail_scroll_stable = before_scroll == after_scroll
        detail_focused = driver.execute_script(
            "return document.activeElement === arguments[0];", trigger
        )

        driver.get(urljoin(args.url, "renovation.html#product-register-story"))
        timeline_link = driver.find_element(
            By.CSS_SELECTOR, ".timeline-card a[href='waterproof-quality-records.html']"
        ).get_attribute("href")

        suffix = "/cases/waterproof-quality-records.html"
        entries = {
            "descriptionLinkCount": len(description_links),
            "registerPanel": panel_link,
            "registerDetail": detail_link,
            "timeline": timeline_link,
            "detailVisible": detail_visible,
            "detailScrollStable": detail_scroll_stable,
            "detailScrollBefore": before_scroll,
            "detailScrollAfter": after_scroll,
            "detailFocused": detail_focused,
        }
        console_errors = [
            item
            for item in driver.get_log("browser")
            if item.get("level") in {"SEVERE", "WARNING"}
        ]
        output = {
            "title": title,
            "tocCount": len(toc),
            "sectionCount": len(sections),
            "tocTargets": toc_targets,
            "counts": counts,
            "status": status,
            "overflow": overflow,
            "entries": entries,
            "console": console_errors,
        }
        print(json.dumps(output, ensure_ascii=False, indent=2))

        expected_counts = {
            "chain": 3,
            "firstMeta": 6,
            "observations": 3,
            "firstEvidence": 3,
            "failureFacts": 4,
            "reworkSteps": 4,
            "signoffs": 4,
            "secondMeta": 6,
            "preconditions": 4,
            "blankResults": 4,
            "evidenceIndex": 6,
            "traceability": 4,
        }
        failed = (
            title != "防水质量记录包"
            or len(toc) != 5
            or len(sections) != 5
            or not all(toc_targets)
            or counts != expected_counts
            or status != {
                "progress": "2 组已形成 · 1 组待执行",
                "first": "不通过",
                "rework": "已完成",
                "second": "待执行",
                "secondResult": "待填写",
            }
            or any(overflow.values())
            or len(description_links) != 5
            or not panel_link.endswith(suffix)
            or not detail_link.endswith(suffix)
            or not timeline_link.endswith(suffix)
            or not entries["detailVisible"]
            or not entries["detailScrollStable"]
            or not entries["detailFocused"]
            or console_errors
        )
        return 1 if failed else 0
    finally:
        driver.quit()


if __name__ == "__main__":
    raise SystemExit(main())
