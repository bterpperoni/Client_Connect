import { signIn } from "$/server/auth";
import { useState } from "react";

export default function LoginPage() {
    return (
        <section className="h-screen">
            <div className="container h-full px-6 py-24">
                <div className="flex h-full flex-wrap items-center justify-center lg:justify-between">
                    <div className="mb-12 md:mb-0 md:w-8/12 lg:w-6/12">
                        <img
                            src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
                            className="w-full"
                            alt="Phone image"
                        />
                    </div>

                    {/* <!-- Right column container with form --> */}
                    <div className="md:w-8/12 lg:ms-6 lg:w-5/12">
                        <form
                            action={async (formData) => {
                                "use server";
                                await signIn("credentials", formData);
                            }}
                            id="form1"
                        >
                            <label>
                                Email
                                <input name="email" type="email" />
                            </label>
                            <label>
                                Password
                                <input name="password" type="password" />
                            </label>
                            <button type="submit" form="form1" value="Submit">
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
