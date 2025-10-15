"use client";
import LoginPage from "./SignIn/SignIn";
import { useAuth } from "@/services/Auth";
import Loading from "@/components/loading";
import Home from "./Home/page";
export default function Page() {
  const { user, loading } = useAuth();

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
