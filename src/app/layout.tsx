import type { Metadata } from "next";
import "./globals.css";
import ContextProvider from "@/context/context";

export const metadata: Metadata = {
  title: "Email-Verification",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <ContextProvider>
        {children}
        </ContextProvider>
        
      </body>
    </html>
  );
}
