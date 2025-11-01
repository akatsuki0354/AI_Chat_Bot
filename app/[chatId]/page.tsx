"use client";

import ProtectedLayout from "@/components/PretectedLayout";
import { useChatStore } from "@/services/ChatsServices";
import { timeAgo } from "@/utils";
import MarkdownRenderer from "@/components/markdown-renderer";
import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { MessageHeader } from "@/components/message-header";
import ChatComposer from "@/components/chat-composer";
function Page() {
  const { addChat, setCurrentConvoId } = useChatStore();
  const params = useParams();
  const routes = useRouter();
  const chatId = params.chatId as string;
  const [chat, setChat] = useState<any | null>(null);
  const [sending, setSending] = useState<null | "sending">(null);
  const [message, setMessage] = useState<string>("");
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

  

  return (
    <ProtectedLayout>
      <div className="flex flex-col  h-[calc(100vh-56px)] px-4 py-4 justify-between">
        <div className="chats overflow-y-auto flex flex-end">
          <div className="mx-auto w-full max-w-3xl h-[calc(100vh-200px)] flex flex-col gap-4">
            {!loading && chat && (
              <div className="flex flex-col gap-4">
                {(chat.chats || []).map((msg: any, idx: number) => (
                  <div key={idx} className={`${idx === chat.chats.length - 1 ? 'h-[calc(100vh-200px)]' : ''} `}>
                    <MessageHeader text={msg.userChat} createdAt={msg.created_at} />
                    <div className=" font-semibold mb-5 border-b-1">
                      <h1 className="py-2 w-fit border-black border-b-2">Answer</h1>
                    </div>
                    <div className="">
                      <MarkdownRenderer content={msg.botResponse?.text ?? ""} />
                      <div className="text-gray-400 text-xs text-right mt-2">
                        {timeAgo(msg.created_at)}
                      </div>
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
            <ChatComposer
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </form>
      </div>
    </ProtectedLayout>
  );
}

export default Page;
