"use client";
import LoginPage from "./SignIn/SignIn";
import { useAuth } from "@/Services/Auth";
import { Button } from "@/components/ui/button";
import Loading from "@/components/loading";
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
  if (window !== undefined && loading) {
    return <Loading/>;
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
