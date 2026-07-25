# -*- coding: utf-8 -*-
"""验证装修案例中产品登记单的就地展开交互。"""

import argparse
import json
import sys
from pathlib import Path
from urllib.parse import urljoin

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys


sys.stdout.reconfigure(encoding="utf-8")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", default="http://127.0.0.1:8765/cases/renovation.html")
    parser.add_argument("--screenshot", default="cases/register-event-qa.png")
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
    results = []

    try:
        driver.set_window_size(1440, 1200)
        driver.get(args.url)
        driver.execute_script("document.documentElement.style.scrollBehavior = 'auto';")
        initial_url = driver.current_url
        triggers = driver.find_elements(By.CSS_SELECTOR, ".register-event-trigger")
        panels = driver.find_elements(By.CSS_SELECTOR, ".register-event-panel")
        button_labels = [trigger.text for trigger in triggers]
        initial_hidden = all(panel.get_attribute("hidden") is not None for panel in panels)
        initial_collapsed = all(
            trigger.get_attribute("aria-expanded") == "false" for trigger in triggers
        )
        guide = driver.find_element(By.ID, "product-register-story")
        guide_overflow = driver.execute_script(
            "return arguments[0].scrollWidth > arguments[0].clientWidth;", guide
        )
        screenshot_path = Path(args.screenshot)
        screenshot_path.parent.mkdir(parents=True, exist_ok=True)
        guide_screenshot = screenshot_path.with_name(
            f"{screenshot_path.stem}-guide{screenshot_path.suffix}"
        )
        guide.screenshot(str(guide_screenshot))

        for index, trigger in enumerate(triggers):
            panel_id = trigger.get_attribute("aria-controls")
            panel = driver.find_element(By.ID, panel_id)
            driver.execute_script(
                "arguments[0].scrollIntoView({block: 'center'});", trigger
            )
            before_scroll = driver.execute_script("return window.scrollY;")

            if index == 0:
                trigger.send_keys(Keys.SPACE)
            else:
                trigger.click()

            after_open_scroll = driver.execute_script("return window.scrollY;")
            open_state = driver.execute_script(
                """
                const trigger = arguments[0];
                const panel = arguments[1];
                return {
                    expanded: trigger.getAttribute('aria-expanded'),
                    hidden: panel.hidden,
                    focused: document.activeElement === trigger,
                    panelOverflow: panel.scrollWidth > panel.clientWidth,
                    chainItems: panel.querySelectorAll('.register-event-chain article').length,
                    chainLabels: [...panel.querySelectorAll('.register-event-chain article > span')]
                        .map(label => label.textContent.trim()),
                    hasGenericLink: Boolean(panel.querySelector('a[href*="entity-产品登记单"]'))
                };
                """,
                trigger,
                panel,
            )

            if panel_id == "register-event-rework":
                trigger.find_element(By.XPATH, "ancestor::article[contains(@class, 'timeline-card')]").screenshot(
                    str(screenshot_path)
                )

            trigger.send_keys(Keys.SPACE)
            after_close_scroll = driver.execute_script("return window.scrollY;")
            close_state = {
                "expanded": trigger.get_attribute("aria-expanded"),
                "hidden": panel.get_attribute("hidden") is not None,
                "focused": driver.execute_script(
                    "return document.activeElement === arguments[0];", trigger
                ),
            }
            results.append(
                {
                    "panel": panel_id,
                    "scrollStableOnOpen": before_scroll == after_open_scroll,
                    "scrollStableOnClose": after_open_scroll == after_close_scroll,
                    "urlStable": driver.current_url == initial_url,
                    "open": open_state,
                    "close": close_state,
                }
            )

        case_console_errors = [
            item
            for item in driver.get_log("browser")
            if item.get("level") in {"SEVERE", "WARNING"}
        ]
        document_overflow = driver.execute_script(
            "return document.documentElement.scrollWidth > window.innerWidth;"
        )
        driver.get(urljoin(args.url, "../entities/product.html#entity-产品登记单"))
        table = driver.find_element(
            By.CSS_SELECTOR, "#entity-产品登记单 .register-example-table"
        )
        headers = [
            cell.get_attribute("textContent").strip()
            for cell in table.find_elements(By.CSS_SELECTOR, "thead th")
        ]
        rows = table.find_elements(By.CSS_SELECTOR, "tbody tr")
        product_table = {
            "headers": headers,
            "rowCount": len(rows),
            "waterproofAcceptance": rows[2]
            .find_elements(By.CSS_SELECTOR, "td")[4]
            .get_attribute("textContent")
            .strip(),
            "doorAcceptance": rows[3]
            .find_elements(By.CSS_SELECTOR, "td")[4]
            .get_attribute("textContent")
            .strip(),
        }
        product_console_errors = [
            item
            for item in driver.get_log("browser")
            if item.get("level") in {"SEVERE", "WARNING"}
        ]
        console_errors = case_console_errors + product_console_errors
        output = {
            "triggerCount": len(triggers),
            "panelCount": len(panels),
            "initialHidden": initial_hidden,
            "initialCollapsed": initial_collapsed,
            "buttonLabels": button_labels,
            "guideOverflow": guide_overflow,
            "documentOverflow": document_overflow,
            "events": results,
            "productTable": product_table,
            "console": console_errors,
        }
        print(json.dumps(output, ensure_ascii=False, indent=2))

        failed = (
            len(triggers) != 6
            or len(panels) != 6
            or not initial_hidden
            or not initial_collapsed
            or len(set(button_labels)) != 6
            or guide_overflow
            or document_overflow
            or product_table["headers"][4] != "验收日期"
            or "计划验收" in product_table["headers"]
            or product_table["rowCount"] != 4
            or product_table["waterproofAcceptance"] != "待复验"
            or product_table["doorAcceptance"] != "待验收"
            or console_errors
            or any(
                not event["scrollStableOnOpen"]
                or not event["scrollStableOnClose"]
                or not event["urlStable"]
                or event["open"]["expanded"] != "true"
                or event["open"]["hidden"]
                or not event["open"]["focused"]
                or event["open"]["panelOverflow"]
                or event["open"]["chainItems"] != 4
                or event["open"]["chainLabels"]
                != ["01 阶段环境", "02 触发事件", "03 人员动作", "04 登记单变化"]
                or not event["open"]["hasGenericLink"]
                or event["close"]["expanded"] != "false"
                or not event["close"]["hidden"]
                or not event["close"]["focused"]
                for event in results
            )
        )
        return 1 if failed else 0
    finally:
        driver.quit()


if __name__ == "__main__":
    raise SystemExit(main())
