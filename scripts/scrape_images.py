import argparse
from pygoogle_image import image as pi

def download_images(names):
    print("names:", names)
    for name in names:
        print("Downloading images for", name)
        pi.download(name, limit=10)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Download images for given names.')
    parser.add_argument('names', nargs='+', help='List of names to download images for')
    args = parser.parse_args()
    download_images(args.names)
    # Ensure names with spaces are handled correctly by wrapping them in quotes when passing as arguments

