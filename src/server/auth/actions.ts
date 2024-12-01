"use server";

import { SignInResponse } from "next-auth/react";
import { signIn, signOut } from "./auth";

//! Cred login ------
export async function doLogout() {
  await signOut({ redirectTo: "/" });
}

export async function doCredentialLogin(
  formData: FormData
): Promise<SignInResponse | undefined> {
  console.log("formData", formData);

  try {
    const response = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
    return response;
  } catch (err) {
    throw err;
  }
}
//! Cred login ------


//! OAuth login
// export async function doOAuthLogin(provider: string) {
//   await signIn(provider);
// }