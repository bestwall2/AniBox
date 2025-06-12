import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ProgressBar from '@/components/NProgress';
import { Suspense } from 'react';
import QueryProvider from "@/components/QueryProvider"; // Import the new QueryProvider

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
  title: "AniPlay",
  description: "Free Anime WebSite For Watching Anime For Free ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="YSX0QBTUpg092ujQcCx9pcyX5TXf-tAwNvTWRMNN-pQ" />
        {/* other meta tags */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <Suspense fallback={null}>
            <ProgressBar />
          </Suspense>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}