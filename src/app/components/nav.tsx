"use client";

import { Button } from "$/app/components/ui/button";
import { Separator } from "$/app/components/ui/separator";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";

export function SimpleNav() {
  const { data: session } = useSession();
  const router = useRouter();

  function handleLogin(): void {
    if (session) {
      router.push("/api/auth/signout");
    } else {
      signIn();
    }
  }

  function handleLinkRef(): void {
    if (location.href === "http://localhost:3000/dashboard") {
      location.assign("/");
    } else {
      location.assign("/dashboard");
    }
  }

  return (
    <nav className="w-full bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-start h-16 space-x-4">
          <Button onClick={handleLinkRef} variant="link">
            {location.href === "http://localhost:3000/dashboard"
              ? "Home"
              : "Dashboard"}
          </Button>
          <Button variant="link">Tasks</Button>
          <Button onClick={() => handleLogin()} variant="link">
            {" "}
            {session ? "Sign out" : "Sign in"}
          </Button>
        </div>
      </div>
      <Separator />
    </nav>
  );
}
