"use client";

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance } from 'wagmi';

export function WalletInfo() {
  const { address, isConnected, chain } = useAccount();
  const { data: balance } = useBalance({ address });
  const formattedBalance =
    balance != null
      ? Number(balance.value) / 10 ** Number(balance.decimals)
      : null;

  if (!isConnected) {
    return (
      <div className="p-8 border border-slate-800 rounded-3xl bg-[#0A0A0A]/50 backdrop-blur-xl flex flex-col items-center max-w-sm w-full">
        <p className="text-slate-400 mb-6 text-center">Connect your wallet to view Web3 features</p>
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="p-8 border border-blue-900/50 rounded-3xl bg-blue-950/20 backdrop-blur-xl w-full max-w-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Smart Account</h3>
        <ConnectButton showBalance={false} chainStatus="icon" accountStatus="address" />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between border-b border-white/10 pb-2">
          <span className="text-slate-400 text-sm">Network</span>
          <span className="font-mono text-emerald-400 text-sm">{chain?.name || 'Unknown'}</span>
        </div>
        <div className="flex justify-between border-b border-white/10 pb-2">
          <span className="text-slate-400 text-sm">Address</span>
          <span className="font-mono text-white text-sm">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
        </div>
        <div className="flex justify-between border-b border-white/10 pb-2">
          <span className="text-slate-400 text-sm">Balance</span>
          <span className="font-mono text-blue-400 text-sm">
            {formattedBalance !== null
              ? `${formattedBalance.toFixed(4)} ${balance?.symbol ?? ''}`.trim()
              : 'Loading...'}
          </span>
        </div>
      </div>
    </div>
  );
}
