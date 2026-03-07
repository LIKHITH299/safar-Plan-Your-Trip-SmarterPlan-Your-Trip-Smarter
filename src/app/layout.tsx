import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Kannada } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { OfflineProvider } from "@/components/providers/OfflineProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoKannada = Noto_Sans_Kannada({
  variable: "--font-noto-kannada",
  subsets: ["latin", "kannada"],
});

export const metadata: Metadata = {
  title: "Safar — AI Travel Planner",
  description: "Plan your next adventure with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoKannada.variable} antialiased font-sans`}
      >
        <LanguageProvider>
          <OfflineProvider>
            {children}
          </OfflineProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
