"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "../services/Auth";
import { useState } from "react";
import { Google } from "@/assets/images";
import Image from "next/image";

export default function SignInForm({ setIsSignUpPage }: { setIsSignUpPage: (v: boolean) => void }) {
  const { signInWithGoogleLink, signInWithEmail } = useAuth();
  const [signingIn, setSigningIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmail(email, password);
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  const handleSignInWithGoogle = async () => {
    setSigningIn(true);
    try {
      await signInWithGoogleLink();
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <form onSubmit={handleSignWithEmail} className={cn("flex flex-col gap-2")}>
      <FieldGroup>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm">
            Enter your email below to login to your account
          </p>
        </div>

        <Field className="gap-1">
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="m@example.com"
            required
          />
        </Field>

        <Field className="gap-1">
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
        </Field>

        <Field>
          <Button type="submit">Login</Button>
        </Field>

        <FieldSeparator>Or continue with</FieldSeparator>

        <Field>
          <Button variant="outline" type="button" onClick={handleSignInWithGoogle}>
            <Image src={Google} alt="Google" width={32} height={32} />
            {signingIn ? "Signing in..." : "Sign in with Google"}
          </Button>

          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <a
              onClick={() => setIsSignUpPage(true)}
              className="underline underline-offset-4 cursor-pointer"
            >
              Sign Up
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
