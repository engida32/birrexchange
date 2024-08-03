import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BirrExchange",
  description: "Birr Exchange Rate",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://birrexchange.vercel.app/",
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/7/71/Flag_of_Ethiopia.svg",
        width: 800,
        height: 600,
        alt: "Birr Exchange Rate",
      },
    ],
    title: "BirrExchange",
    description: "Birr Exchange Rate",
  },
  twitter: {
    site: "@site",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link
        rel="icon"
        href="https://upload.wikimedia.org/wikipedia/commons/7/71/Flag_of_Ethiopia.svg"
      />
      <body className={inter.className}>{children}</body>
    </html>
  );
}
