"use client";

import { Button } from "$/app/components/ui/button";
import { Separator } from "$/app/components/ui/separator";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MouseEvent, useState } from "react";
import Btn from "./ui/btn";
import { AlignJustify } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "$/app/components/ui/sheet";

export function SimpleNav() {
  const { data: session } = useSession();
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  function handleLogin(): void {
    if (session) {
      router.push("/api/auth/signout");
    } else {
      signIn();
    }
  }

  return (
    <nav className="w-full bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-start h-16 space-x-4">
          {/* <Button onClick={handleAssignLocation} variant="outline">
            {location.href === "http://localhost:3000/dashboard"
              ? "Home"
              : "Dashboard"}
          </Button> */}
          <div className="flex h-full items-center justify-between w-full">
            <div className="">
              <Sheet>
                <SheetTrigger>
                  <AlignJustify />
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle className="text-center ">NAVIGATION PANEL</SheetTitle>
                  </SheetHeader>
                  <div className="flex justify-between h-full flex-col">
                    <div className="flex flex-col  justify-start mt-6">
                      <Btn href="/">
                        Home
                      </Btn>
                      <br />
                      <Btn href="/dashboard" >
                        Dashboard
                      </Btn>
                    </div>
                    <br />
                    <div className="my-6">
                      <SheetTitle className="text-center">TASK MANAGEMENT</SheetTitle>
                      <Btn classList="mt-4 w-full">Task</Btn>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            <Btn onClick={() => handleLogin()}>
              {" "}
              {session ? "Sign out" : "Sign in"}
            </Btn>
          </div>
        </div>
      </div>
      <Separator />
    </nav>
  );
}
