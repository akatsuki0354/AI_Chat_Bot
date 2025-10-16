import ProtectedLayout from "@/components/PretectedLayout"
import { Input, Button } from "@/components/index"
import { useChatStore } from "@/services/ChatsServices"
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { timeAgo } from "@/utils";
function page() {
    const { addChat, getChats, deleteChat } = useChatStore();
    const [chats, setChats] = useState<string[] | null>([]);
    const [message, setMessage] = useState<string>("");
    const [loading, setLoading] = useState<null | "sending">(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom when chats change
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chats]);

    // Fetch chats on component mount
    useEffect(() => {
        const fetchChats = async () => {
            const chats = await getChats();
            setChats(chats ?? [] as any);
            console.log("chats : ", chats ?? "no chats");
        };
        fetchChats();
    }, [getChats]);

    // Function to handle sending a message
    const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage("");
        try {
            setLoading("sending");
            await addChat(message);
            const updatedChats = await getChats();
            setChats(updatedChats as any);
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setLoading(null);
        }
    };

    // Function to handle deleting a chat
    const handleDelete = async (chatId: string) => {
        try {
            setDeletingId(chatId);
            await deleteChat(chatId);
            const updatedChats = await getChats();
            setChats(updatedChats as any);
        } catch (error) {
            console.error("Error deleting chat:", error);
        } finally {
            setLoading(null);
        }
    };

    return (
        <ProtectedLayout>

            <div className="flex flex-col  h-[calc(100vh-56px)] px-4 py-4 justify-between">
                <div className="chats overflow-y-auto flex flex-end">
                    <div className="mx-auto w-full max-w-3xl h-[calc(100vh-150px)] flex flex-col gap-4">
                        {chats?.map((chatItem: any) => (
                            <div key={chatItem.id} className="flex flex-col gap-4">
                                {chatItem.chats.map((message: any, idx: number) => (
                                    <div key={idx} className="flex flex-col gap-2">
                                        {/* User message */}
                                        <div className="self-end bg-blue-100 p-4 rounded-lg shadow-md">
                                            <div className="mb-2">{message.userChat}</div>
                                            <div className="text-gray-500 text-sm">{timeAgo(message.created_at)}</div>
                                        </div>

                                        {/* Bot message */}
                                        <div className="self-start bg-gray-100 p-4 rounded-2xl shadow-md leading-relaxed text-gray-800">
                                            <div className="prose prose-sm">
                                                <ReactMarkdown>{message.botResponse}</ReactMarkdown>
                                            </div>
                                            <div className="text-gray-400 text-xs text-right mt-2">
                                                {timeAgo(message.created_at)}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="mt-2 text-red-500"
                                                onClick={() => handleDelete(chatItem.id)}
                                            >
                                                {deletingId === chatItem.id ? "Deleting..." : "Delete"}
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}

                        <div ref={bottomRef} />
                    </div>
                </div>

                <form onSubmit={handleSend}>
                    <div className="mx-auto w-full max-w-3xl">
                        {loading === "sending" &&
                            <div className="flex ">
                                <div className="flex gap-5 text-gray-900 text-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mx-auto"></div>
                                    <p>thinking...</p>
                                </div>
                            </div>
                        }
                        <div className="flex gap-2">
                            <Input type="text" placeholder="Ask Anything.." value={message} onChange={(e) => setMessage(e.target.value)} />
                            <Button >Send</Button>
                        </div>
                    </div>
                </form>
            </div>

        </ProtectedLayout>
    )
}

export default page