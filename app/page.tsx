"use client";
import LoginPage from "./SignIn/SignIn";
import { useAuth } from "@/Services/Auth";
import { Button } from "@/components/ui/button";
export default function Home() {
  const { user, signOut } = useAuth();
  
  const handleSignOut = async () => {
    try {
      const result = await signOut();
      console.log("Sign out result:", result);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

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
