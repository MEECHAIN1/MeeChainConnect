import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { defineChain } from "viem";
import { mainnet } from "wagmi/chains";

// กำหนดค่า Oasis Sapphire Chain
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

// ตั้งค่า RainbowKit Config
export const config = getDefaultConfig({
  appName: "MeeChain App",
  projectId: "b0d81328f8ab0541fdede7db9ff25cb1", // Project ID เดิมของคุณ
  chains: [meechain, mainnet],
  ssr: false, // ปิด SSR เพราะเราทำ SPA (Single Page App) บน Replit
});