import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Ellipsis } from 'lucide-react';
import { useChatStore } from '@/services/ChatsServices';
import { useEffect, useState } from 'react';
import supabase from "@/lib/supabase";

function ChatHistory({ groups }: { groups: any }) {
    const { deleteChat } = useChatStore();
    const [localGroups, setLocalGroups] = useState(groups);

    useEffect(() => {
        setLocalGroups(groups);
    }, [groups]);

    const removeChatFromGroups = (chatId: string) => {
        setLocalGroups((prev: any) =>
            prev
                .map((g: any) => ({ ...g, chats: g.chats.filter((c: any) => c.id !== chatId) }))
                .filter((g: any) => g.chats.length > 0)
        );
    };

    useEffect(() => {
        const channel = supabase
            .channel('convo-realtime')
            .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'convo' }, (payload: any) => {
                const deletedId = payload?.old?.id as string;
                if (deletedId) removeChatFromGroups(deletedId);
            })
            .subscribe();
        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

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