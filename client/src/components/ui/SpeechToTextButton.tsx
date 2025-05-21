import { useState, useRef } from "react";
import { Button, Box, CircularProgress } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { speechToText } from "@/services/api";

interface SpeechToTextButtonProps {
  voiceId: string;
  language: string;
  selectedText: string;
  onTranscriptionComplete: (text: string) => void;
}

export default function SpeechToTextButton({
  voiceId,
  language,
  selectedText,
  onTranscriptionComplete,
}: SpeechToTextButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = async () => {
    if (!mediaRecorderRef.current) return;

    return new Promise<void>((resolve) => {
      mediaRecorderRef.current!.onstop = async () => {
        resolve();
      };

      mediaRecorderRef.current!.stop();
      mediaRecorderRef
        .current!.stream.getTracks()
        .forEach((track) => track.stop());
    });
  };

  const playAudio = (audioUrl: string) => {
    if (!audioPlayerRef.current) {
      audioPlayerRef.current = new Audio(audioUrl);

      audioPlayerRef.current.onended = () => {
        setIsPlaying(false);
        // Reset audio state when playback ends naturally
        resetAudioState();
      };
    } else {
      audioPlayerRef.current.src = audioUrl;
    }

    audioPlayerRef.current.play();
    setIsPlaying(true);
  };

  const stopAudio = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
      setIsPlaying(false);
      // Reset audio state when playback is manually stopped
      resetAudioState();
    }
  };

  // Function to reset the audio state to initial
  const resetAudioState = () => {
    audioUrlRef.current = null;
    if (audioPlayerRef.current) {
      audioPlayerRef.current = null;
    }
  };

  const handleClick = async () => {
    if (!selectedText) return;

    // If audio is playing, stop it and reset to initial state
    if (isPlaying) {
      stopAudio();
      return;
    }

    // If we're not recording, start a new recording
    if (!isRecording) {
      // Clear previous audio URL when starting a new recording
      resetAudioState();
      await startRecording();
      return;
    }

    // If we are recording, stop and process
    setIsProcessing(true);
    await stopRecording();

    try {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/wav",
      });
      const response = await speechToText(
        voiceId,
        language,
        selectedText,
        audioBlob
      );

      onTranscriptionComplete(response.text);

      // Store and play the returned audio
      audioUrlRef.current = response.audioUrl;
      playAudio(response.audioUrl);
    } catch (error) {
      console.error("Error with speech-to-text:", error);
      resetAudioState();
    } finally {
      setIsRecording(false);
      setIsProcessing(false);
    }
  };

  // Determine button text and icon based on current state
  const getButtonText = () => {
    if (isProcessing) return "Processing...";
    if (isRecording) return "Stop Recording";
    if (isPlaying) return "Stop Playback";
    return "Reading Practice";
  };

  const getButtonIcon = () => {
    if (isProcessing) {
      return <CircularProgress size={20} color="inherit" />;
    } else if (isRecording) {
      return <StopIcon />;
    } else if (isPlaying) {
      return <PauseIcon />;
    } else {
      return <MicIcon />;
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Button
        variant="contained"
        color={isRecording || isPlaying ? "secondary" : "primary"}
        startIcon={getButtonIcon()}
        onClick={handleClick}
        disabled={!selectedText || isProcessing}
        fullWidth
      >
        {getButtonText()}
      </Button>
    </Box>
  );
}
