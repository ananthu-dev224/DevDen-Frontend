import React, { useRef, useState, useEffect } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';

const CustomAudioPlayer = ({ audioUrl }: any) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  useEffect(() => {
    const audio = audioRef.current;

    const updateTime = () => {
      if (audio) {
        setCurrentTime(audio.currentTime);
      }
    };

    const setAudioData = () => {
      if (audio) {
        setDuration(audio.duration);
      }
    };

    const handleAudioEnd = () => {
      setIsPlaying(false); // Switch back to play icon
      setCurrentTime(0); // Reset current time to 0
    };

    if (audio) {
      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', setAudioData);
      audio.addEventListener('canplay', setAudioData);
      audio.addEventListener('canplaythrough', setAudioData); // Ensure duration is set
      audio.addEventListener('ended', handleAudioEnd); // Handle when audio ends
    }

    return () => {
      if (audio) {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', setAudioData);
        audio.addEventListener('canplay', setAudioData);
        audio.removeEventListener('canplaythrough', setAudioData);
        audio.removeEventListener('ended', handleAudioEnd);
      }
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    const newTime = parseFloat(e.target.value);
    if (audio) {
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || time === Infinity) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-700 rounded-lg shadow-lg w-full max-w-xs">
      <audio ref={audioRef} src={audioUrl} />
      <div className="flex items-center space-x-4 w-full">
        <button
          onClick={togglePlay}
          className="p-2 rounded-full text-white"
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleTimeChange}
          className="flex-1 h-2 bg-gray-600 rounded-lg cursor-pointer"
        />
        <span className="text-white text-sm">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>
    </div>
  );
};

export default CustomAudioPlayer;