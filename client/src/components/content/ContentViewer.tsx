import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import MarkdownRenderer from "./MarkdownRenderer";
import { Markdown } from "./MarkdownComp";
import { Content } from "@/types";

interface ContentViewerProps {
  content: Content | null;
  loading: boolean;
  error: string | null;
}

export default function ContentViewer({
  content,
  loading,
  error,
}: ContentViewerProps) {
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
          backgroundColor: "#000",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!content) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="info">
          No content selected. Please choose a content to view.
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100%",
        overflow: "auto",
        borderRight: "1px solid rgba(0, 0, 0, 0.12)",
        // border: " 2px dashed rgba(30, 78, 236, 0.84)",
        padding: "2rem",
        marginRight: "2px",
        fontSize: "1.5em",
        backgroundColor: "#000",
        borderRadius: "10px",
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        sx={{ p: 2, borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}
      >
        {content.title}
      </Typography>
      {/* <MarkdownRenderer markdown={content.markdown} /> */}
      <Markdown children={content.markdown} />
    </Box>
  );
}
