import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Ellipsis } from 'lucide-react';
import { useChatStore } from '@/services/ChatsServices';
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
function ChatHistory({ groups }: { groups: any }) {

    const { deleteChat } = useChatStore();
    const [localGroups, setLocalGroups] = useState(groups);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Sync local groups with prop changes
    useEffect(() => {
        const fetchGroups = async () => {
            setLoading(true);
            try {
                setLocalGroups(groups);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchGroups();
    }, [groups]);

    // Function to remove chat from local state
    const removeChatFromGroups = async (chatId: string) => {
        setLocalGroups((prev: any) =>
            prev
                .map((g: any) => ({ ...g, chats: g.chats.filter((c: any) => c.id !== chatId) }))
                .filter((g: any) => g.chats.length > 0)
        );
    };

    // Handle chat deletion
    const handleDeleteChat = async (chatId: string) => {
        removeChatFromGroups(chatId);
        router.push(`/`);
        try {
            await deleteChat(chatId);
        } catch (error) {
            console.error("Error deleting chat:", error);
        }
    };

    return (
        <div className="mb-4">

            <h2 className="px-4 py-2 text-sm font-semibold text-muted-foreground">
                Chat History
            </h2>
            {loading && (
                <p className="px-4 py-2 text-sm text-center text-gray-500">Loading...</p>
            )}
            {localGroups.length <= 0 ? (
                <p className="px-4 py-2 text-sm text-center text-gray-500">No chats available.</p>
            ) : (
                <div>
                    {localGroups.map((group: any) => (
                        <div key={group.title} >


                            <div>
                                {group.chats.map((chat: any) => (
                                    <a
                                        key={chat.id}
                                        href={chat.url} className='flex justify-between items-center py-2 px-4'>
                                        <div className='hover:bg-accent cursor-pointer rounded-md mb-1'>
                                            <h1 className='text-sm line-clamp-1'>
                                                {chat.title}
                                            </h1>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Ellipsis size={16} />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-56" align="start">
                                                <DropdownMenuItem onClick={() => handleDeleteChat(chat.id)}>
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </a>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}


        </div>
    )
}

export default ChatHistory