'use server'
import { auth } from "$/server/auth/auth";
import Login from "$/app/_components/authentication/login";
import Logout from "$/app/_components/authentication/logout";

export default async function LoginHome() {
  const session = await auth();

     if(session) return   <>    <div className="mb-[25px] w-max border-y-2 font-sans md:text-[3rem] text-[2rem] flex-wrap uppercase leading-loose tracking-wider text-purple-800">
 </div>
<div className="w-full h-screen justify-center items-center text-xl text-center my-4 bold">
<Logout />
</div>
</>

  return (
    <>
      <div>
        <h1 className="w-full text-2xl text-center my-4 bold ">Sign in with your credentials</h1>
        {!session && (
          <div>
            <Login />
          </div>
        ) }
      </div>
    </>
  );
}
