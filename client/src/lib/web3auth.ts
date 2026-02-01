import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";

const clientId = "BDoEZ3QXE314y8jyZl9QYB9gwZX6b6LkNvU3li8GSYf17B-dlMGn3WBlrRj_dqIAI_0-GZBs7YJmMlUnwPs0XfI"; 

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

// ตั้งค่า Private Key Provider
const privateKeyProvider = new EthereumPrivateKeyProvider({ 
  config: { chainConfig } 
});

// สร้าง Instance หลัก
export const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  privateKeyProvider,
  uiConfig: {
    appName: "MeeChain",
    mode: "dark",
    theme: {
      primary: "#3b82f6",
    },
    loginMethodsOrder: ["google", "facebook", "apple", "discord"],
  },
});