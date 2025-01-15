from moviepy import concatenate_videoclips, vfx, AudioFileClip, ImageClip
import os

def create_video(names):
    for name in names:
        formatted_name = name.replace(" ", "_")
        print("Creating video for", name)
        image_folder = os.path.join('images', formatted_name)
        audio_file = os.path.join('content', 'generated_audio', 'baseball', f'{name.replace(" ", "")}.mp3')
        output_file = os.path.join('content', 'videos', f'{formatted_name}.mp4')

        print("image_folder:", image_folder)
        print("audio_file:", audio_file)
        print("output_file:", output_file)


        # Get the list of image files
        image_files = [os.path.join(image_folder, img) for img in os.listdir(image_folder.replace(" ", "_")) if img.endswith(('.jpg', '.jpeg', '.png'))][:10]

        # Load the audio file
        audio = AudioFileClip(audio_file)
        audio_duration = audio.duration

        print("image_files:", image_files)
        # Calculate the duration for each image
        image_duration = audio_duration / len(image_files)

        # Create image clips
        image_clips = [ImageClip(img).with_duration(image_duration) for img in image_files]

        # Concatenate image clips
        video = concatenate_videoclips(image_clips, method="compose")

        # Add audio
        video = video.with_audio(audio)

        # Write the final video file
        video.write_videofile(output_file, fps=24)

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description='Create a video from images and audio script.')
    parser.add_argument('names', nargs='+', help='List of names to create video for')
    args = parser.parse_args()
    create_video(args.names)