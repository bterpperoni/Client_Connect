"use server";
import { auth } from "$/server/auth/auth";
import Login from "$/app/_components/authentication/login";
import Logout from "$/app/_components/authentication/logout";

export default async function LoginHome() {
  const session = await auth();

  if (session)
    return (
      <>
        {" "}
        <div className="mb-[25px] w-max border-y-2 font-sans md:text-[3rem] text-[2rem] flex-wrap uppercase leading-loose tracking-wider text-purple-800"></div>
        <div className="w-full h-screen justify-center items-center text-xl text-center my-4 bold">
          <Logout />
        </div>
      </>
    );

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <h1 className="my-8 p-2 w-max  border-gray-400 font-semibold text-2xl border-y-2 text-center bold ">
          Enter crendentials to enter the app
        </h1>
        {!session && (
          <div className="static min-w-[500px] ">
            <Login />
          </div>
        )}
      </div>
    </>
  );
}
