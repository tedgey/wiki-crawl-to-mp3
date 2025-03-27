from pygoogle_image import image as pi
from PIL import Image
import os
import argparse
import boto3

# Initialize the S3 client
s3 = boto3.client('s3')

def process_images(names, topic):
    for name in names:
        image_folder = os.path.join('images', name.replace(" ", "_") + f'_{topic}')
        print('image_folder1:', image_folder)
        download_images(name, image_folder, topic)
        resize_images(image_folder, topic)
        rename_files(image_folder, topic)
        upload_images_to_s3(image_folder, topic, name)  # Pass a single name here
        delete_local_images(image_folder, topic)

def download_images(name, image_folder, topic):
    search_query = f"{name} {topic}"
    if not os.path.exists(image_folder):
        os.makedirs(image_folder)
    print(f"Downloading images for {search_query} into {image_folder}")
    pi.download(search_query, limit=1)
    # rename downloaded image folder. It's currently image_folder + _ + topic and we want to remove the topic
    new_image_folder = image_folder.replace(f'_{topic}', '')
    os.rename(image_folder, new_image_folder)


def resize_images(image_folder, topic):
    renamed_image_folder = image_folder.replace(f'_{topic}', '')
    print(f"Resizing images in {renamed_image_folder}")
    max_width = 1280
    max_height = 720
    min_width = 1024
    min_height = 768
    
    for img in os.listdir(renamed_image_folder):
        img_path = os.path.join(renamed_image_folder, img)
        img = Image.open(img_path)
        width, height = img.size
        if width > max_width or height > max_height:
            img.thumbnail((max_width, max_height))
            img.save(img_path)
            print(f"Resized image saved to {img_path}")
        elif width < min_width or height < min_height:
            img.thumbnail((min_width, min_height))
            img.save(img_path)
            print(f"Resized image saved to {img_path}")
        else:
            print(f"Image {img_path} is already the correct size")

def rename_files(image_folder, topic):
    print(f"Renaming images")
    print('image_folder:', image_folder)
    # remove topic from image_folder
    renamedImageFolder = image_folder.replace(f'_{topic}', '')
    for img_file in os.listdir(renamedImageFolder):
        img_path = os.path.join(renamedImageFolder, img_file)
        base_name, ext = os.path.splitext(os.path.basename(img_path))
        new_base_name = base_name.replace(f' {topic}', '')
        new_img_file = new_base_name + ext
        new_img_path = os.path.join(renamedImageFolder, new_img_file)
        os.rename(img_path, new_img_path)
        print(f"Renamed image to {new_img_path}")

def upload_images_to_s3(image_folder, topic, name):
    print(f"Uploading images to S3 for topic: {topic}, name: {name}")
    renamed_image_folder = image_folder.replace(f'_{topic}', '')
    bucket_name = 'make-my-pod'
    s3_prefix = f'images/{topic}/{name.replace(" ", "_")}/'  # Use the single name here

    for img_file in os.listdir(renamed_image_folder):
        img_path = os.path.join(renamed_image_folder, img_file)
        s3_key = f'{s3_prefix}{img_file}'  # Construct the S3 key

        try:
            # Upload the image to S3
            s3.upload_file(img_path, bucket_name, s3_key, ExtraArgs={'ContentType': 'image/jpeg'})
            print(f"Uploaded {img_file} to s3://{bucket_name}/{s3_key}")
        except Exception as e:
            print(f"Failed to upload {img_file} to S3: {e}")

def delete_local_images(image_folder, topic):
    print(f"Deleting local images")
    renamedImageFolder = image_folder.replace(f'_{topic}', '')
    for img_file in os.listdir(renamedImageFolder):
        img_path = os.path.join(renamedImageFolder, img_file)
        os.remove(img_path)
        print(f"Deleted {img_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Download and resize images for given names.')
    parser.add_argument('names', nargs='+', help='List of names to download images for')
    parser.add_argument('topic', help='Topic to better specify what images we download')
    args = parser.parse_args()
    process_images(args.names, args.topic)