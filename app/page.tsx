"use client";
import LoginPage from "./SignIn/SignIn";
import { useAuth } from "@/Services/Auth";
import { Button } from "@/components/ui/button";
export default function Home() {
  const { user, signOut, loading } = useAuth();
  
  const handleSignOut = async () => {
    try {
      const result = await signOut();
      console.log("Sign out result:", result);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div >
      {user ? (
        <div>
          <p>Your email: {user.email}</p>
          <Button onClick={handleSignOut}>SignOut</Button>
        </div>
      ) : (
        <LoginPage />
      )}
    </div>
  );
}
