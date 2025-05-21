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
import TranslateIcon from "@mui/icons-material/Translate";
import { translateText, fetchLanguages } from "@/services/api";
import { useAudio } from "@/hooks/useAudio";
import { Language } from "@/types";

interface TranslateButtonProps {
  voiceId: string;
  selectedText: string;
  onTranslationComplete: (text: string) => void;
  setSelectedLanguage_: (lang: string) => void;
}

export default function TranslateButton({
  voiceId,
  selectedText,
  onTranslationComplete,
  setSelectedLanguage_,
}: TranslateButtonProps) {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { isPlaying, playAudio, stopAudio } = useAudio();

  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const languagesData = await fetchLanguages();
        setLanguages(languagesData);
        if (languagesData.length > 0) {
          setSelectedLanguage(languagesData[0].code);
        }
      } catch (error) {
        console.error("Error loading languages:", error);
      }
    };

    loadLanguages();
  }, []);

  const handleLanguageChange = (event: SelectChangeEvent) => {
    setSelectedLanguage(event.target.value);
    setSelectedLanguage_(event.target.value);
  };

  const handleClick = async () => {
    if (!selectedText || !selectedLanguage) return;

    if (isPlaying) {
      stopAudio();
      return;
    }

    try {
      setLoading(true);
      const response = await translateText(
        selectedText,
        selectedLanguage,
        voiceId
      );
      onTranslationComplete(response.translatedText);
      playAudio(response.audioUrl);
    } catch (error) {
      console.error("Error with translation:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <FormControl fullWidth size="small" sx={{ mb: 1 }}>
        <InputLabel id="language-select-label">Language</InputLabel>
        <Select
          labelId="language-select-label"
          id="language-select"
          value={selectedLanguage}
          label="Language"
          onChange={handleLanguageChange}
        >
          {languages.map((language) => (
            <MenuItem key={language.code} value={language.code}>
              {language.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        startIcon={<TranslateIcon />}
        onClick={handleClick}
        disabled={!selectedText || loading}
        fullWidth
      >
        {isPlaying ? "Stop playing" : "Translate"}
      </Button>
    </Box>
  );
}
