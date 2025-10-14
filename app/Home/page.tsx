import ProtectedLayout from "@/components/PretectedLayout"
import { Input, Button } from "@/components/index"
import { useChatStore } from "@/services/ChatsServices"
import { useState } from "react";
function page() {
    const { addChat } = useChatStore();
    const [message, setMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    // Function to handle sending a message
    const handleSend = async () => {
        try {
            setLoading(true);
            await addChat(message);
            setMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedLayout>

            <div className="flex flex-col mx-auto w-full max-w-3xl h-[calc(100vh-56px)] px-4 py-4 justify-between">
                <div className="chats ">
                    this
                </div>

                <div className="flex gap-2">
                    <Input type="text" placeholder="Ask Anything.." value={message} onChange={(e) => setMessage(e.target.value)} />
                    <Button onClick={handleSend}>{loading ? "Sending..." : "Send"}</Button>
                </div>
            </div>

        </ProtectedLayout>
    )
}

export default page