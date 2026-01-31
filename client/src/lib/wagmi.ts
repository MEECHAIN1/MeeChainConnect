import { createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { defineChain } from 'viem';

export const meechain = defineChain({
  id: 1337,
  name: 'MeeChain',
  nativeCurrency: {
    decimals: 18,
    name: 'Mee Token',
    symbol: 'MEE',
  },
  rpcUrls: {
    default: { http: [import.meta.env.VITE_RPC_URL || 'https://meechain.bolt.host:9545'] },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: import.meta.env.VITE_EXPLORER_URL || 'https://explorer.meechain.io' },
  },
});

export const config = createConfig({
  chains: [meechain],
  transports: {
    [meechain.id]: http(),
  },
});
