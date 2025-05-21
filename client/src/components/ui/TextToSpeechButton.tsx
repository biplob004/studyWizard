import { useState, useEffect } from "react";
import {
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { textToSpeech, fetchVoices } from "@/services/api";
import { useAudio } from "@/hooks/useAudio";
import { Voice } from "@/types";

interface TextToSpeechButtonProps {
  voiceIdChanged: (voiceId: string) => void;
  selectedText: string;
}

export default function TextToSpeechButton({
  voiceIdChanged,
  selectedText,
}: TextToSpeechButtonProps) {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("ash");
  const [loading, setLoading] = useState(false);
  const { isPlaying, playAudio, stopAudio } = useAudio();

  useEffect(() => {
    const loadVoices = async () => {
      try {
        const voicesData = await fetchVoices();
        setVoices(voicesData);
        if (voicesData.length > 0) {
          setSelectedVoice(voicesData[0].id);
        }
      } catch (error) {
        console.error("Error loading voices:", error);
      }
    };

    loadVoices();
  }, []);

  const handleVoiceChange = (event: SelectChangeEvent) => {
    setSelectedVoice(event.target.value);
    voiceIdChanged(event.target.value);
  };

  const handleClick = async () => {
    if (!selectedText || !selectedVoice) return;

    if (isPlaying) {
      stopAudio();
      return;
    }

    try {
      setLoading(true);
      const response = await textToSpeech(selectedText, selectedVoice);
      playAudio(response.audioUrl);
    } catch (error) {
      console.error("Error with text-to-speech:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <FormControl fullWidth size="small" sx={{ mb: 1 }}>
        <InputLabel id="voice-select-label">Voice</InputLabel>
        <Select
          labelId="voice-select-label"
          id="voice-select"
          value={selectedVoice}
          label="Voice"
          onChange={handleVoiceChange}
        >
          {voices.map((voice) => (
            <MenuItem key={voice.id} value={voice.id}>
              {voice.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        startIcon={<VolumeUpIcon />}
        onClick={handleClick}
        disabled={!selectedText || loading}
        fullWidth
      >
        {isPlaying ? "Stop playing" : "Listen Text"}
      </Button>
    </Box>
  );
}
