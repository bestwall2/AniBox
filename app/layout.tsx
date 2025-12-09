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
  title: "AniBox",
  description:
    "AniBox: Your ultimate destination for discovering and watching a vast collection of anime series and movies for free. Stream the latest episodes and timeless classics.",
  openGraph: {
    title: "AniBox",
    description:
      "AniBox: Your ultimate destination for discovering and watching a vast collection of anime series and movies for free. Stream the latest episodes and timeless classics.",
    url: "https://ani-box-nine.vercel.app",
    siteName: "AniBox",
    images: [
      {
        url: "https://github.com/bestwall2/AniBox/blob/main/app/images/logo.png?raw=true",
        width: 1200,
        height: 630,
        alt: "AniBox Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AniBox",
    description:
      "AniBox: Your ultimate destination for discovering and watching a vast collection of anime series and movies for free. Stream the latest episodes and timeless classics.",
    images: [
      "https://github.com/bestwall2/AniBox/blob/main/app/images/logo.png?raw=true",
    ],
  },
  icons: {
    icon: "https://github.com/bestwall2/AniBox/blob/main/app/images/logo.png?raw=true",
    shortcut: "/favicon.ico",
    apple:
      "https://github.com/bestwall2/AniBox/blob/main/app/images/logo.png?raw=true",
  },
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
        <meta name="theme-color" content="#000000" />
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
