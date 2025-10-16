import supabase from "@/lib/supabase";
import { create } from "zustand";
import OpenAI from 'openai';
// Initialize OpenAI client
const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY!,
    dangerouslyAllowBrowser: true,
});

// Get the current authenticated user
const {
    data: { user },
} = await supabase.auth.getUser();

// Define the Chat type
export type Chat = {
    currentConvoId: string | null;
    setCurrentConvoId: (id: string | null) => void;
    addChat: (userChat: string) => Promise<void>;
    aiResponse: (userChat: string) => Promise<string | null>;
    getChats: () => Promise<{ id: string, chats: string[] }[] | null>;
    deleteChat: (chatId: string) => Promise<void>;
};



// Create the chat store using Zustand
export const useChatStore = create<Chat>((set, get) => ({

    // In-memory convo session id; resets on page refresh
    currentConvoId: null,
    setCurrentConvoId: (id) => set({ currentConvoId: id }),

    // Function to get AI response from OpenAI
    aiResponse: async (userChat) => {
        const response = await openai.chat.completions.create({
            model: 'openai/gpt-oss-20b',
            messages: [{ role: 'user', content: userChat }],
        });
        return response.choices[0].message.content;
    },

    // Function to add a chat to the database
    addChat: async (userChat) => {
        const botChat = await get().aiResponse(userChat);
        const newEntry = {
            userChat,
            botResponse: botChat,
            created_at: new Date().toISOString()
        };

        const convoId = get().currentConvoId;

        // ✅ Update existing conversation
        if (convoId) {
            const { data: existing, error } = await supabase
                .from('convo')
                .select('id, chats')
                .eq('id', convoId)
                .single();

            if (error) {
                console.error('Error loading convo:', error);
                return null;
            }

            const updatedChats = [...(existing?.chats || []), newEntry];

            const { error: updateError } = await supabase
                .from('convo')
                .update({ chats: updatedChats })
                .eq('id', convoId);

            if (updateError) {
                console.error('Error updating convo:', updateError);
                return null;
            }

            return convoId; // ✅ return existing convo ID
        }

        // ✅ Create new conversation
        const { data: inserted, error: insertError } = await supabase
            .from('convo')
            .insert([
                { uid: user?.id || null, chats: [newEntry] }
            ])
            .select('id')
            .single();

        if (insertError) {
            console.error('Error creating convo:', insertError);
            return null;
        }

        set({ currentConvoId: inserted.id });
        return inserted.id; // ✅ return new convo ID
    },


    // Function to get chats from the database
    getChats: async () => {
        let { data: chats, error } = await supabase
            .from('convo')
            .select('id, chats')
            .eq("uid", user?.id || null)
        console.log(chats);
        if (error) {
            console.error("Error fetching chats:", error);
            return [];
        }
        return chats;
    },

    // Function to delete a chat from the database
    deleteChat: async (chatId) => {
        const { data, error } = await supabase
            .from('convo')
            .delete()
            .eq("id", chatId)
        if (error) {
            console.error("Error deleting chat:", error);
            console.log(chatId);
        } else {
            console.log("Chat deleted:", data);
        }
    },

}))
