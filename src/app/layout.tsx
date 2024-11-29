import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryProvider } from "@/providers/query-provider";
import ToastProvider from "@/providers/toast-provider";
import NextTopLoader from "nextjs-toploader";
import { NuqsProvider } from "@/providers/nuqs-provider";
import { SheetProvider } from "@/providers/sheet-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Śledzenie budżetu",
  description: "Aplikacja do śledzenia budżetu domowego @RiP3rQ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      afterSignOutUrl={"/sign-in"}
      appearance={{
        elements: {
          formButtonPrimary:
            "bg-primary hover:bg-primary/90 text-sm !shadow-none",
        },
      }}
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <NuqsProvider>
            <QueryProvider>
              <NextTopLoader color={"#10b981"} showSpinner={false} />
              {children}
              <SheetProvider />
              <ToastProvider />
            </QueryProvider>
          </NuqsProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
