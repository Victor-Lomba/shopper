"use client";
import { APIProvider } from "@vis.gl/react-google-maps";
import "./globals.css";
import { Lato } from "next/font/google";
import { Toaster } from "react-hot-toast";

const lato = Lato({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={lato.className}>
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY!}>
          {children}
          <Toaster />
        </APIProvider>
      </body>
    </html>
  );
}
