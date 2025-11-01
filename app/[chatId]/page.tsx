"use client";

import ProtectedLayout from "@/components/PretectedLayout";
import { Textarea, Button } from "@/components/index";
import { useChatStore } from "@/services/ChatsServices";
import ReactMarkdown from "react-markdown";
import { timeAgo } from "@/utils";
import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Send, Plus } from "lucide-react";
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
                    <div className="text-4xl font-semibold">
                      <div className="mb-1">{msg.userChat}</div>
                      {/* <div className="text-gray-500 text-sm">{timeAgo(msg.created_at)}</div> */}
                    </div>
                    <div className=" font-semibold mb-5 cursor-pointer border-b-1">
                      <h1 className="py-2 w-fit border-black border-b-2">Answer</h1>
                    </div>
                    <div className="">
                      <div className="prose prose-sm ">
                        <ReactMarkdown>{msg.botResponse?.text ?? ""}</ReactMarkdown>
                      </div>
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
            <div className="relative border-1 rounded-md shadow-sm">
              <Textarea
                placeholder="Ask any thing.."
                value={message}
                rows={1}
                onChange={(e) => setMessage(e.target.value)}
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
                <Button className="bg-transparent hover:bg-gray-600/10 rounded-full w-10 h-10">
                  <Plus className="text-gray-500" />
                </Button>
                <Button >
                  <Send className="text-white" />
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </ProtectedLayout>
  );
}

export default Page;
