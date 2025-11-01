"use client";
import ProtectedLayout from "@/components/PretectedLayout"
import { useChatStore } from "@/services/ChatsServices"
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import ChatComposer from "@/components/chat-composer";
import Loading from "@/components/loading";
function page() {
    const { addChat } = useChatStore();
    const { getChatsHistory } = useChatStore();
    const [message, setMessage] = useState<string>("");
    const [loading, setLoading] = useState<null | "sending" | "loadingHistory">(null);
    const [chatsHistoryData, setChatsHistoryData] = useState<any[]>([]);
    const routes = useRouter();

    const chatsHistory = async () => {
        setLoading("loadingHistory");
        try {
            const history = await getChatsHistory();
            console.log("Chats History:", history);
            setChatsHistoryData(history);
        } catch (error) {
            console.error("Error fetching chats history:", error);
        } finally {
            setLoading(null);
        }
    };

    useEffect(() => {
        chatsHistory();
    }, []);

    // Function to handle sending a message
    const handleSend = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!message.trim()) return;
        setMessage("");
        setLoading("sending");
        try {
            // Call addChat and get the new conversation ID if created
            const newChatId = await addChat(message);

            // If a new conversation was created, navigate to its page
            if (newChatId) {
                routes.push(`/${newChatId}`);
            }

        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setLoading(null);
        }
    };


    return (
        <ProtectedLayout>

            <div className="flex flex-col gap-14 h-[calc(100vh-56px)] px-4 py-4 justify-center">
                <div >
                    {loading === "loadingHistory" ? (
                        <div>
                            <Loading />
                        </div>
                    ) : chatsHistoryData.length === 0 ? (
                        <div className="">
                            <h1 className="text-3xl text-center font-semibold">Welcome to Aurelius Chatbot</h1>
                        </div>
                    ) : (
                        <div>
                            <h1 className="text-3xl text-center font-semibold">Aurelius Chatbot</h1>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSend}>
                    <div className="mx-auto w-full max-w-3xl">
                        {loading === "sending" && (
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
    )
}

export default page