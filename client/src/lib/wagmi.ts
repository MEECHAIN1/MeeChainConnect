import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { defineChain } from "viem";
import { mainnet } from "wagmi/chains";

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
  appName: "MeeChain App",
  projectId: "b0d81328f8ab0541fdede7db9ff25cb1",
  chains: [meechain, mainnet],
  ssr: false, // ปิด SSR เพราะเราทำ SPA (Single Page App) บน Replit
});
