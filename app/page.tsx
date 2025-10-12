"use client";
import LoginPage from "./SignIn/SignIn";
import { useAuth } from "@/services/Auth";
import { Button } from "@/components/ui/button";
import Loading from "@/components/loading";
import Home from "./Home/page";
export default function Page() {
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
    return <Loading />;
  }

  return (
    <div >
      {user ? (
        <div>
          {/* <p>Your email: {user.email}</p>
          <Button onClick={handleSignOut}>SignOut</Button> 
          */}
          <Home />
        </div>
      ) : (
        <LoginPage />
      )}
    </div>
  );
}
