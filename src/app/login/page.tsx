"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "../components/ui/form";
import { AuthError } from "next-auth";
// import { saltAndHashPassword } from "$/lib/utils/password";

export type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  // const [formData, setFormData] = useState({ username: "", password: "" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const form = useForm({
    defaultValues: {
      email: email,
      password: password,
    },
  });

  const handleSubmit = async (data: LoginFormData) => {
    try {
      await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            throw new Error("Invalid credentials");
          default:
            throw new Error("Something went wrong");
        }
      }
      throw new Error("Error authenticating user");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <input
            type="text"
            placeholder="Username"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              console.log(email);
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={async (e) => {
              
              setPassword(e.target.value);
              // console.log(saltAndHashPassword(password));
            }}
          />
          <button type="submit">Login</button>
        </form>
      </Form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
