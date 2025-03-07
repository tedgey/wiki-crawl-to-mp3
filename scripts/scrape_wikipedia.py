from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

def scrape_wikipedia(names):
    # Set Chrome options to run in headless mode
    options = Options()
    options.add_argument('headless')
    options.add_argument('disable-gpu')
    options.add_argument('window-size=1920,1080')

    # Create a new instance of the Chrome driver
    driver = webdriver.Chrome(options=options)

    for name in names:
        wiki_name = name.replace(" ", "_")
        driver.get(f"https://en.wikipedia.org/wiki/{wiki_name}")

        title = driver.title
        assert f"{name} - Wikipedia" == title

        first_heading = driver.find_element(By.ID, 'firstHeading')
        expected_heading = first_heading.text
        assert name == expected_heading

        article_text = driver.find_element(By.ID, 'mw-content-text')
        received_text = article_text.text

        # In received_text IF we see "See also" cut out all text after that
        final_text = received_text.split('See also')[0]

        if len(final_text) > 1:
            print('final_text length:', len(final_text))

        # Send the final_text to a file
        try:
            formatted_name = name.replace(" ", "")
            with open(f'./content/scraped_articles/{formatted_name}.txt', 'w', encoding='utf-8') as file:
                file.write(final_text)
        except Exception as e:
            print("Error:", e)

    driver.quit()

# script should accept a list of names as an argument
if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description='Scrape text from Wikipedia script.')
    parser.add_argument('names', nargs='+', help='List of names to scrape text for')
    args = parser.parse_args()
    scrape_wikipedia(args.names)

# Run the script with the following command:
# python scripts/scrape_wikipedia.py "Albert Pujols" baseball
# This will scrape the text from the Wikipedia page for Albert Pujols and save it to a file in the scraped_articles directory.
