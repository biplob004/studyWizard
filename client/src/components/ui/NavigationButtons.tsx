import { Box, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface NavigationButtonsProps {
  onNext: () => void;
  onPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
}

export default function NavigationButtons({
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
}: NavigationButtonsProps) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
      <Button
        variant="contained"
        startIcon={<ArrowBackIcon />}
        onClick={onPrevious}
        disabled={!hasPrevious}
        sx={{ backgroundColor: "blue" }}
      >
        Previous
      </Button>
      <Button
        variant="contained"
        endIcon={<ArrowForwardIcon />}
        onClick={onNext}
        disabled={!hasNext}
        sx={{ backgroundColor: "blue" }}
      >
        Next
      </Button>
    </Box>
  );
}
