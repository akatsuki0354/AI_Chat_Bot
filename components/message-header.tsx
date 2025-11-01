"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { useIsMultiLine } from "@/hooks/use-is-multiline";
import { timeAgo } from "@/utils";

export function MessageHeader({ text, createdAt }: { text: string; createdAt: string }) {
  const { ref, isMulti } = useIsMultiLine<HTMLDivElement>();
  return (
    <div className={cn(isMulti ? "text-md" : "text-4xl", "font-semibold")}>
      <div ref={ref} className="mb-1 whitespace-pre-wrap break-words">{text}</div>
      {/* <div className="text-gray-500 text-sm">{timeAgo(createdAt)}</div> */}
    </div>
  );
}
