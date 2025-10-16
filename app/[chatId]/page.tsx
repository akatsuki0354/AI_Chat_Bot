"use client";

import ProtectedLayout from "@/components/PretectedLayout";
import { Input, Button } from "@/components/index";
import { useChatStore } from "@/services/ChatsServices";
import ReactMarkdown from "react-markdown";
import { timeAgo } from "@/utils";
import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";

function Page() {
  const { addChat, deleteChat, setCurrentConvoId } = useChatStore();
  const params = useParams();
  const routes = useRouter();
  const chatId = params.chatId as string;
  const [chat, setChat] = useState<any | null>(null);
  const [sending, setSending] = useState<null | "sending">(null);
  const [message, setMessage] = useState<string>("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // Fetch chat
  useEffect(() => {
    if (!chatId) return;
    setCurrentConvoId(chatId);
    const fetchChat = async () => {
      setLoading(true);
      const data = await useChatStore.getState().getChatById(chatId);
      if (!data && chatId != 'dashboard') {
        routes.push('/')
      }
      setChat(data);
      setLoading(false);
    };
    fetchChat();
  }, [chatId, setCurrentConvoId]);

  // Send message
  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending("sending");
    const localMessage = message;
    setMessage("");
    try {
      await addChat(localMessage);
      const updated = await useChatStore.getState().getChatById(chatId);
      setChat(updated);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(null);
    }
  };

  // Delete chat
  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteChat(id);
      routes.push("/");
    } catch (error) {
      console.error("Error deleting chat:", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <ProtectedLayout>
      <div className="flex flex-col  h-[calc(100vh-56px)] px-4 py-4 justify-between">
        <div className="chats overflow-y-auto flex flex-end">
          <div className="mx-auto w-full max-w-3xl h-[calc(100vh-150px)] flex flex-col gap-4">
            {loading && <p>Loading chat...</p>}
            {!loading && chat && (
              <div className="flex flex-col gap-4">
                {(chat.chats || []).map((msg: any, idx: number) => (
                  <div key={idx} className="flex flex-col gap-2">
                    <div className="self-end bg-blue-100 p-4 rounded-lg shadow-md">
                      <div className="mb-2">{msg.userChat}</div>
                      <div className="text-gray-500 text-sm">{timeAgo(msg.created_at)}</div>
                    </div>
                    <div className="self-start bg-gray-100 p-4 rounded-2xl shadow-md leading-relaxed text-gray-800">
                      <div className="prose prose-sm">
                        <ReactMarkdown>{msg.botResponse?.text ?? ""}</ReactMarkdown>
                      </div>
                      <div className="text-gray-400 text-xs text-right mt-2">
                        {timeAgo(msg.created_at)}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 text-red-500"
                        onClick={() => handleDelete(chat.id)}
                      >
                        {deletingId === chat.id ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        <form onSubmit={handleSend}>
          <div className="mx-auto w-full max-w-3xl">
            {sending === "sending" && (
              <div className="flex ">
                <div className="flex gap-5 text-gray-900 text-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mx-auto"></div>
                  <p>thinking...</p>
                </div>
              </div>
            )}
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Ask Anything.."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button>Send</Button>
            </div>
          </div>
        </form>
      </div>
    </ProtectedLayout>
  );
}

export default Page;
