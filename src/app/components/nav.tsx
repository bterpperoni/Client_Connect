"use client";

import { Button } from "$/app/components/ui/button";
import { Separator } from "$/app/components/ui/separator";
import { signIn, signOut, useSession } from "next-auth/react";
import { MouseEvent } from "react";

export function SimpleNav() {
  const { data: session } = useSession();

  function handleLogin(): void {
    if (session) {
      signOut();
    } else {
      signIn();
    }
  }

  return (
    <nav className="w-full bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-start h-16 space-x-4">
          <Button variant="ghost">Dashboard</Button>
          <Button variant="ghost">Tasks</Button>
          <Button onClick={() => handleLogin()} variant="ghost">
            {" "}
            {session ? "Sign out" : "Sign in"}
          </Button>
        </div>
      </div>
      <Separator />
    </nav>
  );
}
