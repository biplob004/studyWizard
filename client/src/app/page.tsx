// pages/index.tsx

import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Link,
} from "@mui/material";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>StudyWizard.xyz - Fun Reading Practice for Kids</title>
      </Head>

      <Box
        sx={{
          background: "linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)",
          minHeight: "100vh",
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          {/* Hero Section */}
          <Box textAlign="center" mb={10}>
            <Typography
              variant="h2"
              fontWeight="bold"
              gutterBottom
              sx={{ color: "#3b3b8f", textShadow: "1px 2px 8px #b3bcf5" }}
            >
              Welcome to StudyWizard.xyz
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: "#5c6ac4" }}>
              Make reading magical – interactive reading for kids
            </Typography>
            <Button
              variant="contained"
              size="large"
              color="primary"
              sx={{
                mt: 4,
                background: "linear-gradient(90deg, #6ee7b7 0%, #3b82f6 100%)",
                color: "#fff",
                fontWeight: "bold",
                boxShadow: "0 4px 16px rgba(59,130,246,0.15)",
                "&:hover": {
                  background:
                    "linear-gradient(90deg, #3b82f6 0%, #6ee7b7 100%)",
                },
              }}
            >
              <Link
                color="inherit"
                underline="none"
                href="/courses"
                sx={{ display: "flex", alignItems: "center" }}
              >
                Get Started
              </Link>
            </Button>
          </Box>

          {/* Features */}
          <Grid container spacing={4} mb={10}>
            {[
              {
                title: "Listen Text to Speech",
                desc: "Listen and repeat with smart voice guides.",
              },
              {
                title: "Practice Reading",
                desc: "Practice your reading skill with AI",
              },
              {
                title: "Translate",
                desc: "Listen text to voice in your own language",
              },
            ].map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  elevation={4}
                  sx={{
                    background:
                      "linear-gradient(120deg, #f0f9ff 0%, #e0e7ff 100%)",
                    borderRadius: 3,
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{ color: "#2563eb" }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: "#334155", mt: 1 }}
                    >
                      {feature.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* How It Works */}
          <Box mb={10} textAlign="center">
            <Typography
              variant="h4"
              gutterBottom
              sx={{ color: "#0ea5e9", fontWeight: "bold" }}
            >
              How It Works
            </Typography>
            <Grid container spacing={4} justifyContent="center" mt={2}>
              {[
                "Click on get started",
                "Select your book and chapter",
                "Open a chapter and you are ready to study",
              ].map((step, idx) => (
                <Grid item xs={12} md={4} key={idx}>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ color: "#16a34a" }}
                  >
                    Step {idx + 1}
                  </Typography>
                  <Typography sx={{ color: "#334155" }}>{step}</Typography>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Call to Action */}
          <Box textAlign="center" mt={12}>
            <Typography
              variant="h4"
              fontWeight="bold"
              gutterBottom
              sx={{ color: "#f59e42" }}
            >
              Ready to start reading?
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                background: "linear-gradient(90deg, #f59e42 0%, #fbbf24 100%)",
                color: "#fff",
                fontWeight: "bold",
                boxShadow: "0 4px 16px rgba(251,191,36,0.15)",
                "&:hover": {
                  background:
                    "linear-gradient(90deg, #fbbf24 0%, #f59e42 100%)",
                },
              }}
            >
              <Link
                color="inherit"
                href="/courses"
                underline="none"
                sx={{ display: "flex", alignItems: "center" }}
              >
                Try StudyWizard Now
              </Link>
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          backgroundColor: "#22223b",
          color: "#fff",
          py: 4,
          mt: 8,
          textAlign: "center",
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} StudyWizard.xyz. All rights reserved.
        </Typography>
      </Box>
    </>
  );
}
