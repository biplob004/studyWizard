import { ReactNode } from "react";
import { Box, Container, CssBaseline, ThemeProvider } from "@mui/material";
import theme from "@/styles/theme";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth={false} disableGutters>
        <Box
          sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
        >
          {children}
        </Box>
      </Container>
    </ThemeProvider>
  );
}
