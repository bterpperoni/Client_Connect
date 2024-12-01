import { Session } from "next-auth";

export type UserProps = { sessionUser: NonNullable<Session["user"]> };

export const User = ({ sessionUser }: UserProps) => {
  return (
    <div>
      <h1>{sessionUser.name}</h1>
      <p>{sessionUser.email}</p>
    </div>
  );
};

export default User;
