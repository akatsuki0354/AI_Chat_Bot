"use client";

import { useParams } from "next/navigation";
import ProtectedLayout from "@/components/PretectedLayout";
import supabase from "@/lib/supabase";
import * as React from "react";

function Page() {
  const params = useParams();
  const chatId = params.chatId as string;

  const [chat, setChat] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchChat = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("convo")
        .select("*")
        .eq("id", chatId)
        .single();

      if (error) {
        console.error("Error fetching chat:", error);
      } else {
        setChat(data);
        console.log("Fetched chat:", data);
      }
      setLoading(false);
    };

    if (chatId) fetchChat();
  }, [chatId]);

  if (loading) {
    return (
      <ProtectedLayout>
        <p>Loading chat...</p>
      </ProtectedLayout>
    );
  }

  if (!chat) {
    return (
      <ProtectedLayout>
        <p>No chat found.</p>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <h1>Chat ID: {chatId}</h1>

      {chat.chats && Array.isArray(chat.chats) ? (
        chat.chats.map((message: any, index: number) => (
          <div key={index} className="p-2 border-b">
            <p><strong>User:</strong> {message.userChat}</p>
            <p><strong>Bot:</strong> {message.botResponse}</p>
          </div>
        ))
      ) : (
        <p>No messages found.</p>
      )}
    </ProtectedLayout>
  );
}

export default Page;
