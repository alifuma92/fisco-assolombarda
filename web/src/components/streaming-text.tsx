"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  BookOpen,
  Gavel,
  AlertCircle,
  MessageSquareText,
} from "lucide-react";
import type { ReactNode } from "react";

interface StreamingTextProps {
  text: string;
}

function getNodeText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (!node) return "";
  if (Array.isArray(node)) return node.map(getNodeText).join("");
  if (typeof node === "object" && "props" in node) {
    return getNodeText((node as any).props?.children);
  }
  return "";
}

const SECTION_META: { match: string; icon: ReactNode }[] = [
  {
    match: "risposta",
    icon: <MessageSquareText className="h-[18px] w-[18px]" />,
  },
  {
    match: "normativa",
    icon: <BookOpen className="h-[18px] w-[18px]" />,
  },
  {
    match: "prassi",
    icon: <Gavel className="h-[18px] w-[18px]" />,
  },
  {
    match: "interpelli",
    icon: <Gavel className="h-[18px] w-[18px]" />,
  },
  {
    match: "note",
    icon: <AlertCircle className="h-[18px] w-[18px]" />,
  },
];

export function StreamingText({ text }: StreamingTextProps) {
  if (!text) return null;

  return (
    <div className="streaming-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => {
            const raw = getNodeText(children).toLowerCase();
            const meta = SECTION_META.find((s) => raw.includes(s.match));
            return (
              <h2>
                {meta && <span className="section-icon">{meta.icon}</span>}
                <span className="text-gradient">{children}</span>
              </h2>
            );
          },
          a: ({ href, children, ...props }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            >
              {children}
            </a>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
