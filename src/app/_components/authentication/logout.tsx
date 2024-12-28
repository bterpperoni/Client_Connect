"use client"

import { doLogout } from "$/server/auth/actions";
import { useState } from "react";
import Btn from "$/app/_components/ui/btn";

export default function LogoutButton() {
  const [error, setError] = useState("");

  async function handleLogout(
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();
    try {
      const response = await doLogout();

      if (!!response?.error) {
        console.error(response.error);
        setError(response.error);
      } else {
        location.assign(`/authentication`);
      }
    } catch (e) {
      console.error(e);
      setError(
        "Logout failed."
      );
    }
  }

  return (
    <form onSubmit={handleLogout} className="w-full  flex items-center justify-center">
      <Btn
        percentageWidth={25}
        type="submit"
        classList="bg-white"
      >
        Sign out
      </Btn>
    </form>
  );
}
