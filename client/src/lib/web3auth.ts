import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";

const clientId = import.meta.env.VITE_WEB3AUTH_CLIENT_ID; 

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x5afe",
  rpcTarget: "https://sapphire.oasis.io",
  displayName: "Oasis Sapphire Mainnet",
  blockExplorerUrl: "https://explorer.oasis.io/mainnet/sapphire",
  ticker: "ROSE",
  tickerName: "ROSE",
  logo: "https://cryptologos.cc/logos/oasis-network-rose-logo.png",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({ 
  config: { chainConfig } 
});

export const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET, 
  privateKeyProvider: privateKeyProvider as any,
  uiConfig: {
    appName: "MeeChain Portal",
    mode: "dark",
    theme: {
      primary: "#3b82f6",
    },
  },
});