import type { Metadata } from "next";
import { Suspense } from "react"; // 1. Import Suspense
import { Geist, Geist_Mono, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";

import { NavigationSidebar } from "@/components/organisms/NavigationSidebar";

const playfairDisplay = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SportsApp",
  description: "Advanced Sports Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("dark", "h-full", "antialiased", geistSans.variable, geistMono.variable, inter.variable, "font-serif", playfairDisplay.variable)}
    >
      <body className="flex h-screen overflow-hidden bg-background">
        {/* Wrap everything that might use searchParams */}
        <Suspense fallback={<div className="p-8">Loading...</div>}>
          <NavigationSidebar />
          <Providers>
            <main className="flex-1 overflow-y-auto p-8">
              {children}
            </main>
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}