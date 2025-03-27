import React, { useRef, useState } from 'react';
import styled from 'styled-components';

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

const MediaPlayer: React.FC<MediaPlayerProps> = ({ source, playlist = [] }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1); // Volume range: 0 to 1

  const currentSource = playlist.length > 0 ? playlist[currentTrackIndex] : source;

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
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

  return (
    <MediaPlayerContainer>
      <audio
        ref={audioRef}
        src={currentSource || undefined} // Pass undefined if currentSource is an empty string
        onEnded={nextTrack} // Automatically play the next track when the current one ends
      />
      <h3>Now Playing</h3>
      <p>{currentSource ? currentSource.split('/').pop() : 'No track selected'}</p>
      <Controls>
        <button onClick={previousTrack} disabled={playlist.length === 0} className="btn btn-primary">
          Previous
        </button>
        <button onClick={isPlaying ? stopAudio : playAudio} className="btn btn-primary">
          {isPlaying ? 'Stop' : 'Play'}
        </button>
        <button onClick={nextTrack} disabled={playlist.length === 0} className="btn btn-primary">
          Next
        </button>
      </Controls>
      <div>
        <label htmlFor="volume">Volume:</label>
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