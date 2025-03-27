from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import boto3

def scrape_wikipedia(names, topic):
    # Set Chrome options to run in headless mode
    options = Options()
    options.add_argument('headless')
    options.add_argument('disable-gpu')
    options.add_argument('window-size=1920,1080')

    # Create a new instance of the Chrome driver
    driver = webdriver.Chrome(options=options)

    # Initialize the S3 client
    s3 = boto3.client('s3')

    # Define your S3 bucket name
    bucket_name = 'make-my-pod'

    topic_folder = f'scraped-articles/{topic}'

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

        # Upload the final_text directly to S3
        try:
            formatted_name = name.replace(" ", "")
            s3_key = f'{topic_folder}/{formatted_name}.txt'

            # Upload the text content as a file to S3
            s3.put_object(
                Bucket=bucket_name,
                Key=s3_key,
                Body=final_text,
                ContentType='text/plain',
                ACL='private'  # Set the ACL (optional, e.g., 'private' or 'public-read')
            )
            print(f"Uploaded text for {name} to s3://{bucket_name}/{s3_key}")

        except Exception as e:
            print(f"Error uploading to S3 for {name}: {e}")

    driver.quit()

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description='Scrape text from Wikipedia script.')
    parser.add_argument('names', nargs='+', help='List of names to scrape text for')
    parser.add_argument('topic', help='Topic to create s3 folder if needed')
    args = parser.parse_args()
    scrape_wikipedia(args.names, args.topic)

# Run the script with the following command:
# python scripts/scrape_wikipedia.py "Albert Pujols" baseball