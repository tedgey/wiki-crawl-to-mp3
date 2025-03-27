from pygoogle_image import image as pi
from PIL import Image
import os
import argparse
import boto3

# Initialize the S3 client
s3 = boto3.client('s3')

def process_images(names, topic):
    print(f"Processing images for topic: {topic}, names: {names}")
    # Replace spaces with underscores in topic
    sanitized_topic = topic.replace(" ", "_")
    # Replace spaces with underscores in all names
    sanitized_names = [name.replace(" ", "_") for name in names]

    for name in sanitized_names:
        image_folder = os.path.join('images', f'{name}_{sanitized_topic}')
        download_images(name, image_folder, sanitized_topic)
        resize_images(image_folder)
        upload_images_to_s3(image_folder, sanitized_topic, name)
        delete_local_images(image_folder)

def download_images(name, image_folder, topic):
    search_query = f"{name} {topic}"
    if not os.path.exists(image_folder):
        os.makedirs(image_folder)
    print(f"Downloading images for {search_query} into {image_folder}")
    pi.download(search_query, limit=1)
    # remove the topic from the downloaded file
    for img_file in os.listdir(image_folder):
        img_path = os.path.join(image_folder, img_file)
        new_img_path = os.path.join(image_folder, img_file.replace(f' {topic}', ''))
        os.rename(img_path, new_img_path)
        print(f"Renamed {img_path} to {new_img_path}")

def resize_images(image_folder):
    print(f"Resizing images in {image_folder}")
    max_width = 1280
    max_height = 720
    min_width = 1024
    min_height = 768

    for img_file in os.listdir(image_folder):
        img_path = os.path.join(image_folder, img_file)
        img = Image.open(img_path)
        width, height = img.size
        if width > max_width or height > max_height:
            img.thumbnail((max_width, max_height))
            img.save(img_path)
        elif width < min_width or height < min_height:
            img.thumbnail((min_width, min_height))
            img.save(img_path)
        else:
            print(f"Image {img_path} is already the correct size")

def upload_images_to_s3(image_folder, topic, name):
    print(f"Uploading images to S3 for topic: {topic}, name: {name}")
    bucket_name = 'make-my-pod'
    s3_prefix = f'images/{topic}/{name}/'

    for img_file in os.listdir(image_folder):
        img_path = os.path.join(image_folder, img_file)
        s3_key = f'{s3_prefix}{img_file}'

        try:
            # Upload the image to S3
            s3.upload_file(img_path, bucket_name, s3_key, ExtraArgs={'ContentType': 'image/jpeg'})
        except Exception as e:
            print(f"Failed to upload {img_file} to S3: {e}")

def delete_local_images(image_folder):
    print(f"Deleting local images in {image_folder}")
    for img_file in os.listdir(image_folder):
        img_path = os.path.join(image_folder, img_file)
        os.remove(img_path)
        print(f"Deleted {img_path}")
    os.rmdir(image_folder)
    print(f"Deleted folder {image_folder}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Download and resize images for given names.')
    parser.add_argument('names', nargs='+', help='List of names to download images for')
    parser.add_argument('topic', help='Topic to better specify what images we download')
    args = parser.parse_args()
    process_images(args.names, args.topic)