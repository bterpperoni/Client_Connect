import { auth } from "$/server/auth/auth";
import Login from "../components/authentication/login";

export default async function LoginHome() {
  const session = await auth();

  if(session) return location.assign(`/dashboard/${session.user.id}`);
  return (
    <>
      <div>
        <h1 className="w-full text-xl text-center my-4 bold ">You can login with this form as a manager</h1>
        {!session && (
          <div>
            <Login />
          </div>
        )}
      </div>
    </>
  );
}
