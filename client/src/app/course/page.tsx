"use client";
import { useState } from "react";
import { Box, Paper, Typography, Divider } from "@mui/material";
import ContentViewer from "@/components/content/ContentViewer";
import NavigationButtons from "@/components/ui/NavigationButtons";
import TextToSpeechButton from "@/components/ui/TextToSpeechButton";
import SpeechToTextButton from "@/components/ui/SpeechToTextButton";
import TranslateButton from "@/components/ui/TranslateButton";
import StatusDisplay from "@/components/ui/StatusDisplay";
import { useContentNavigation } from "@/hooks/useContentNavigation";
import { useTextSelection } from "@/hooks/useTextSelection";
import { useSearchParams } from "next/navigation";

// import language from "react-syntax-highlighter/dist/esm/languages/hljs/1c";

export default function HomePage() {
  const searchParams = useSearchParams();
  const course_path = searchParams.get("course_path") || "chapter-1";

  const [statusText, setStatusText] = useState("");
  const { selectedText, clearSelection } = useTextSelection();
  const [voiceId, setVoiceId] = useState<string>("ash");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("English");
  const {
    content,
    loading,
    error,
    navigateNext,
    navigatePrevious,
    hasNext,
    hasPrevious,
  } = useContentNavigation(course_path, "intro"); // Start with an initial content ID

  // console.log("======>>==", course_path);

  const handleTranscriptionComplete = (text: string) => {
    setStatusText(`Your speech: ${text}`);
  };

  const handleTranslationComplete = (text: string) => {
    setStatusText(`Translation: ${text}`);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        height: "100vh",
      }}
    >
      {/* Left panel - Content Display */}
      <Box
        sx={{
          flex: 1,
          height: "100%",
          padding: "10px",
          backgroundColor: "#4287f5",
        }}
      >
        <ContentViewer content={content} loading={loading} error={error} />
      </Box>

      {/* Right panel - Controls */}
      <Box
        sx={{
          width: "350px",
          p: 2,
          height: "100%",
          overflow: "auto",
          // backgroundColor: "#f9f9f9",
          backgroundColor: "#4287f5",
        }}
      >
        <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: "#32eeff" }}>
          <Typography variant="h6" gutterBottom>
            Text Interaction
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select text from the content and use these tools:
          </Typography>

          <TextToSpeechButton
            voiceIdChanged={(voiceId) => setVoiceId(voiceId)}
            selectedText={selectedText}
          />

          <SpeechToTextButton
            voiceId={voiceId}
            language={selectedLanguage}
            selectedText={selectedText}
            onTranscriptionComplete={handleTranscriptionComplete}
          />

          <TranslateButton
            voiceId={voiceId}
            selectedText={selectedText}
            onTranslationComplete={handleTranslationComplete}
            setSelectedLanguage_={(lang) => setSelectedLanguage(lang)}
          />
        </Paper>

        <Paper elevation={2} sx={{ p: 2, backgroundColor: "#32eeff" }}>
          <Typography variant="h6" gutterBottom>
            Response
          </Typography>
          <StatusDisplay text={loading ? "Loading..." : statusText} />

          {selectedText && (
            <Box sx={{ mt: 2 }}>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="subtitle2">Selected Text:</Typography>
              <Paper
                variant="outlined"
                sx={{
                  p: 1,
                  mt: 1,
                  // backgroundColor: "#f5f5f5",
                  maxHeight: "100px",
                  overflow: "auto",
                  backgroundColor: "#000",
                  color: "#fff",
                }}
              >
                <Typography variant="body2">{selectedText}</Typography>
              </Paper>
            </Box>
          )}
        </Paper>

        <Paper elevation={2} sx={{ p: 2, mt: 3, backgroundColor: "#32eeff" }}>
          <Typography variant="h6" gutterBottom>
            Navigation
          </Typography>
          <NavigationButtons
            onNext={navigateNext}
            onPrevious={navigatePrevious}
            hasNext={hasNext}
            hasPrevious={hasPrevious}
          />
        </Paper>
      </Box>
    </Box>
  );
}
