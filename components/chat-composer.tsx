"use client";
import React from "react";
import { Textarea, Button } from "@/components/index";
import { Plus, Send } from "lucide-react";

type ChatComposerProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  onPlusClick?: () => void;
  className?: string;
};

export default function ChatComposer({
  value,
  onChange,
  placeholder = "Ask any thing..",
  onPlusClick,
  className = "",
}: ChatComposerProps) {
  return (
    <div className={`relative border-1 rounded-md shadow-sm ${className}`}>
      <Textarea
        placeholder={placeholder}
        value={value}
        rows={1}
        onChange={onChange}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            e.currentTarget.form?.requestSubmit();
          }
        }}
        className="
                                            chats
                                            md:!text-[17px] 
                                            md:placeholder:text-lg 
                                            resize-none 
                                            overflow-hidden 
                                            shadow-none
                                            min-h-0
                                            border-0
                                            rounded-md 
                                            focus:!outline-none 
                                            focus:!ring-0 
                                            focus:!border-0
                                            leading-tight 
                                            max-h-[24rem]
                                            overflow-y-auto
                                            "
      />
      <div className="py-1 flex justify-between px-2">
        <Button
          type="button"
          className="bg-transparent hover:bg-gray-600/10 rounded-full w-10 h-10"
          onClick={(e) => {
            e.preventDefault();
            onPlusClick?.();
          }}
        >
          <Plus className="text-gray-500" />
        </Button>
        <Button type="submit">
          <Send className="text-white" />
        </Button>
      </div>
    </div>
  );
}
