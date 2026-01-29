import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { defineChain } from "viem";
import { mainnet } from "wagmi/chains";

// ✅ ต้องมี export const meechain ตรงนี้
export const meechain = defineChain({
  id: 23294,
  name: 'Oasis Sapphire',
  network: 'sapphire',
  nativeCurrency: { name: 'ROSE', symbol: 'ROSE', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://sapphire.oasis.io'] },
    public: { http: ['https://sapphire.oasis.io'] },
  },
  blockExplorers: {
    default: { name: 'Oasis Explorer', url: 'https://explorer.oasis.io/mainnet/sapphire' },
  },
});

export const config = getDefaultConfig({
  appName: "MeeChain",
  projectId: "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
  chains: [meechain, mainnet],
  ssr: false,
});