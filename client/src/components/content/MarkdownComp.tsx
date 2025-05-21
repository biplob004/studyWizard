import Link from "next/link";
import React, { memo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import "katex/dist/katex.min.css"; // KaTeX styles for math equations
import { useTheme, alpha } from "@mui/material/styles";
import rehypeRaw from "rehype-raw";

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  const theme = useTheme();

  // Define consistent colors based on theme
  const codeInlineBackground = alpha(theme.palette.primary.main, 0.1);
  const codeBlockBackground =
    theme.palette.mode === "dark"
      ? alpha(theme.palette.background.paper, 0.6)
      : alpha(theme.palette.background.paper, 0.8);
  const tableBorderColor = theme.palette.divider;
  const tableHeaderBg =
    theme.palette.mode === "dark"
      ? alpha(theme.palette.primary.main, 0.2)
      : alpha(theme.palette.primary.main, 0.1);
  const tableOddRowBg =
    theme.palette.mode === "dark"
      ? alpha(theme.palette.background.default, 0.3)
      : alpha(theme.palette.background.default, 0.3);
  const tableEvenRowBg =
    theme.palette.mode === "dark"
      ? alpha(theme.palette.background.paper, 0.5)
      : alpha(theme.palette.background.paper, 0.5);

  // Status colors with better accessibility
  const statusColors = {
    complete: theme.palette.success.main,
    pending: theme.palette.warning.main,
    canceled: theme.palette.error.main,
  };

  const components: Partial<Components> = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    code: ({ inline, className, children, ...props }: any) => {
      const isInline = inline ?? false;
      const match = /language-(\w+)/.exec(className || "");

      return !isInline && match ? (
        <pre
          className={`${className} text-sm w-full md:max-w-[500px] overflow-x-auto p-3 rounded-lg mt-2`}
          style={{
            backgroundColor: codeBlockBackground,
            // color: theme.palette.text.primary,
            border: `1px solid ${theme.palette.divider}`,
            maxWidth: "80dvw",
          }}
        >
          <code className={`language-${match[1]}`} {...props}>
            {children}
          </code>
        </pre>
      ) : (
        <code
          className={`text-sm py-0.5 px-1.5 rounded-md ${className || ""}`}
          style={{
            backgroundColor: codeInlineBackground,
            // color: theme.palette.text.primary,
          }}
          {...props}
        >
          {children}
        </code>
      );
    },

    p: ({ children, ...props }) => (
      <p className="py-1 whitespace-pre-line" {...props}>
        {children}
      </p>
    ),

    div: ({ children, ...props }) => (
      <div className="py-1 whitespace-pre-line" {...props}>
        {children}
      </div>
    ),

    ol: ({ children, ...props }) => (
      <ol
        className="list-decimal list-outside ml-8 mt-1 space-y-1 whitespace-normal"
        {...props}
      >
        {children}
      </ol>
    ),

    li: ({ children, ...props }) => (
      <li className="py-0.5 whitespace-normal" {...props}>
        {children}
      </li>
    ),

    ul: ({ children, ...props }) => (
      <ul
        className="list-disc list-outside ml-8 mt-1 space-y-1 whitespace-normal"
        {...props}
      >
        {children}
      </ul>
    ),

    strong: ({ children, ...props }) => (
      <span className="font-semibold" {...props}>
        {children}
      </span>
    ),

    a: ({ children, ...props }) => (
      <Link
        className="hover:underline transition-colors duration-200"
        style={{ color: theme.palette.primary.main }}
        target="_blank"
        rel="noreferrer"
        href={props.href || "#"}
        {...props}
      >
        {children}
      </Link>
    ),

    // Headings with consistent spacing and colors
    h1: ({ children, ...props }) => (
      <h1
        className="text-2xl font-semibold mt-6 mb-3"
        style={{ fontSize: "1.4em" }}
        {...props}
      >
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2
        className="text-xl font-semibold mt-5 mb-2"
        style={{ fontSize: "1.2em" }}
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3
        className="text-lg font-semibold mt-4 mb-2"
        style={{ fontSize: "1em" }}
        {...props}
      >
        {children}
      </h3>
    ),
    h4: ({ children, ...props }) => (
      <h4
        className="text-base font-semibold mt-4 mb-2"
        style={{ fontSize: "0.8em" }}
        {...props}
      >
        {children}
      </h4>
    ),
    h5: ({ children, ...props }) => (
      <h5
        className="text-sm font-semibold mt-3 mb-2"
        style={{ fontSize: "0.6em" }}
        {...props}
      >
        {children}
      </h5>
    ),
    h6: ({ children, ...props }) => (
      <h6
        className="text-sm font-semibold mt-3 mb-2"
        style={{ fontSize: "0.5em" }}
        {...props}
      >
        {children}
      </h6>
    ),

    // Improved table styling
    table: ({ children, ...props }) => (
      <div
        className="overflow-x-auto w-full my-4 rounded-md"
        style={{
          fontSize: "15.8px",
          border: `1px solid ${tableBorderColor}`,
        }}
      >
        <table className="border-collapse w-full" {...props}>
          {children}
        </table>
      </div>
    ),

    thead: ({ children, ...props }) => (
      <thead
        style={{
          backgroundColor: tableHeaderBg,
          color: theme.palette.text.primary,
          borderBottom: `2px solid ${tableBorderColor}`,
        }}
        {...props}
      >
        {children}
      </thead>
    ),

    tbody: ({ children, ...props }) => (
      <tbody
        className="[&>tr]:border-b"
        style={{
          borderBottomColor: tableBorderColor,
        }}
        {...props}
      >
        {children}
      </tbody>
    ),

    tr: ({ children, ...props }) => {
      // Determine row index for zebra striping if available
      // react-markdown does not provide row index, so fallback to default
      return (
        <tr
          style={{
            backgroundColor: tableEvenRowBg,
          }}
          {...props}
        >
          {children}
        </tr>
      );
    },

    th: ({ children, ...props }) => (
      <th
        className="px-4 py-2 text-center first:text-left first:whitespace-nowrap font-semibold"
        style={{
          border: `1px solid ${tableBorderColor}`,
          color: theme.palette.text.primary,
        }}
        {...props}
      >
        {children}
      </th>
    ),

    td: ({ children, ...props }) => {
      // Default text color
      let textColor = theme.palette.text.primary;
      let displayText = children;

      if (typeof children === "string") {
        // Improved status indicator handling
        if (children.startsWith("_")) {
          const status = children.substring(1);
          switch (status) {
            case "complete":
              textColor = statusColors.complete;
              displayText = "Complete";
              break;
            case "pending":
              textColor = statusColors.pending;
              displayText = "Pending";
              break;
            case "canceled":
              textColor = statusColors.canceled;
              displayText = "Canceled";
              break;
            default:
              displayText = status;
          }
        }
      }

      return (
        <td
          className="px-4 py-2 text-center first:text-left"
          style={{
            border: `1px solid ${tableBorderColor}`,
            color: textColor,
          }}
          {...props}
        >
          {displayText}
        </td>
      );
    },
  };

  return (
    <ReactMarkdown
      rehypePlugins={[rehypeRaw]} // Allow raw HTML in Markdown
      remarkPlugins={[remarkGfm]} // Enable GFM support for tables, etc.
      components={components}
    >
      {children}
    </ReactMarkdown>
  );
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children
);
