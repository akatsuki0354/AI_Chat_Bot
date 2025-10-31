import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Ellipsis } from 'lucide-react';
import { useChatStore } from '@/services/ChatsServices';
import { useEffect, useState } from 'react';


function ChatHistory({ groups }: { groups: any }) {
    const { deleteChat } = useChatStore();
    const [localGroups, setLocalGroups] = useState(groups);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLocalGroups(groups);
    }, [groups]);

    // Function to remove chat from local state
    const removeChatFromGroups = async (chatId: string) => {
        setLoading(true);
        try {
            setLocalGroups((prev: any) =>
                prev
                    .map((g: any) => ({ ...g, chats: g.chats.filter((c: any) => c.id !== chatId) }))
                    .filter((g: any) => g.chats.length > 0)
            );
        } catch (error) {
            console.error("Error removing chat from groups:", error);
        } finally {
            setLoading(false);
        }
    };
    // Handle chat deletion
    const handleDeleteChat = async (chatId: string, e?: any) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        removeChatFromGroups(chatId);
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
            {localGroups.map((group: any) => (
                <div key={group.title} >
                    {group.chats.length === 0 && (<p className="px-4 py-2 text-sm text-center text-gray-500">No chats available.</p>)}
                    {loading && (
                        <div className="flex justify-center py-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                        </div>
                    )}
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
                                        <DropdownMenuItem onClick={(e) => handleDeleteChat(chat.id, e)}>
                                            Delete Chat
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </a>
                        ))}
                    </div>
                </div>

            ))}
        </div>
    )
}

export default ChatHistory