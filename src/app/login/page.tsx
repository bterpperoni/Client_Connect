import { auth } from "$/server/auth/auth";
import Login from "../components/authentication/login";

export default async function LoginHome() {
  const session = await auth();

  return (
    <>
      <div>
        <h1>Welcome to LoginHome!</h1>
        {!session && (
          <div>
            <Login />
          </div>
        )}
        {session && <h1>Welcome {session?.user.name}!</h1>}
      </div>
      <div className="text-xl text-black absolute w-1/2 h-auto">
        {JSON.stringify(session, null, 2)}
      </div>
    </>
  );
}
