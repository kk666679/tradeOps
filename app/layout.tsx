import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/provider"; 
import { Web3Provider } from "@/lib/web3/Web3Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://kurnia-kadir.xyz"),
  title: "TradeOps | Enterprise Web3 Trade Infrastructure",
  description: "The multi-tenant warehouse and customs platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        {/* 必须在这里包裹 Web3Provider 才能让全站使用 Wagmi */}
        <Web3Provider>
          <Providers>
            {children}
          </Providers>
        </Web3Provider>
      </body>
    </html>
  );
}
