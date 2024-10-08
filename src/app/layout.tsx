import type { Metadata } from "next";
import localFont from "next/font/local";
import TopNavbar from "../components/TopNavbar/TopNavbar"; // Import TopNavbar
import SideNavbar from "../components/SideNavbar/SideNavbar"; // Import SideNavbar
import "./globals.css";
import Head from "next/head"; // Import Head component for metadata

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
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        {/* Open Graph metadata for LinkedIn */}
        <meta property="og:title" content="My Paging App" />
        <meta property="og:description" content="A paging app I have been working on. Currently trying to work on the map logic for drawing rooms. " />
        <meta property="og:url" content="Canonical link preview URL"/>
        <meta property="og:image" content="images/PagingImage.png"/>
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TopNavbar />
        <SideNavbar />
        <div className="content"> {/* Wrapper for page-specific content */}
          {children} {/* This renders the content of each page */}
        </div>
      </body>
    </html>
  );
}
