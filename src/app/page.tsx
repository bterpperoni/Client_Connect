"use client";

import { signIn, useSession } from "next-auth/react";
import Btn from "./components/ui/btn";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <div className="container grid grid-cols-3 gap-4 auto-rows-[minmax(100px,_auto)] items-center justify-center bg-white px-4 py-16">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8"></div>
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="box-border flex flex-col items-center justify-center gap-4 border-2 border-white bg-white p-4 text-purple-800">
          <div className="mb-[25px] border-y-2 font-sans text-[3rem] uppercase leading-loose tracking-wider text-purple-800">
            SYSTEM SECURITY UI
          </div>
          <div className="mb-4">
            <div className="text-center text-[1.5rem] text-purple-800">
              {session ? `Welcome to your dashboard,` : "Welcome to the app,"}
            </div>
            <div className="text-center">
              {session ? (
                <span className="text-2xl text-green-800">
                  {session.user.name}
                </span>
              ) : (
                <>
                  <span className="mb-8 text-base text-purple-800">
                    Please sign in to manage tasks or go to the dashboard if you
                    are a simple user.
                  </span>
                </>
              )}
            </div>
          </div>

          <p
            className={`border-t-2 p-2 text-center text-xl tracking-wider text-purple-800`}
          >
            Status :{" "}
            <span
              className={`${
                status === "unauthenticated"
                  ? "uppercase text-red-800"
                  : "uppercase text-green-800"
              }`}
            >
              {status == "unauthenticated"
                ? "Unauthenticated"
                : "Authenticated"}
            </span>
          </p>
          <Btn href={session ? '/api/auth/signout' :  '/api/auth/signin'}>
            {session ? "Sign out" : "Sign in"}
          </Btn>
        </div>
      </div>
    </div>
  );
}
