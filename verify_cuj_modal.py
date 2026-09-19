from playwright.sync_api import sync_playwright
import time
import os

def test_market():
    os.makedirs("/home/jules/verification/screenshots", exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 720})

        # Navigate to the local app
        page.goto("http://localhost:3005/market")
        page.wait_for_selector(".group.relative", timeout=15000) # Wait for item cards
        time.sleep(2)

        # Click on the first item
        page.click(".group.relative:first-child")
        time.sleep(2)

        # Take full page screenshot
        page.screenshot(path="/home/jules/verification/screenshots/verification1.png", full_page=True)

        print("Captured verification1.png")
        browser.close()

if __name__ == "__main__":
    test_market()
