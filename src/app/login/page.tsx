"use client"
import { signIn } from "next-auth/react";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default function SignInPage() {
  const credentialsAction = async (event: React.FormEvent<HTMLFormElement>) => {
    const target = event.currentTarget;
    const body = {
      email: target.email.value,
      password: target.password.value,
    };

    const result = await signIn("credentials", {
      redirect: true,
      email: body.email,
      password: body.password,
    });
    if (result?.error) {
      console.error(result.error);
    } else if (result?.ok) {
      console.log(result);
    }
  };

  return (
    <form onSubmit={credentialsAction}>
      <label htmlFor="credentials-email">
        Email
        <input type="email" id="credentials-email" name="email" />
      </label>
      <label htmlFor="credentials-password">
        Password
        <input type="password" id="credentials-password" name="password" />
      </label>
      <input type="submit" value="Sign In" />
    </form>
  );
}
