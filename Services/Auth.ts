import { create } from "zustand";
import supabase from "@/lib/supabase";

export type AuthState = {
    user: any | null;
    loading: boolean;
    signInWithGoogleLink: () => Promise<void>;
    signOut: () => Promise<void>;
    signUpWithEmail: (email: string, username: string, password: string) => Promise<void>;
}


export const useAuth = create<AuthState>((set) => {
    // Realtime auth listener
    supabase.auth.onAuthStateChange(async (_event, session) => {
        const user = session?.user || null;
        set({ user });
    });

    // Check current session
    const checkSession = async () => {
        const { data } = await supabase.auth.getSession();
        set({ user: data.session?.user || null, loading: false });
        const { error } = await supabase
        .from("users")
        .upsert(
          {
            uid: data.session?.user.aud,
            email: data.session?.user.email,
            username: data.session?.user.user_metadata
            
          },
          { onConflict: "uid" }
        );
    };
    checkSession();

    return {
        user: null,
        loading: true,

        // 👇 Google Sign-in + redirect
        signInWithGoogleLink: async () => {
            await supabase.auth.signInWithOAuth({
                provider: "google",
                options: { redirectTo: "http://localhost:3000" },
            });
            checkSession();
        },

        // 👇 Sign out
        signOut: async () => {
            await supabase.auth.signOut();
            set({ user: null });
        },

        // 👇 Email Sign-up
        signUpWithEmail: async (email, username, password) => {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { full_name: username },
                    emailRedirectTo: "http://localhost:3000",
                },
            });

            if (error) console.error("Sign-up error:", error);
        },
    };
});
