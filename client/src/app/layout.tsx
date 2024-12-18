

import type { Metadata } from "next";
import localFont from "next/font/local";
import TopNavbar from "../components/layoutComponents/TopNavbar/TopNavbar"; // Import TopNavbar
import SideNavbar from "../components/layoutComponents/SideNavbar/SideNavbar"; // Import SideNavbar
import "../../globals.css";
import { MapsProvider } from "../context/MapsContext";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// const queryClient = new QueryClient();

const geistSans = localFont({
  src: "/fonts/GeistVF.woff", // Absolute path for fonts in 'public'
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "/fonts/GeistMonoVF.woff", // Absolute path for fonts in 'public'
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Metadata API (includes Open Graph tags)
export const metadata: Metadata = {
  title: "My Paging App",
  description: "A paging app I have been working on. Currently trying to work on the map logic for drawing rooms.",
  openGraph: {
    title: "My Paging App",
    description: "A paging app I have been working on. Currently trying to work on the map logic for drawing rooms.",
    url: "https://manny-epic-mannig1224s-projects.vercel.app/",
    images: [
      {
        url: "https://manny-epic-mannig1224s-projects.vercel.app/images/PagingImage.png",
        width: 1200,
        height: 630,
        alt: "Paging App Image",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <QueryClientProvider client={queryClient}> */}
          <MapsProvider>
            <TopNavbar />
            <SideNavbar />
            <div className="content"> {/* Wrapper for page-specific content */}
              {children}
            </div>
          </MapsProvider>
        {/* </QueryClientProvider> */}
        
      </body>
    </html>
  );
}
