import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spectra Holdings Group - Community Directory & Local Services",
  description: "Connect with trusted local businesses and services in your Spectra community. Find plumbers, electricians, healthcare, restaurants, and more in your neighborhood.",
  keywords: ["Spectra Holdings", "community directory", "local services", "affordable housing", "local businesses", "plumbers", "electricians", "healthcare", "restaurants", "community events"],
  authors: [{ name: "Spectra Holdings Group" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Spectra Holdings Group - Community Directory",
    description: "Your Neighborhood. Your Services. Connect with trusted local businesses in your community.",
    siteName: "Spectra Holdings Group",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Spectra Holdings Group - Community Directory",
    description: "Your Neighborhood. Your Services. Connect with trusted local businesses.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
