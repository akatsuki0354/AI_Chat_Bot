'use client';
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useAuth } from '../Services/Auth';
import { useState } from 'react';
import { Google, LogoTransparentBg } from "@/assets/images"
import Image from "next/image";
export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { loading, signInWithGoogleLink } = useAuth();
  const [signingIn, setSigningIn] = useState(false);
  if (loading) return <p>Loading...</p>;

  const handleSignInWithGoogle = async () => {
    try {
      await signInWithGoogleLink();
    } finally {
      setSigningIn(false);
    }
    setSigningIn(true);
  };
  return (
    <form className={cn("flex flex-col gap-2", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col ">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>
        <Field className="gap-1">
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </Field>
        <Field className="gap-1">
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input id="password" type="password" required />
        </Field>
        <Field>
          <Button type="submit">Login</Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <Button variant="outline" type="button" onClick={handleSignInWithGoogle}>
            <Image src={Google} alt="Google" width={32} height={32}/>
            {signingIn ? 'Signing in...' : 'SignIn with Google'}
          </Button>
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <a href="/SignUp" className="underline underline-offset-4">
              SignUp
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
