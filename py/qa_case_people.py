# -*- coding: utf-8 -*-
"""检查装修案例人物区的桌面端布局。"""

import argparse
import json
import sys
from pathlib import Path

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait


sys.stdout.reconfigure(encoding="utf-8")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", default="http://127.0.0.1:8765/cases/renovation.html")
    parser.add_argument("--screenshot", default="cases/people-section-qa.png")
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
        driver.set_window_size(1440, 1200)
        driver.get(args.url)
        WebDriverWait(driver, 10).until(
            lambda current: current.execute_script(
                "return [...document.querySelectorAll('.person-avatar')]"
                ".every(image => image.complete && image.naturalWidth > 0);"
            )
        )
        people_section = driver.find_element(By.CSS_SELECTOR, ".people-section")
        organization = driver.find_element(By.CSS_SELECTOR, ".project-org-strip")
        metrics = driver.execute_script(
            """
            const people = document.querySelector('.people-section');
            const organization = document.querySelector('.project-org-strip');
            const flow = document.querySelector('.org-flow');
            const cards = [...document.querySelectorAll('.person-card')];
            const overflowingCards = cards
                .filter(card => card.scrollWidth > card.clientWidth)
                .map(card => card.querySelector('h4')?.textContent.trim() || '未知人物');
            return {
                viewport: innerWidth,
                documentWidth: document.documentElement.scrollWidth,
                peopleWidth: people.getBoundingClientRect().width,
                peopleHeight: people.getBoundingClientRect().height,
                organizationDisplay: getComputedStyle(organization).display,
                organizationWidth: organization.getBoundingClientRect().width,
                organizationHeight: organization.getBoundingClientRect().height,
                flowDisplay: getComputedStyle(flow).display,
                flowColumns: getComputedStyle(flow).gridTemplateColumns,
                flowOverflow: flow.scrollWidth > flow.clientWidth,
                cardOverflow: overflowingCards.length,
                overflowingCards,
                brokenAvatars: [...document.querySelectorAll('.person-avatar')]
                    .filter(image => !image.complete || image.naturalWidth === 0).length,
                personCards: cards.length,
                organizationClusters: document.querySelectorAll('.org-cluster').length
            };
            """
        )
        console_errors = [
            item
            for item in driver.get_log("browser")
            if item.get("level") in {"SEVERE", "WARNING"}
        ]

        screenshot_path = Path(args.screenshot)
        screenshot_path.parent.mkdir(parents=True, exist_ok=True)
        driver.execute_script(
            "arguments[0].scrollIntoView({block: 'start'});", people_section
        )
        driver.save_screenshot(str(screenshot_path))
        organization_screenshot = screenshot_path.with_name(
            f"{screenshot_path.stem}-organization{screenshot_path.suffix}"
        )
        driver.execute_script(
            "arguments[0].scrollIntoView({block: 'center'});", organization
        )
        driver.save_screenshot(str(organization_screenshot))
        result = {"metrics": metrics, "console": console_errors}
        print(json.dumps(result, ensure_ascii=False, indent=2))

        failed = (
            metrics["documentWidth"] > metrics["viewport"]
            or metrics["flowDisplay"] != "grid"
            or metrics["flowOverflow"]
            or metrics["cardOverflow"]
            or metrics["brokenAvatars"]
            or metrics["personCards"] != 10
            or metrics["organizationClusters"] != 3
            or console_errors
        )
        return 1 if failed else 0
    finally:
        driver.quit()


if __name__ == "__main__":
    raise SystemExit(main())
