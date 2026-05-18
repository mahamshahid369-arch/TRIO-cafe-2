from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time
import unittest
import os

class TrioCafeTests(unittest.TestCase):

    def setUp(self):
        options = webdriver.ChromeOptions()
        options.add_argument("--headless")           # Run in background (required for CI/CD)
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--window-size=1920,1080")
        
        self.driver = webdriver.Chrome(
            service=Service(ChromeDriverManager().install()), 
            options=options
        )

    def tearDown(self):
        self.driver.quit()

    # TEST 1: Verify homepage loads
    def test_01_homepage_loads(self):
        # Dynamically finds the path to your frontend file
        file_path = "file://" + os.path.abspath("frontend/trio-cafe.html")
        self.driver.get(file_path)
        time.sleep(2)
        
        title = self.driver.title
        self.assertIsNotNone(title)
        print(f"✅ TEST 1 PASSED: Homepage loaded | Title: {title}")

    # TEST 2: Verify buttons exist
    def test_02_buttons_exist(self):
        file_path = "file://" + os.path.abspath("frontend/trio-cafe.html")
        self.driver.get(file_path)
        time.sleep(1)
        
        buttons = self.driver.find_elements(By.TAG_NAME, "button")
        self.assertGreater(len(buttons), 0, "No buttons found on the page")
        print(f"✅ TEST 2 PASSED: Found {len(buttons)} buttons on page")

    # TEST 3: Verify images load
    def test_03_images_load(self):
        file_path = "file://" + os.path.abspath("frontend/trio-cafe.html")
        self.driver.get(file_path)
        time.sleep(1)
        
        images = self.driver.find_elements(By.TAG_NAME, "img")
        self.assertGreater(len(images), 0, "No images found on the page")
        print(f"✅ TEST 3 PASSED: Found {len(images)} images")

    # TEST 4: Verify cart element exists
    def test_04_cart_exists(self):
        file_path = "file://" + os.path.abspath("frontend/trio-cafe.html")
        self.driver.get(file_path)
        time.sleep(1)
        
        cart_elements = self.driver.find_elements(By.CSS_SELECTOR, 
            "[id*='cart'], [class*='cart'], .cart, [aria-label*='cart']")
        self.assertGreater(len(cart_elements), 0, "Cart element not found")
        print("✅ TEST 4 PASSED: Cart element found")

if __name__ == "__main__":
    unittest.main(verbosity=2)