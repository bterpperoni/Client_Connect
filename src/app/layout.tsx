"use client";
import { useState } from "react";
import "$/lib/styles/globals.css";
import SimpleNav from "$/app/components/nav";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "react-query";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <html lang="en">
          <body className="md:overflow-y-hidden">
            <header>
              <SimpleNav />
            </header>
            <main>{children}</main>
          </body>
        </html>
      </SessionProvider>
    </QueryClientProvider>
  );
}
