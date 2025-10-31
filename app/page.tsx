"use client";

import { useAuth } from "@/services/Auth";
import Loading from "@/components/loading";
import Home from "./Home/page";
import LoginPage from "./LogIn/LogIn";
export default function Page() {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;
  if (user) return <Home />;

  return <LoginPage />;
}
