"use client"
import "./lib/styles/globals.css";
import { SimpleNav } from "./components/nav";
import { SessionProvider } from "next-auth/react";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="en">
        <body>
          <header>
            <nav>
              <SimpleNav />
            </nav>
          </header>
          <main>{children}</main>
        </body>
      </html>
    </SessionProvider>
  );
}
