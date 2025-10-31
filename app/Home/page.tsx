"use client";
import ProtectedLayout from "@/components/PretectedLayout"
import { Textarea } from "@/components/index"
import { useChatStore } from "@/services/ChatsServices"
import { useState } from "react";
import { useRouter } from "next/navigation";
function page() {
    const { addChat } = useChatStore();
    const [message, setMessage] = useState<string>("");
    const [loading, setLoading] = useState<null | "sending">(null);
    const routes = useRouter();

    // Function to handle sending a message
    const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
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

            <div className="flex flex-col  h-[calc(100vh-56px)] px-4 py-4 justify-between">
                <div className="chats overflow-y-auto flex justify-center items-center h-full">
                    <div className="">
                        <h1 className="text-3xl text-center font-semibold">Welcome to Aurelius Chatbot</h1>
                        <h1 className="text-2xl text-center">Ask Anything..</h1>
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
                        <Textarea
                            placeholder="Ask Anything.."
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
                           border 
                           border-gray-300 
                           rounded-md 
                           focus:!outline-none 
                           focus:!ring-0 
                           focus:!border-gray-300 
                           leading-tight 
                           pt-5
                           max-h-[6rem]
                           overflow-y-auto
                           pr-24
                         "
                        />
                    </div>
                </form>
            </div>

        </ProtectedLayout>
    )
}

export default page