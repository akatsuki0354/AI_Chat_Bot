import { create } from "zustand";
import supabase from "@/lib/supabase";

export type AuthState = {
    user: any | null;
    loading: boolean;
    signInWithGoogleLink: () => Promise<void>;
    signOut: () => Promise<void>;
    signUpWithEmail: (email: string, username: string, password: string) => Promise<void>;
};

export const useAuth = create<AuthState>((set) => ({
    user: null,
    loading: false,

    signInWithGoogleLink: async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: "http://localhost:3000" },
        });
        if (error) console.error("Sign in error:", error);
        supabase.auth.onAuthStateChange(async (_event) => {
            const { data: userData } = await supabase.auth.getUser();
            useAuth.setState({
                user: userData?.user ?? null,
                loading: false,
            });
        });
    },

    signOut: async () => {
        await supabase.auth.signOut();
        set({ user: null });
    },

    signUpWithEmail: async (email, username, password) => {
        await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: username } },
        });
    },
}));



export const syncUserToDatabase = async () => {
    const { data: userData, error } = await supabase.auth.getUser()
    if (error || !userData.user) return { error }

    if (userData?.user) {
        // Update Zustand store
        useAuth.setState({ user: userData.user, loading: false });

        // Insert or update user in Supabase
        const { data, error } = await supabase
            .from("users")
            .upsert(
                [
                    {
                        uid: userData.user.id,
                        email: userData.user.email,
                        username:
                            userData.user.user_metadata?.full_name ||
                            userData.user.user_metadata?.name ||
                            userData.user.user_metadata?.username ||
                            "Anonymous",
                        avatar_url: userData.user.user_metadata?.avatar_url,
                    },
                ],
                { onConflict: "uid" }
            )
            .select();

        if (error) console.error("Error creating/updating user:", error);
        else console.log("✅ User inserted/updated:", data);
    } else {
        useAuth.setState({ user: null, loading: false });
    }
    return { data: userData.user }
}

// ✅ Attach the listener OUTSIDE the create() function
supabase.auth.onAuthStateChange((event, session) => {
    console.log(event, session)
    if (event === 'SIGNED_IN') {
        syncUserToDatabase().catch((err) => console.error('Sync failed', err))
    }
})

