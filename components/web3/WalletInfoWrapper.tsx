"use client";

import dynamic from "next/dynamic";

// 核心修复：强制只在客户端渲染 WalletInfo，彻底规避服务端找不到 WagmiProvider 的报错
const WalletInfo = dynamic(
  () => import("./WalletInfo").then((mod) => mod.WalletInfo),
  { ssr: false }
);

export function WalletInfoWrapper() {
  return <WalletInfo />;
}
