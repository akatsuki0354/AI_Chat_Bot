import supabase from "@/lib/supabase";
import { create } from "zustand";
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY!,
    dangerouslyAllowBrowser: true,
});

// Define the Chat type
export type AIResponse = {
    text: string;
    totalTokens: number;
    promptTokens: number;
    completionTokens: number;
};

// Define the ChatMessage type
export type ChatMessage = {
    userChat: string;
    botResponse: AIResponse;
    created_at: string;
};

// Define the ChatStats type
export type ChatStats = {
    totalChats: number;
    totalTokens: number;
    promptTokens: number;
    completionTokens: number;
    date: string;
};



export type Chat = {
    currentConvoId: string | null;
    chats: string[];
    setCurrentConvoId: (id: string | null) => void;
    addChat: (userChat: string) => Promise<string | null>;
    aiResponse: (userChat: string) => Promise<AIResponse>;
    getChatById: (chatId: string) => Promise<{ id: string, chats: ChatMessage[] } | null>;
    getChatsHistory: () => Promise<{ id: string, chats: ChatMessage[], deleteChat: boolean }[]>;
    deleteChat: (chatId: string, deleteChat?: boolean) => Promise<void>;
    getChatStats: () => Promise<ChatStats>;
    updateChatTitle: (chatId: string, newTitle: string) => Promise<void>;

};

// Create the chat store using Zustand
export const useChatStore = create<Chat>((set, get) => ({

    // In-memory convo session id; resets on page refresh
    currentConvoId: null,
    chats: [],
    setCurrentConvoId: (id) => set({ currentConvoId: id }),
    // Function to get AI response from OpenAI
    aiResponse: async (userChat) => {
        const response = await openai.chat.completions.create({
            model: 'openai/gpt-oss-20b',
            messages: [{ role: 'user', content: userChat }],
        });

        const promptTokens = response.usage?.prompt_tokens ?? 0;
        const completionTokens = response.usage?.completion_tokens ?? 0;
        const totalTokens = response.usage?.total_tokens ?? promptTokens + completionTokens;
        const text = response.choices?.[0]?.message?.content ?? '';
        return { text, totalTokens, promptTokens, completionTokens };
    },




    // Function to fetch a single chat by id
    getChatById: async (chatId) => {
        const { data, error } = await supabase
            .from('convo')
            .select('*')
            .eq('id', chatId)
            .single();
        if (error) {
            console.error('Error fetching chat by id:', error);
            return null;
        }
        return data as { id: string, chats: ChatMessage[] };
    },

    // Function to update chat title
    updateChatTitle: async (chatId, newTitle) => {
        const { data, error } = await supabase
            .from('convo')
            .update({ title: newTitle })
            .eq('id', chatId);
        if (error) {
            console.error('Error updating chat title:', error);
        } else {
            console.log('Chat title updated:', data);
        }
    },

    //Function to get chats History from the database
    getChatsHistory: async () => {
        const { data: authData } = await supabase.auth.getUser();
        const authUserId = authData?.user?.id ?? null;
        if (!authUserId) return [];

        const { data: chats, error } = await supabase
            .from('convo')
            .select('id, chats, deleteChat, title')
            .eq('uid', authUserId)
        if (error) {
            console.error('Error fetching chats:', error);
            return [];
        }
        return (chats ?? []) as { id: string, chats: ChatMessage[], deleteChat: boolean }[];
    },

    // Function to add a chat to the database
    addChat: async (userChat) => {
        const { data: authData } = await supabase.auth.getUser();
        const authUserId = authData?.user?.id ?? null;

        const botChat = await get().aiResponse(userChat);
        const newEntry = {
            userChat,
            botResponse: botChat,
            created_at: new Date().toISOString()
        };

        const convoId = get().currentConvoId;

        // Update existing conversation
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

            return convoId;
        }

        // Create new conversation
        const { data: inserted, error: insertError } = await supabase
            .from('convo')
            .insert([
                { uid: authUserId, chats: [newEntry] }
            ])
            .select('id')
            .single();

        if (insertError) {
            console.error('Error creating convo:', insertError);
            return null;
        }

        set({ currentConvoId: inserted.id });
        return inserted.id;
    },

    // Function to delete a chat from the database
    deleteChat: async (chatId) => {
        const { data, error } = await supabase
            .from('convo')
            .update({ deleteChat: true })
            .eq('id', chatId)
            .select()
            .single();
        if (error) {
            console.error("Error deleting chat:", error);
            console.log(chatId);
        } else {
            console.log("Chat deleted:", data);

        }
    },

    // Function to get chat statistics
    getChatStats: async () => {
        const chats = await get().getChatsHistory();

        let totalChats = 0;
        let totalTokens = 0;
        let promptTokens = 0;
        let completionTokens = 0;
        let date = "";

        chats.forEach(chat => {
            totalChats += chat.chats.length;
            chat.chats.forEach(message => {
                promptTokens += message.botResponse.promptTokens;
                completionTokens += message.botResponse.completionTokens;
                totalTokens = promptTokens + completionTokens;
                date = message.created_at;
            });
        });

        return {
            totalChats,
            totalTokens,
            promptTokens,
            completionTokens,
            date
        };
    },

}))
