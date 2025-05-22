import { Box } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialLight } from "react-syntax-highlighter/dist/cjs/styles/prism";
import "katex/dist/katex.min.css";
import { useState, useEffect } from "react";

interface MarkdownRendererProps {
  markdown: string;
}

export default function MarkdownRenderer({ markdown }: MarkdownRendererProps) {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    // Ensure markdown is a string
    if (markdown && typeof markdown === "string") {
      setContent(markdown);
    } else {
      console.error("Invalid markdown content:", markdown);
      setContent("Error: Invalid markdown content");
    }
  }, [markdown]);

  return (
    <Box
      sx={{
        padding: 2,
        borderRadius: 2,
        boxShadow: 1,
        "& img": {
          maxWidth: "100%",
          height: "auto",
        },
        "& table": {
          borderCollapse: "collapse",
          width: "100%",
          margin: "16px 0",
        },
        "& th, & td": {
          border: "1px solid #ddd",
          padding: "8px",
          textAlign: "left",
        },
        "& th": {
          backgroundColor: "#f2f2f2",
        },
        // Add more styling to ensure text visibility
        "& p, & h1, & h2, & h3, & h4, & h5, & h6, & li, & a": {
          color: "inherit",
        },
      }}
    >
      {content ? (
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            code({
              inline,
              className,
              children,
              ...props
            }: {
              inline?: boolean;
              className?: string;
              children?: React.ReactNode;
            }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter
                  style={materialLight}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      ) : (
        <p>No content to display</p>
      )}
    </Box>
  );
}
