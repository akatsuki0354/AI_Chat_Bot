"use client";
import LoginPage from "./SignIn/SignIn";
import { useAuth } from "@/services/Auth";
import Home from "./Home/page";
import Loading from "@/components/loading";
export default function Page() {
  const { user, loading } = useAuth();
  if (window !== undefined && loading) {
    return <Loading />;
  }
  return (
    <div>
      {user ?
        <Home /> : <LoginPage />}
    </div>
  )
}
