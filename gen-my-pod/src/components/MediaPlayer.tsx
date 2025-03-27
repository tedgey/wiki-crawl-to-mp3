import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faStepBackward, faStepForward, faVolumeUp } from '@fortawesome/free-solid-svg-icons';

interface MediaPlayerProps {
  source: string; // The source URL for the audio file
  playlist?: string[]; // Optional playlist of audio files
}

const MediaPlayerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 100%;
  margin: 0 auto;
`;

const Controls = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const VolumeSlider = styled.input`
  width: 100px;
`;

const ProgressBar = styled.input`
  width: 200%;
  margin-top: 10px;
`;

const MediaPlayer: React.FC<MediaPlayerProps> = ({ source, playlist = [] }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5); // Default volume set to 0.5 (half)
  const [progress, setProgress] = useState<number>(0); // Current progress of the track
  const [duration, setDuration] = useState<number>(0); // Total duration of the track

  const currentSource = playlist.length > 0 ? playlist[currentTrackIndex] : source;

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause(); // Pause the audio without resetting the playback position
      setIsPlaying(false);
    }
  };

  const nextTrack = () => {
    if (playlist.length > 0) {
      setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length);
      setIsPlaying(false); // Stop current playback
    }
  };

  const previousTrack = () => {
    if (playlist.length > 0) {
      setCurrentTrackIndex((prevIndex) =>
        prevIndex === 0 ? playlist.length - 1 : prevIndex - 1
      );
      setIsPlaying(false); // Stop current playback
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleProgressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(event.target.value);
    setProgress(newProgress);
    if (audioRef.current) {
      audioRef.current.currentTime = newProgress; // Seek to the selected time
    }
  };

  // Update progress as the track plays
  useEffect(() => {
    const updateProgress = () => {
      if (audioRef.current) {
        setProgress(audioRef.current.currentTime);
        setDuration(audioRef.current.duration || 0);
      }
    };

    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', updateProgress);
      return () => {
        audioRef.current?.removeEventListener('timeupdate', updateProgress);
      };
    }
  }, []);

  // Set the default volume to 0.5 when the component mounts
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
    }
  }, []);

  // Automatically play audio when the source is updated
  useEffect(() => {
    if (audioRef.current && currentSource) {
      audioRef.current.load(); // Reload the audio element with the new source
      playAudio(); // Automatically play the audio
    }
  }, [currentSource]); // Trigger this effect when currentSource changes

  return (
    <MediaPlayerContainer>
      <audio
        ref={audioRef}
        src={currentSource || undefined} // Pass undefined if currentSource is an empty string
        onEnded={nextTrack} // Automatically play the next track when the current one ends
      />
      <p>{currentSource ? currentSource.split('/').pop() : 'No track selected'}</p>
        <div className="d-flex flex-column align-items-center">
            <Controls>
                <button onClick={previousTrack} disabled={playlist.length === 0} className="btn btn-primary">
                <FontAwesomeIcon icon={faStepBackward} /> {/* Previous Icon */}
                </button>
                <button onClick={isPlaying ? pauseAudio : playAudio} className="btn btn-primary">
                <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} /> {/* Pause/Play Icon */}
                </button>
                <button onClick={nextTrack} disabled={playlist.length === 0} className="btn btn-primary">
                <FontAwesomeIcon icon={faStepForward} /> {/* Next Icon */}
                </button>
            </Controls>
            <ProgressBar
                type="range"
                min="0"
                max={duration || 0}
                step="0.1"
                value={progress}
                onChange={handleProgressChange}
            />
        </div>
      <div className="d-flex align-items-center">
        <FontAwesomeIcon icon={faVolumeUp} className="me-2" />
        <VolumeSlider
          id="volume"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
        />
      </div>
    </MediaPlayerContainer>
  );
};

export default MediaPlayer;