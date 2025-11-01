"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkToc from "remark-toc";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import { cn } from "@/lib/utils";

type MarkdownRendererProps = {
  content: string;
  className?: string;
};

export default function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const components: Components = {
    h1: (props) => <h1 className="mt-6 mb-3 text-3xl font-bold" {...props} />,
    h2: (props) => <h2 className="mt-6 mb-2 text-2xl font-semibold" {...props} />,
    h3: (props) => <h3 className="mt-5 mb-2 text-xl font-semibold" {...props} />,
    h4: (props) => <h4 className="mt-4 mb-2 text-lg font-semibold" {...props} />,
    p: (props) => <p className="my-3 leading-7" {...props} />,
    ul: (props) => <ul className="my-3 list-disc pl-6 space-y-1" {...props} />,
    ol: (props) => <ol className="my-3 list-decimal pl-6 space-y-1" {...props} />,
    li: (props) => <li className="leading-6" {...props} />,
    a: (props) => (
      <a
        className="text-blue-600 underline underline-offset-2 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    ),
    code: ({ inline, className, children, ...rest }: any) => {
      if (inline) {
        return (
          <code
            className={cn(
              "px-1 py-0.5 rounded bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
              className
            )}
            {...rest}
          >
            {children}
          </code>
        );
      }
      return (
        <code className={cn("font-mono text-sm", className)} {...rest}>
          {children}
        </code>
      );
    },
    pre: (props) => (
      <pre className="my-4 overflow-x-auto rounded-lg bg-gray-900 text-gray-100 p-4 text-sm" {...props} />
    ),
    table: (props) => <table className="w-full border-collapse my-4" {...props} />,
    thead: (props) => <thead className="bg-gray-50 dark:bg-gray-800/60" {...props} />,
    th: (props) => <th className="border px-3 py-2 text-left font-semibold" {...props} />,
    td: (props) => <td className="border px-3 py-2 align-top" {...props} />,
    blockquote: (props) => (
      <blockquote
        className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 italic text-gray-700 dark:text-gray-300 my-4"
        {...props}
      />
    ),
  };

  return (
    <div className={cn("prose prose-sm", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkToc, remarkMath]}
        rehypePlugins={[
          rehypeSlug,
          rehypeAutolinkHeadings,
          rehypeKatex,
          rehypeHighlight,
        ]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
