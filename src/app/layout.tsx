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
  description: "Spectra Holdings Group connects affordable housing residents with trusted local businesses, services, and community resources across 15+ U.S. states.",
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
  ],
  authors: [{ name: "Spectra Holdings Group" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Spectra Holdings Group | Community Living & Local Services Platform",
    description: "Spectra Holdings Group connects affordable housing residents with trusted local businesses, services, and community resources across 15+ U.S. states.",
    siteName: "Spectra Holdings Group",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Spectra Holdings Group | Community Living & Local Services Platform",
    description: "Spectra Holdings Group connects affordable housing residents with trusted local businesses, services, and community resources across 15+ U.S. states.",
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
                telephone: "+1-800-SPECTRA",
                contactType: "customer service",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
