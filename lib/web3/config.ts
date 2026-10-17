import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'TradeOps Web3',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // 后续可替换为你自己的 ID
  chains: [mainnet, polygon, sepolia],
  ssr: true,
});
