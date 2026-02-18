"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface StreamingTextProps {
  text: string;
}

export function StreamingText({ text }: StreamingTextProps) {
  if (!text) return null;

  return (
    <div className="prose prose-neutral max-w-none prose-headings:text-foreground prose-headings:font-bold prose-headings:tracking-tight prose-p:text-foreground/85 prose-strong:text-foreground prose-li:text-foreground/85 prose-a:text-[#004489] prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-h2:text-lg prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-3 prose-h2:border-b prose-h2:border-border/40 first:prose-h2:mt-0 prose-h3:text-base prose-h3:mt-6 prose-h3:mb-2 prose-p:text-sm prose-p:leading-[1.85] prose-p:mb-4 prose-li:text-sm prose-li:leading-[1.85] prose-ol:my-3 prose-ul:my-3 prose-code:text-[#004489] prose-code:bg-[#e8f1fa] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-medium prose-code:before:content-none prose-code:after:content-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
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
          h2: ({ children, ...props }) => (
            <h2 {...props}>
              <span className="text-gradient">{children}</span>
            </h2>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
