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
import { Google } from "@/assets/images"
import Image from "next/image";
export function SignUpForm({
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
        <form className={cn("", className)} {...props}>
            <FieldGroup>
                <div className="flex flex-col gap-1 ">
                    <h1 className="text-2xl font-bold">Create your account</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                        Create your account by entering your information below.
                    </p>
                </div>
                <div className="flex flex-col gap-3">
                    <Field className="gap-1">
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input type="email" placeholder="m@example.com" required />
                    </Field>
                    <Field className="gap-1">
                        <FieldLabel htmlFor="email">Username</FieldLabel>
                        <Input type="text" placeholder="yourname123" required />
                    </Field>
                    <Field className="gap-1">
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <Input type="password" placeholder="••••••••" required />
                    </Field>
                    <Field className="gap-1">
                        <FieldLabel htmlFor="password">Confirm Password</FieldLabel>
                        <Input type="password" placeholder="••••••••" required />
                    </Field>
                </div>
                <Field>
                    <Button type="submit">Login</Button>
                </Field>
                <FieldSeparator>Or continue with</FieldSeparator>
                <Field>
                    <Button variant="outline" type="button" onClick={handleSignInWithGoogle}>
                        <Image src={Google} alt="Google" width={32} height={32} />
                        {signingIn ? 'SignUp...' : 'SignUp with Google'}
                    </Button>
                    <FieldDescription className="text-center">
                        Don&apos;t have an account?{" "}
                        <a href="/" className="underline underline-offset-4">
                            SignIn
                        </a>
                    </FieldDescription>
                </Field>
            </FieldGroup>
        </form>
    )
}
