import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const spaceGroteskHeading = Space_Grotesk({subsets:['latin'],variable:'--font-heading'});

const manrope = Manrope({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "BuildAForm",
  description: "Build cool forms faster than ever with AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full antialiased", manrope.variable, spaceGroteskHeading.variable)}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
