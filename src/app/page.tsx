"use client";

import { useSession } from "next-auth/react";
import Btn from "./components/ui/btn";
import { signIn } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <div className="container grid grid-cols-1 gap-4 auto-rows-[minmax(100px, _auto)] items-center justify-center bg-white px-4 py-16">
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="box-border flex flex-col items-center justify-center gap-4 border-2 border-white bg-white p-4 text-purple-800">
          <div className="mb-[25px] w-max border-y-2 font-sans md:text-[3rem] text-[2rem] flex-wrap uppercase leading-loose tracking-wider text-purple-800">
            CLIENT CONNECT
          </div>
          <div className="mb-4">
            <div className="text-center text-[1.5rem] text-purple-800">
              {session ? `Welcome to your dashboard,` : "Welcome to the app,"}
            </div>
            <div className="text-center">
              {session ? (
                <span className="text-2xl text-green-800">
                  {session?.user?.name}
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

                status == "loading"
                  ? "uppercase text-purple-800" :
                status == "unauthenticated"
                  ? "uppercase text-red-800"
                  : "uppercase text-green-800"
              }`}
            >
              {status == "loading"
                ? "Loading"
                : status == "authenticated"
                ? "Authenticated"
                : "Unauthenticated"}
            </span>
          </p>
          <Btn href={session ? "/api/auth/signout" :  "/login"}>
            {session ? "Sign out" : "Sign in"}
          </Btn>
        </div>
      </div>
    </div>
  );
}
