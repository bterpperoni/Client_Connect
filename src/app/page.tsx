"use client";

import Logout from "$/app/_components/authentication/logout";
import Btn from "$/app/_components/ui/btn";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <div className="container h-screen grid grid-cols-1 gap-4 auto-rows-[minmax(100px, _auto)] items-center justify-center bg-white px-4 py-16">
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
                  <div> Logged in as {session?.user?.email} </div>
                </span>
              ) : (
                <span className="mb-8 text-base text-purple-800">
                  Please sign in to access access to the features.
                </span>
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
                  ? "uppercase text-purple-800"
                  : status == "unauthenticated"
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
          {!session ? (
            <Btn href="/authentication">{session ? "Sign out" : "Sign in"}</Btn>
          ) : (
            <Logout />
          )}
        </div>
      </div>
    </div>
  );
}
