import ProtectedLayout from "@/components/PretectedLayout"
import { Input, Button } from "@/components/index"
import { useChatStore } from "@/services/ChatsServices"
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { timeAgo } from "@/utils";
function page() {
    const { addChat, getChats, deleteChat } = useChatStore();
    const [chats, setChats] = useState<string[] | null>([]);
    const [message, setMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);



    // Fetch chats on component mount
    useEffect(() => {
        const fetchChats = async () => {
            const chats = await getChats();
            setChats(chats);
        };
        fetchChats();
    }, [getChats]);

    // Function to handle sending a message
    const handleSend = async () => {
        try {
            setLoading(true);
            await addChat(message);
            setMessage("");
            const updatedChats = await getChats();
            setChats(updatedChats);
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setLoading(false);
        }
    };

    // Function to handle deleting a chat
    const handleDelete = async (chatId: string) => {
        try {
            setLoading(true);
            await deleteChat(chatId);
            const updatedChats = await getChats();
            setChats(updatedChats);
        } catch (error) {
            console.error("Error deleting chat:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedLayout>

            <div className="flex flex-col  h-[calc(100vh-56px)] px-4 py-4 justify-between">
                <div className="chats overflow-y-auto flex flex-end">
                    <div className="mx-auto w-full max-w-3xl h-[calc(100vh-150px)] flex flex-col gap-4">
                        {chats?.map((chat: any, index: number) => (
                            <div key={index} className="flex flex-col gap-4">
                                {/* User message (left side) */}
                                <div className="self-end bg-blue-100 p-4 rounded-lg shadow-md ">
                                    <div className="mb-2">{chat.userChat}</div>
                                    <div className="text-gray-500 text-sm">{timeAgo(chat.created_at)}</div>

                                </div>

                                {/* Bot message (right side) */}
                                <div className="self-start bg-gray-100 p-4 rounded-2xl shadow-md leading-relaxed text-gray-800">
                                    <div className="prose prose-sm">
                                        <ReactMarkdown>
                                            {chat.botResponse}
                                        </ReactMarkdown>
                                    </div>
                                    <div className="text-gray-400 text-xs text-right mt-2">
                                        {timeAgo(chat.created_at)}
                                    </div>
                                    <Button variant="ghost" size="sm" className="mt-2 text-red-500" onClick={() => handleDelete(chat.id)}>Delete</Button>
                                </div>
                            </div>

                        ))}

                    </div>
                </div>

                <div className="mx-auto w-full max-w-3xl">
                    <div className="flex gap-2">
                        <Input type="text" placeholder="Ask Anything.." value={message} onChange={(e) => setMessage(e.target.value)} />
                        <Button onClick={handleSend}>{loading ? "Sending..." : "Send"}</Button>
                    </div>
                </div>
            </div>

        </ProtectedLayout>
    )
}

export default page