import { useState, useRef, useEffect } from 'react';

export const useAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audioRef.current.addEventListener('ended', handleEnded);
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleEnded);
      }
    };
  }, []);

  const playAudio = (url: string) => {
    if (!audioRef.current) return;
    
    if (isPlaying && audioUrl === url) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (audioUrl !== url) {
        audioRef.current.src = url;
        setAudioUrl(url);
      }
      
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(err => {
          console.error('Error playing audio:', err);
          setIsPlaying(false);
        });
    }
  };

  const stopAudio = () => {
    if (!audioRef.current) return;
    
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  };

  return { isPlaying, playAudio, stopAudio };
};
