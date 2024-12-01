"use client";

import { doCredentialLogin } from "$/server/auth/actions";
import { useState } from "react";
import { Form, useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const LoginForm = () => {
  const [error, setError] = useState("");

  const form = useForm({
    defaultValues: {
      email: "example@example.com",
      password: "strong password",
    },
  });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);

      const response = await doCredentialLogin(formData);

      if (!!response?.error) {
        console.error(response.error);
        setError(response.error);
      } else {
        location.assign("/");
      }
    } catch (e) {
      console.error(e);
      setError(
        "On dirait que tu as oublié ton mot de passe, \n Contact nous au plus vite \n à afin de régler ce désgrément \n Contact : https://risk-horizon.be/contact ."
      );
    }
  }

  return (
    <div className="m-2 p-4 border-black border-2">
      <div className="text-base justify text-red-500">{error}</div>
      <form
        className="my-5 flex flex-col items-center border p-3 border-gray-200 rounded-md"
        onSubmit={onSubmit}
      >
        <div className="my-2">
          <label htmlFor="email">Email Address</label>
          <input
            className="border mx-2 border-gray-500 rounded"
            type="email"
            name="email"
            id="email"
          />
        </div>

        <div className="my-2">
          <label htmlFor="password">Password</label>
          <input
            className="border mx-2 border-gray-500 rounded"
            type="password"
            name="password"
            id="password"
          />
        </div>

        <button
          type="submit"
          className="bg-orange-300 mt-4 rounded flex justify-center items-center w-36"
        >
          Ceredential Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
