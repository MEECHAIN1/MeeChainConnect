import { createConfig, http } from 'wagmi';
import { defineChain } from 'viem';
import { injected } from 'wagmi/connectors';

export const meechain = defineChain({
  id: 56,
  name: 'BSC Chain',
  nativeCurrency: {
    decimals: 18,
    name: 'MeeChain Token',
    symbol: 'MCB',
  },
  rpcUrls: {
    default: { http: [import.meta.env.VITE_RPC_URL || 'https://meechain1.bolt.host'] }
  },
  blockExplorers: {
    default: { name: 'Explorer', url: import.meta.env.VITE_EXPLORER_URL || 'https://explorer.meechain.io' },
  },
});

export const config = createConfig({
  chains: [meechain],
  connectors: [
    injected(),
  ],
  transports: {
    [meechain.id]: http(),
  },
});
