"use client";
import LoginPage from "./SignIn/SignIn";
import { useAuth } from "@/Services/Auth";
import { Button } from "@/components/ui/button";
export default function Home() {
  const { user, signOut } = useAuth();
  return (
    <div >
      {user ? (
        <div>
          <p>Your email: {user.email}</p>
          <Button onClick={signOut}>SignOut</Button>
        </div>
      ) : (
        <LoginPage />
      )}
    </div>
  );
}
