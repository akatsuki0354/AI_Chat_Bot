"use client";
import React, { useState, useEffect } from "react";
import { Textarea, Button } from "@/components/index";
import { Plus, Send } from "lucide-react";
import { openai } from "@/service/ChatsServices.temp";

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
  placeholder = "Ask anything...",
  onPlusClick,
  className = "",
}: ChatComposerProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);

  // 🔹 Generate AI suggestions based on the current input
  const AiSuggest = async (input: string): Promise<string[]> => {
    try {
      setLoading(true);
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini", // ✅ use valid OpenAI model
        messages: [
          {
            role: "system",
            content:
              "You are Aureluis AI, a helpful assistant that suggests related follow-up questions or completions.",
          },
          {
            role: "user",
            content: `Generate 5 short suggestions or questions related to: "${input}"`,
          },
        ],
      });

      const raw = response.choices[0].message?.content || "";
      const list = raw
        .split("\n")
        .map((s) => s.replace(/^\d+\.\s*/, "").trim())
        .filter(Boolean)
        .slice(0, 5);

      return list;
    } catch (err) {
      console.error("AI Suggestion error:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Auto-update suggestions when user types
  useEffect(() => {
    if (value.trim().length === 0) {
      setSuggestions([]);
      setSelectedIndex(-1);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      const aiSuggestions = await AiSuggest(value);
      setSuggestions(aiSuggestions);
      setSelectedIndex(-1);
    }, 600); // small delay to prevent spamming API

    return () => clearTimeout(delayDebounce);
  }, [value]);

  // 🔹 When user selects a suggestion
  const handleSelect = (suggestion: string) => {
    const syntheticEvent = {
      target: { value: suggestion },
      currentTarget: { value: suggestion },
    } as React.ChangeEvent<HTMLTextAreaElement>;
    onChange(syntheticEvent);
    setSuggestions([]);
    setSelectedIndex(-1);
  };

  // 🔹 Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (suggestions.length === 0) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        e.currentTarget.form?.requestSubmit();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        if (!e.shiftKey && selectedIndex >= 0) {
          e.preventDefault();
          handleSelect(suggestions[selectedIndex]);
        } else if (!e.shiftKey) {
          e.preventDefault();
          e.currentTarget.form?.requestSubmit();
        }
        break;
      case "Escape":
        e.preventDefault();
        setSuggestions([]);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div className={`relative border rounded-md shadow-sm ${className}`}>
      {/* 🔹 Suggestion dropdown */}
      {suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto z-10 mt-1">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSelect(suggestion)}
              className={`px-4 py-2 cursor-pointer text-gray-700 transition-colors ${selectedIndex === index
                  ? "bg-blue-100 border-l-4 border-blue-500"
                  : "hover:bg-gray-100"
                }`}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
      <Textarea
        placeholder={placeholder}
        value={value}
        rows={1}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        className="chats md:!text-[17px] md:placeholder:text-lg resize-none overflow-hidden shadow-none min-h-0 border-0 rounded-md focus:!outline-none focus:!ring-0 focus:!border-0 leading-tight max-h-[24rem] overflow-y-auto"
      />

      {/* 🔹 Bottom buttons */}
      <div className="py-1 flex justify-between px-2">
        <Button
          type="button"
          className="bg-transparent hover:bg-gray-600/10 rounded-full w-10 h-10"
          onClick={() => {
            console.log("Plus clicked");
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
