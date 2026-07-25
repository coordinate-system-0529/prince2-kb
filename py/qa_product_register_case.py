# -*- coding: utf-8 -*-
"""验证产品登记单案例页面的生命周期、完整登记单与行内详情交互。"""

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
    parser.add_argument(
        "--url",
        default="http://127.0.0.1:8000/cases/product-register.html",
    )
    parser.add_argument(
        "--screenshot",
        default="cases/product-register-case-qa.png",
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


def affected_product_ids(driver: webdriver.Chrome) -> list[str]:
    return [
        row.get_attribute("data-product-id")
        for row in driver.find_elements(
            By.CSS_SELECTOR,
            ".product-register-row.is-update-affected",
        )
    ]


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
        tabs = driver.find_elements(By.CSS_SELECTOR, ".update-node[role='tab']")
        panels = driver.find_elements(By.CSS_SELECTOR, ".update-panel[role='tabpanel']")
        product_rows = driver.find_elements(By.CSS_SELECTOR, ".product-register-row")
        detail_triggers = driver.find_elements(By.CSS_SELECTOR, ".product-detail-trigger")
        detail_rows = driver.find_elements(By.CSS_SELECTOR, ".product-detail-row")

        initial_selected = [
            tab.get_attribute("id")
            for tab in tabs
            if tab.get_attribute("aria-selected") == "true"
        ]
        initial_visible = [
            panel.get_attribute("id")
            for panel in panels
            if panel.get_attribute("hidden") is None
        ]
        initial_details_hidden = all(
            row.get_attribute("hidden") is not None for row in detail_rows
        )
        initial_details_collapsed = all(
            trigger.get_attribute("aria-expanded") == "false"
            for trigger in detail_triggers
        )
        initial_affected = affected_product_ids(driver)
        click_results = []

        for tab in tabs:
            panel_id = tab.get_attribute("aria-controls")
            before_scroll = driver.execute_script("return window.scrollY;")
            tab.click()
            after_scroll = driver.execute_script("return window.scrollY;")
            visible_panels = [
                panel.get_attribute("id")
                for panel in panels
                if panel.get_attribute("hidden") is None
            ]
            click_results.append(
                {
                    "tab": tab.get_attribute("id"),
                    "selected": tab.get_attribute("aria-selected"),
                    "visiblePanels": visible_panels,
                    "expectedPanel": panel_id,
                    "scrollStable": before_scroll == after_scroll,
                    "focused": driver.execute_script(
                        "return document.activeElement === arguments[0];", tab
                    ),
                }
            )

        linkage = {}
        for update_id in ("update-03", "update-05"):
            driver.find_element(By.ID, update_id).click()
            linkage[update_id] = affected_product_ids(driver)

        current_tab = driver.find_element(By.ID, "update-04")
        current_tab.click()
        before_keyboard_scroll = driver.execute_script("return window.scrollY;")
        current_tab.send_keys(Keys.ARROW_RIGHT)
        after_keyboard_scroll = driver.execute_script("return window.scrollY;")
        keyboard_selected = driver.find_element(
            By.CSS_SELECTOR, ".update-node[aria-selected='true']"
        )
        keyboard_selected_id = keyboard_selected.get_attribute("id")
        keyboard_focused = driver.execute_script(
            "return document.activeElement === arguments[0];",
            keyboard_selected,
        )

        detail_results = []
        for trigger in detail_triggers:
            detail_id = trigger.get_attribute("aria-controls")
            detail_row = driver.find_element(By.ID, detail_id)
            driver.execute_script(
                "arguments[0].scrollIntoView({block: 'center'});", trigger
            )
            before_open_scroll = driver.execute_script("return window.scrollY;")
            trigger.click()
            after_open_scroll = driver.execute_script("return window.scrollY;")
            open_result = {
                "product": trigger.get_attribute("data-product-id"),
                "expanded": trigger.get_attribute("aria-expanded"),
                "visible": detail_row.get_attribute("hidden") is None,
                "scrollStable": before_open_scroll == after_open_scroll,
                "focused": driver.execute_script(
                    "return document.activeElement === arguments[0];", trigger
                ),
                "detailSectionCount": len(
                    detail_row.find_elements(
                        By.CSS_SELECTOR,
                        ".product-detail-columns > section",
                    )
                ),
                "historyCount": len(
                    detail_row.find_elements(
                        By.CSS_SELECTOR,
                        ".product-history-table tbody tr",
                    )
                ),
            }
            before_close_scroll = driver.execute_script("return window.scrollY;")
            trigger.click()
            after_close_scroll = driver.execute_script("return window.scrollY;")
            open_result.update(
                {
                    "collapsed": trigger.get_attribute("aria-expanded") == "false",
                    "hidden": detail_row.get_attribute("hidden") is not None,
                    "closeScrollStable": before_close_scroll == after_close_scroll,
                    "closeFocused": driver.execute_script(
                        "return document.activeElement === arguments[0];", trigger
                    ),
                }
            )
            detail_results.append(open_result)

        screenshot_path = Path(args.screenshot)
        screenshot_path.parent.mkdir(parents=True, exist_ok=True)
        current_tab.click()
        driver.execute_script("window.scrollTo(0, 0);")
        driver.save_screenshot(str(screenshot_path))
        lifecycle_path = screenshot_path.with_name(
            f"{screenshot_path.stem}-lifecycle{screenshot_path.suffix}"
        )
        driver.find_element(By.CSS_SELECTOR, ".register-lifecycle").screenshot(
            str(lifecycle_path)
        )
        detail_path = screenshot_path.with_name(
            f"{screenshot_path.stem}-detail{screenshot_path.suffix}"
        )
        detail_panel = driver.find_element(By.ID, "update-panel-04")
        driver.execute_script(
            "arguments[0].scrollIntoView({block: 'center'});", detail_panel
        )
        detail_panel.screenshot(str(detail_path))

        wpf_trigger = driver.find_element(
            By.CSS_SELECTOR,
            ".product-detail-trigger[data-product-id='WPF-011']",
        )
        wpf_trigger.click()
        register_path = screenshot_path.with_name(
            f"{screenshot_path.stem}-register{screenshot_path.suffix}"
        )
        register_header = driver.find_element(By.CSS_SELECTOR, ".register-document-header")
        driver.execute_script(
            "arguments[0].scrollIntoView({block: 'start'});", register_header
        )
        driver.save_screenshot(str(register_path))
        product_detail_path = screenshot_path.with_name(
            f"{screenshot_path.stem}-product-detail{screenshot_path.suffix}"
        )
        wpf_detail = driver.find_element(By.ID, "product-detail-WPF-011")
        driver.execute_script(
            "arguments[0].scrollIntoView({block: 'center'});", wpf_detail
        )
        wpf_detail.find_element(By.CSS_SELECTOR, ".product-detail-sheet").screenshot(
            str(product_detail_path)
        )

        planned_panels = driver.find_elements(By.CSS_SELECTOR, ".update-panel.is-planned")
        overflow = {
            "document": driver.execute_script(
                "return document.documentElement.scrollWidth > window.innerWidth;"
            ),
            "lifecycle": element_overflows(driver, ".register-lifecycle"),
            "track": element_overflows(driver, ".lifecycle-map"),
            "detail": element_overflows(driver, ".update-detail"),
            "registerSheet": element_overflows(driver, ".register-sheet-section"),
            "fullRegister": element_overflows(driver, ".full-register-wrap"),
        }

        driver.get(f"{args.url}#update-02")
        deep_link_selected = driver.find_element(
            By.CSS_SELECTOR, ".update-node[aria-selected='true']"
        ).get_attribute("id")
        deep_link_visible = driver.find_element(By.ID, "update-panel-02").get_attribute(
            "hidden"
        ) is None

        driver.get(urljoin(args.url, "renovation.html#product-register-story"))
        lifecycle_links = driver.find_elements(
            By.CSS_SELECTOR,
            ".register-event-panel a[href^='product-register.html#update-']",
        )
        guide_link = driver.find_element(
            By.CSS_SELECTOR,
            ".register-revision-note a[href='product-register.html']",
        )
        catalogue_links = driver.find_elements(
            By.CSS_SELECTOR,
            ".product-sidebar a[href='product-register.html']",
        )
        guide_displayed = guide_link.is_displayed()
        catalogue_present = len(catalogue_links) == 1

        driver.get(urljoin(args.url, "../entities/product.html#entity-产品登记单"))
        entity_case_link = driver.find_element(
            By.CSS_SELECTOR,
            "a.register-example-trigger[href='../cases/product-register.html']",
        )
        entity_link_target = entity_case_link.get_attribute("href")

        console_errors = [
            item
            for item in driver.get_log("browser")
            if item.get("level") in {"SEVERE", "WARNING"}
        ]
        output = {
            "tabCount": len(tabs),
            "panelCount": len(panels),
            "initialSelected": initial_selected,
            "initialVisible": initial_visible,
            "clickResults": click_results,
            "keyboard": {
                "selected": keyboard_selected_id,
                "focused": keyboard_focused,
                "scrollStable": before_keyboard_scroll == after_keyboard_scroll,
            },
            "deepLink": {
                "selected": deep_link_selected,
                "panelVisible": deep_link_visible,
            },
            "plannedPanelCount": len(planned_panels),
            "register": {
                "productRowCount": len(product_rows),
                "detailTriggerCount": len(detail_triggers),
                "detailRowCount": len(detail_rows),
                "initialDetailsHidden": initial_details_hidden,
                "initialDetailsCollapsed": initial_details_collapsed,
                "initialAffected": initial_affected,
                "linkage": linkage,
                "detailResults": detail_results,
            },
            "overflow": overflow,
            "entryLinks": {
                "eventCount": len(lifecycle_links),
                "guide": guide_displayed,
                "catalogue": catalogue_present,
                "entityTarget": entity_link_target,
            },
            "console": console_errors,
        }
        print(json.dumps(output, ensure_ascii=False, indent=2))

        failed = (
            len(tabs) != 6
            or len(panels) != 6
            or initial_selected != ["update-04"]
            or initial_visible != ["update-panel-04"]
            or len(planned_panels) != 2
            or len(product_rows) != 14
            or len(detail_triggers) != 14
            or len(detail_rows) != 14
            or not initial_details_hidden
            or not initial_details_collapsed
            or initial_affected != ["WPF-011"]
            or linkage["update-03"] != ["DOOR-018"]
            or linkage["update-05"]
            != ["MGT-004", "FIN-014", "CAB-016", "DOOR-018", "ELE-021"]
            or any(overflow.values())
            or deep_link_selected != "update-02"
            or not deep_link_visible
            or keyboard_selected_id != "update-05"
            or not output["keyboard"]["focused"]
            or not output["keyboard"]["scrollStable"]
            or len(lifecycle_links) != 6
            or not guide_displayed
            or not catalogue_present
            or not entity_link_target.endswith("/cases/product-register.html")
            or console_errors
            or any(
                result["selected"] != "true"
                or result["visiblePanels"] != [result["expectedPanel"]]
                or not result["scrollStable"]
                or not result["focused"]
                for result in click_results
            )
            or any(
                result["expanded"] != "true"
                or not result["visible"]
                or not result["scrollStable"]
                or not result["focused"]
                or result["detailSectionCount"] != 3
                or result["historyCount"] < 1
                or not result["collapsed"]
                or not result["hidden"]
                or not result["closeScrollStable"]
                or not result["closeFocused"]
                for result in detail_results
            )
        )
        return 1 if failed else 0
    finally:
        driver.quit()


if __name__ == "__main__":
    raise SystemExit(main())
