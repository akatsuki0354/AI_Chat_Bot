
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Ellipsis } from 'lucide-react';
import { useChatStore } from '@/services/ChatsServices';
function ChatHistory({ groups }: { groups: any }) {
    const { deleteChat } = useChatStore();

    const handleDeleteChat = async (chatId: string) => {
        try {
            await deleteChat(chatId);
        } catch (error) {
            console.error("Error deleting chat:", error);
        }
    };

    return (
        <div>
            {groups.map((group: any) => (
                <div key={group.title} className="mb-4">
                    <h2 className="px-4 py-2 text-sm font-semibold text-muted-foreground">
                        Chat History
                    </h2>
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