"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Breadcrumbs,
  Link,
  CircularProgress,
  Container,
  Divider,
} from "@mui/material";
import {
  Folder as FolderIcon,
  Description as FileIcon,
  ChevronRight as ChevronRightIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

// Define our data types
interface FileItem {
  name: string;
  type: "file" | "folder";
  path: string;
  content?: string;
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#f50057",
    },
  },
});

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CoursesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [items, setItems] = useState<FileItem[]>([]);
  const [currentPath, setCurrentPath] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  useEffect(() => {
    // set course_path to selected path
    const params = new URLSearchParams(window.location.search);
    params.set("course_path", currentPath);
    router.push(`${pathname}?${params.toString()}`);

    fetchItems(currentPath);
  }, [currentPath]);

  // on load only once | refresh
  useEffect(() => {
    const course_path = searchParams.get("course_path");
    navigateToBreadcrumb(course_path || "");
  }, []);

  // Helps to go back and forward
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const course_path = params.get("course_path") || "";
      setCurrentPath(course_path);
      setSelectedFile(null);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const fetchItems = async (path: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/api/courses?path=${encodeURIComponent(path)}`
      );
      const data = await response.json();
      // console.log(data);

      setItems(data.items);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  // Clicking on items, like folder or file
  const handleItemClick = (item: FileItem) => {
    if (item.type === "folder") {
      setCurrentPath(item.path);
      setSelectedFile(null);
    } else {
      setSelectedFile(item);
      // Open another page, with selected course file
      router.push(`/course?course_path=${item.path.replace(/\.txt$/, "")}`);
    }
  };

  // Clicking on nav eg: Home > English > chapter-1
  const navigateToBreadcrumb = (path: string) => {
    setCurrentPath(path);
    setSelectedFile(null);
  };

  const pathParts = currentPath.split("/").filter(Boolean);

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            All courses
          </Typography>

          <Breadcrumbs
            separator={<ChevronRightIcon fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ mb: 3 }}
          >
            <Link
              color="inherit"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigateToBreadcrumb("");
              }}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
              Home
            </Link>

            {pathParts.map((part, index) => {
              const path = pathParts.slice(0, index + 1).join("/");
              return (
                <Link
                  key={path}
                  color="inherit"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateToBreadcrumb(path);
                  }}
                >
                  {part}
                </Link>
              );
            })}
          </Breadcrumbs>

          <Box sx={{ display: "flex", gap: 3 }}>
            <Paper
              elevation={2}
              sx={{
                width: "100%",
                maxHeight: "70vh",
                overflow: "auto",
                borderRadius: 1,
              }}
            >
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <List>
                  {items.length === 0 ? (
                    <ListItem>
                      <ListItemText primary="No items found" />
                    </ListItem>
                  ) : (
                    items.map((item) => (
                      <ListItem key={item.path} disablePadding>
                        <ListItemButton
                          onClick={() => handleItemClick(item)}
                          selected={selectedFile?.path === item.path}
                        >
                          <ListItemIcon>
                            {item.type === "folder" ? (
                              <FolderIcon color="primary" />
                            ) : (
                              <FileIcon color="secondary" />
                            )}
                          </ListItemIcon>
                          <ListItemText primary={item.name} />
                        </ListItemButton>
                      </ListItem>
                    ))
                  )}
                </List>
              )}
            </Paper>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
