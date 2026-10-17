import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// 引入你的全局 Provider (通常包含 React Query, Theme, Wagmi 等)
import { Providers } from "@/components/provider"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TradeOps | Enterprise Trade Infrastructure",
  description: "The multi-tenant warehouse and customs platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
