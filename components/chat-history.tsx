import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit, Ellipsis, Trash } from 'lucide-react';
import { useChatStore } from '@/services/ChatsServices';
import { useEffect, useState } from 'react';
import { Input } from "./ui/input";
function ChatHistory({ groups, loading }: { groups: any; loading?: boolean }) {
    const { deleteChat, updateChatTitle } = useChatStore();
    const [localGroups, setLocalGroups] = useState(groups ?? []);
    const [editingChatId, setEditingChatId] = useState<string | null>(null);
    const [editingChatTitle, setEditingChatTitle] = useState<string>('');

    useEffect(() => {
        setLocalGroups(groups ?? []);
    }, [groups]);

    // Function to update a chat inside the groups
    const updateChatInGroups = (chatId: string, patch: any) => {
        setLocalGroups((prev: any) =>
            prev.map((group: any) => ({
                ...group,
                chats: group.chats.map((chat: any) =>
                    chat.id === chatId ? { ...chat, ...patch } : chat
                ),
            }))
        );
    };

    // Function to handle delete chat
   
    const handleDeleteChat = async (chatId: string, e?: any) => {
        // 1️⃣ Optimistically remove from local state first
        setLocalGroups((prev: any) =>
            prev.map((group: any) => ({
                ...group,
                chats: group.chats.filter((chat: any) => chat.id !== chatId)
            }))
        );

        try {
            // 2️⃣ Then call Supabase or your store function
            await deleteChat(chatId);
        } catch (error) {
            console.error("Error deleting chat:", error);
            // 3️⃣ Optional: revert if delete failed
            setLocalGroups((prev: any) =>
                prev.map((group: any) => ({
                    ...group,
                    chats: [
                        ...group.chats,
                        ...((groups.find((g: any) =>
                            g.chats.some((c: any) => c.id === chatId)
                        )?.chats.filter((c: any) => c.id === chatId)) ?? [])
                    ]
                }))
            );
        }
    };


    // Normalize groups array
    const lg = localGroups ?? [];

    // Extract all chats from all groups
    const chats = lg.flatMap((g: any) => g?.chats ?? []);

    // Count totals
    const totalChats = chats.length;

    // Helper: normalize deleteChat values (boolean, string, number)
    const isdeleteChat = (value: any) => Boolean(value === true || value === "true" || value === 1);

    // Count only non-deleteChat chats
    const activeChatsCount = chats.filter((chat: any) => !isdeleteChat(chat?.deleteChat)).length;

    // Empty = there are chats but all of them are deleteChat
    const isEmpty = totalChats > 0 && activeChatsCount === 0;

    // Handle edit chat
    const handleEdit = async (chatId: string, Title: string) => {
        setEditingChatId(chatId);
        setEditingChatTitle(Title);
    };

    // Handle edit submit
    const EditSubmit = async (e: React.FormEvent, chatId: string, newTitle: string) => {
        e.preventDefault();
        try {
            // Optimistic update
            updateChatInGroups(chatId, { title: newTitle });
            await updateChatTitle(chatId, newTitle);
            setEditingChatId(null);
            setEditingChatTitle('');
        } catch (error) {
            console.error("Error updating chat title:", error);
        }
    };

    return (
        <div className="mb-4">
            <h2 className="px-4 py-2 text-sm font-semibold text-muted-foreground">
                Chat History
            </h2>
            {loading ? (
                <div className="px-4 py-2 justify-center text-sm text-muted-foreground flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                    <span>Loading chat history...</span>
                </div>
            ) : isEmpty ? (
                <div className="px-4 py-2 text-sm text-muted-foreground">
                    No chats yet
                </div>
            ) : (
                localGroups.map((group: any, idx: number) => (
                    <div key={group.title ?? idx} >
                        <div >
                            {group.chats.map((chat: any) => (
                                <div key={chat.id}>
                                    {!isdeleteChat(chat.deleteChat) && (
                                        <div
                                            className={`${editingChatId == chat.id ? 'bg-gray-200' : ''} flex hover:bg-gray-100 justify-between items-center py-2 px-4`}>
                                            {editingChatId == chat.id ? (
                                                <form onSubmit={(e) => EditSubmit(e, chat.id, editingChatTitle || '')} className="flex-1 min-w-0">
                                                    <Input
                                                        className="
                                                                border-0 
                                                                shadow-none 
                                                                outline-none 
                                                                focus:outline-none 
                                                                focus:ring-0 
                                                                focus-visible:ring-0 
                                                                focus-visible:ring-offset-0 
                                                                ring-0 
                                                                ring-offset-0 
                                                                focus:border-transparent 
                                                                border-transparent 
                                                                bg-transparent 
                                                                p-0
                                                                m-0
                                                                appearance-none
                                                            "
                                                        value={editingChatTitle}
                                                        onChange={(e) => setEditingChatTitle(e.currentTarget.value)}
                                                    />


                                                </form>
                                            ) : (
                                                <a href={chat.url} className="flex-1 min-w-0">
                                                    <h1 className="text-sm line-clamp-1 group">{chat.title}</h1>
                                                </a>
                                            )}

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild className="bg-red cursor-pointer">
                                                    <Ellipsis size={16} className="shrink-0 " />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-fit" align="start">
                                                    <DropdownMenuItem onClick={() => handleEdit(chat.id, chat.title)}>
                                                        <Edit size={16} />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDeleteChat(chat.id)}>
                                                        <Trash size={16} />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>

                                        </div>

                                    )
                                    }
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )
            }
        </div >
    )
}

export default ChatHistory