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
    addChat: (userChat: string) => Promise<void>;
    aiResponse: (userChat: string) => Promise<string | null>;
    getChats: () => Promise<string[] | null>;
    deleteChat: (chatId: string) => Promise<void>;
};

// Create the chat store using Zustand
export const useChatStore = create<Chat>((set) => ({

    // Function to get AI response from OpenAI
    aiResponse: async (userChat: string) => {
        const response = await openai.chat.completions.create({
            model: 'qwen/qwen3-coder',
            messages: [{ role: 'user', content: userChat }],
        });
        return response.choices[0].message.content;
    },

    // Function to add a chat to the database
    addChat: async (userChat: string) => {
        const botChat = await useChatStore.getState().aiResponse(userChat);
        const { data, error } = await supabase
            .from("chats")
            .insert([
                {
                    userChat: userChat,
                    botResponse: botChat,
                    uid: user?.id || null,
                },
            ]);
        if (error) {
            console.error("Error adding chat:", error);
        } else {
            console.log("Chat added:", data);
            console.log("Bot response:", botChat);
        }
    },

    // Function to get chats from the database
    getChats: async () => {
        let { data: chats, error } = await supabase
            .from('chats')
            .select('*')
            .eq("uid", user?.id || null)
            .order("created_at");
        if (error) {
            console.error("Error fetching chats:", error);
            return [];
        }
        return chats;
    },

    // Function to delete a chat from the database
    deleteChat: async (chatId: string) => {
        const { data, error } = await supabase
            .from('chats')
            .delete()
            .eq('id', chatId)
            .eq("uid", user?.id || null);
        if (error) {
            console.error("Error deleting chat:", error);
        } else {
            console.log("Chat deleted:", data);
        }
    },

}))
