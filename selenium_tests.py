from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time
import unittest

# Path to your HTML file
FILE_PATH = "file:///C:/Users/zaina/Downloads/FA23-BCS-171/TRIO cafe/FA23-BCS-171/frontend/trio-cafe.html"

class TrioCafeTests(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
        self.driver.maximize_window()

    def tearDown(self):
        self.driver.quit()

    # TEST 1: Verify homepage loads
    def test_01_homepage_loads(self):
        self.driver.get(FILE_PATH)
        time.sleep(2)
        self.assertIn("Trio Cafe", self.driver.title)
        print("✅ TEST 1 PASSED: Homepage loaded successfully")

    # TEST 2: Verify login button exists
    def test_02_login_button_exists(self):
        self.driver.get(FILE_PATH)
        time.sleep(2)
        buttons = self.driver.find_elements(By.TAG_NAME, "button")
        self.assertGreater(len(buttons), 0)
        print(f"✅ TEST 2 PASSED: Found {len(buttons)} buttons on page")

    # TEST 3: Verify images load
    def test_03_images_load(self):
        self.driver.get(FILE_PATH)
        time.sleep(2)
        images = self.driver.find_elements(By.TAG_NAME, "img")
        self.assertGreater(len(images), 0)
        print(f"✅ TEST 3 PASSED: Found {len(images)} images on page")

    # TEST 4: Verify cart element exists
    def test_04_cart_exists(self):
        self.driver.get(FILE_PATH)
        time.sleep(2)
        cart = self.driver.find_elements(By.CSS_SELECTOR, "[id*='cart'], [class*='cart']")
        self.assertGreater(len(cart), 0)
        print("✅ TEST 4 PASSED: Cart element found")

    # TEST 5: Verify navigation exists
    def test_05_navigation_exists(self):
        self.driver.get(FILE_PATH)
        time.sleep(2)
        nav = self.driver.find_elements(By.TAG_NAME, "nav")
        self.assertGreater(len(nav), 0)
        print("✅ TEST 5 PASSED: Navigation found")

if __name__ == "__main__":
    unittest.main(verbosity=2)