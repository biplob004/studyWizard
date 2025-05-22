import { Paper, Typography } from "@mui/material";

interface StatusDisplayProps {
  text: string;
}

export default function StatusDisplay({ text }: StatusDisplayProps) {
  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        mb: 2,
        minHeight: "100px",
        maxHeight: "200px",
        overflow: "auto",
        backgroundColor: "#000",
        color: "#fff",
      }}
    >
      <Typography variant="body1">
        {text || "No status to display. Select text and use the buttons above."}
      </Typography>
    </Paper>
  );
}
