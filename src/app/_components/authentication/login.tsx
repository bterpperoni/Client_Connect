"use client";

import { doCredentialLogin } from "$/server/auth/actions";
import { useState } from "react";
import Btn from "$/app/_components/ui/btn";

const LoginForm = () => {
  const [error, setError] = useState("");



  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);

      const response = await doCredentialLogin(formData);

      if (!!response?.error) {
        console.error(response.error);
        setError(response.error);
      } else {
        location.assign(`/`);
      }
    } catch (e) {
      console.error(e);
      setError(
        "Login failed. Please check your email and password and try again."
      );
    }
  }

  return (
    <div className="">
      {error && (<div className="text-base justify bg-red-500 text-white border-2 border-white rounded-md p-2">{error}</div>)}
      <form
        className="my-5 flex flex-col justify-center items-center border p-3 border-gray-200  rounded-md"
        onSubmit={onSubmit}>
        <div className="my-2 text-white flex flex-col">
          <label htmlFor="email">Email Address</label>
          <input
            className="border mx-2 border-gray-500 rounded"
            type="email"
            name="email"
            id="email"
          />
        </div>

        <div className="my-2 text-white flex flex-col">
          <label htmlFor="password">Password</label>
          <input
            className="border mx-2 mb-6 border-gray-500 rounded"
            type="password"
            name="password"
            id="password"
          />
        </div>

        <Btn
          classList="mt-2 bg-white border-2 border-white w-[40%]"
          textSize="md"
          type="submit"
          >
          Sign in
        </Btn>
      </form>
    </div>
  );
};

export default LoginForm;
