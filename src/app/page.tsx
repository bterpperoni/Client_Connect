import { Link } from "lucide-react";
import { useSession } from "next-auth/react";

export default function Home() {

const { data: session, status } = useSession();

  return (
    <div className="container flex min-w-[75%] flex-col items-center justify-center gap-12 bg-white px-4 py-16">
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
                    <div className="mb-8 text-base text-purple-800">
                      Please sign in to manage tasks or go to the dashboard if
                      you are a simple user.
                    </div>
                  </>
                )}
              </div>
            </div>

            <p
              className={`border-t-2 p-2 text-center text-xl tracking-wider text-purple-800`}
            >
              Status :{" "}
              <span
                className={`${status === "unauthenticated" ? "uppercase text-red-800" : "uppercase text-green-800"}`}
              >
                {status == "unauthenticated"
                  ? "Unauthenticated"
                  : "Authenticated"}
              </span>
            </p>
            <Link
              href={session ? "/api/auth/signout" : "/api/auth/signin"}
              className="group relative m-1 cursor-pointer overflow-hidden rounded-xl border-2 border-indigo-600 px-3.5 py-2 text-[1.5rem] font-medium text-indigo-600"
            >
              <span className="ease absolute top-1/2 h-0 w-64 origin-center -translate-x-20 rotate-45 bg-indigo-600 transition-all duration-300 group-hover:h-64 group-hover:-translate-y-32"></span>
              <span className="ease relative text-indigo-600 transition duration-300 group-hover:text-white">
                {session ? "Sign out" : "Sign in"}
              </span>
            </Link>
          </div>
        </div>
      </div>
  );
}
