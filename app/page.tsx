"use client";
import LoginPage from "./SignIn/SignIn";
import { useAuth } from "@/services/Auth";

import Home from "./Home/page";
export default function Page() {
  const { user } = useAuth();

  return (
    <div >
      {user ? (
        <div>
          <Home />
        </div>
      ) : (
        <LoginPage />
      )}
    </div>
  );
}
