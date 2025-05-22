// pages/index.tsx

"use client";
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import NextLink from "next/link";
import Head from "next/head";

const features = [
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
];

const steps = [
  "Click on get started",
  "Select your book and chapter",
  "Open a chapter and you are ready to study",
];

export default function Home() {
  return (
    <>
      <Head>
        <title>StudyWizard.xyz - Fun Reading Practice for Kids</title>
        <meta
          name="description"
          content="Interactive reading platform for kids with text-to-speech, AI practice, and translation features"
        />
      </Head>

      <Box
        component="main"
        sx={{
          background: "linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)",
          minHeight: "100vh",
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          {/* Hero Section */}
          <Box component="section" textAlign="center" mb={10}>
            <Typography
              variant="h1"
              fontWeight="bold"
              gutterBottom
              sx={{
                color: "#3b3b8f",
                textShadow: "1px 2px 8px #b3bcf5",
                fontSize: { xs: "2.5rem", md: "3.75rem" },
              }}
            >
              Welcome to StudyWizard.xyz
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ color: "#5c6ac4" }}>
              Make reading magical – interactive reading for kids
            </Typography>
            <NextLink
              href="/courses"
              passHref
              style={{ textDecoration: "none" }}
            >
              <Button
                variant="contained"
                size="large"
                sx={{
                  mt: 4,
                  background:
                    "linear-gradient(90deg, #6ee7b7 0%, #3b82f6 100%)",
                  color: "#fff",
                  fontWeight: "bold",
                  boxShadow: "0 4px 16px rgba(59,130,246,0.15)",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #3b82f6 0%, #6ee7b7 100%)",
                  },
                }}
              >
                Get Started
              </Button>
            </NextLink>
          </Box>

          {/* Features */}
          <Box component="section" mb={10}>
            <Grid container spacing={4}>
              {features.map((feature) => (
                <Grid item xs={12} md={4} key={feature.title}>
                  <Card
                    elevation={4}
                    sx={{
                      background:
                        "linear-gradient(120deg, #f0f9ff 0%, #e0e7ff 100%)",
                      borderRadius: 3,
                      height: "100%",
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
          </Box>

          {/* How It Works */}
          <Box component="section" mb={10} textAlign="center">
            <Typography
              variant="h4"
              gutterBottom
              sx={{ color: "#0ea5e9", fontWeight: "bold" }}
            >
              How It Works
            </Typography>
            <Grid container spacing={4} justifyContent="center" mt={2}>
              {steps.map((step, idx) => (
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
          <Box component="section" textAlign="center" mt={12}>
            <Typography
              variant="h4"
              fontWeight="bold"
              gutterBottom
              sx={{ color: "#f59e42" }}
            >
              Ready to start reading?
            </Typography>
            <NextLink
              href="/courses"
              passHref
              style={{ textDecoration: "none" }}
            >
              <Button
                variant="contained"
                size="large"
                sx={{
                  background:
                    "linear-gradient(90deg, #f59e42 0%, #fbbf24 100%)",
                  color: "#fff",
                  fontWeight: "bold",
                  boxShadow: "0 4px 16px rgba(251,191,36,0.15)",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #fbbf24 0%, #f59e42 100%)",
                  },
                }}
              >
                Try StudyWizard Now
              </Button>
            </NextLink>
          </Box>
        </Container>
      </Box>

      <Box
        component="footer"
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
