"use client"
import { signIn } from "next-auth/react"
 
export default function SignIn() {
  const credentialsAction = (formData: FormData) => {
    const data = Object.fromEntries(formData.entries());
    signIn("credentials", data)
  }
 
  return (
    <form action={credentialsAction}>
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
  )
}