"use client";
import "$/lib/styles/globals.css";
import SimpleNav from "$/app/components/nav";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <html lang="en">
          <body className="md:overflow-y-hidden ">
            <header>
              <Toaster closeButton richColors className="absolute inset-10" />
              <SimpleNav />
            </header>
            <main>{children}</main>
          </body>
        </html>
      </SessionProvider>
    </QueryClientProvider>
  );
}
