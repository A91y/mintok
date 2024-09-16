import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
  title: "Mintok",
  description: "Mint SPL tokens",
  openGraph: {
    title: "Mintok",
    description: "Mint SPL tokens",
    type: "website",
    url: "https://mintok.ayushagr.me",
    siteName: "Mintok",
    images: [
      {
        url: "https://mintok.ayushagr.me/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mintok",
      },
    ],
  },
  twitter: {
    creator: "@A91y",
    site: "@A91y",
    card: "summary_large_image",
    title: "Mintok",
    description: "Mint SPL tokens",
    images: ["https://mintok.ayushagr.me/og-image.png"],
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
        {children}
      </body>
    </html>
  );
}
