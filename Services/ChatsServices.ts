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
    setCurrentConvoId: (id: string | null) => set({ currentConvoId: id }),

    // Function to get AI response from OpenAI
    aiResponse: async (userChat: string) => {
        const response = await openai.chat.completions.create({
            model: 'alibaba/tongyi-deepresearch-30b-a3b',
            messages: [{ role: 'user', content: userChat }],
        });
        return response.choices[0].message.content;
    },

    // Function to add a chat to the database
    addChat: async (userChat: string) => {
        const botChat = await useChatStore.getState().aiResponse(userChat);
        const newEntry = { userChat: userChat, botResponse: botChat } as any;
        const convoId = get().currentConvoId;

        if (convoId) {
            // Load existing chats for this convo id, then append
            const { data: existing, error: loadError } = await supabase
                .from('convo')
                .select('id, chats')
                .eq('id', convoId)
                .single();

            if (loadError) {
                console.error('Error loading current convo:', loadError);
                return;
            }

            const updatedChats = Array.isArray(existing?.chats)
                ? [...existing.chats, newEntry]
                : [newEntry];

            const { data: updated, error: updateError } = await supabase
                .from('convo')
                .update({ chats: updatedChats })
                .eq('id', existing.id)
                .select('id, chats')
                .single();

            if (updateError) {
                console.error('Error updating convo:', updateError);
            } else {
                console.log('Chat appended:', updated);
            }
            return;
        }

        // No in-memory convo yet (fresh session): create new row and store its id
        const { data: inserted, error: insertError } = await supabase
            .from('convo')
            .insert([
                {
                    uid: user?.id || null,
                    chats: [newEntry]
                }
            ])
            .select('id, chats')
            .single();

        if (insertError) {
            console.error('Error creating new convo:', insertError);
            return;
        }

        set({ currentConvoId: inserted.id as unknown as string });
        console.log('Convo created:', inserted);
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
    deleteChat: async (chatId: string) => {
        const { data, error } = await supabase
            .from('convo')
            .delete()
            .eq("id", chatId);
            
        if (error) {
            console.error("Error deleting chat:", error);
            console.log(chatId);
        } else {
            console.log("Chat deleted:", data);
        }
    },

}))
