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
  title: "Spectra Holdings Group | Community Living & Local Services Platform",
  description: "Spectra Holdings Group connects affordable housing residents with trusted local businesses, services, and community resources across 7 U.S. states.",
  keywords: [
    "Spectra Holdings Group",
    "affordable housing",
    "community living",
    "local services",
    "business directory",
    "resident portal",
    "community resources",
    "local businesses",
    "plumbers",
    "electricians",
    "healthcare",
    "restaurants",
    "community events",
    "Florida",
    "Oklahoma",
    "Louisiana",
    "Texas",
    "Missouri",
    "Kansas",
    "Mississippi",
  ],
  authors: [{ name: "Spectra Holdings Group" }],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Spectra Holdings Group | Community Living & Local Services Platform",
    description: "Spectra Holdings Group connects affordable housing residents with trusted local businesses, services, and community resources across 7 U.S. states.",
    siteName: "Spectra Holdings Group",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Spectra Holdings Group | Community Living & Local Services Platform",
    description: "Spectra Holdings Group connects affordable housing residents with trusted local businesses, services, and community resources across 7 U.S. states.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Spectra Holdings Group",
              description:
                "Community living platform connecting residents with local businesses and services",
              url: "https://spectraholdings.com",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+1-954-684-9707",
                contactType: "customer service",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground overflow-x-hidden`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
