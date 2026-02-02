import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";

// ดึงค่าจาก .env (ตัวใหม่ที่คุณเพิ่งเปลี่ยน)
const clientId = import.meta.env.VITE_WEB3AUTH_CLIENT_ID; 

// การตั้งค่า Chain (Oasis Sapphire)
const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x5afe", // Hex ของ 23294
  rpcTarget: "https://sapphire.oasis.io",
  displayName: "Oasis Sapphire Mainnet",
  blockExplorerUrl: "https://explorer.oasis.io/mainnet/sapphire",
  ticker: "ROSE",
  tickerName: "ROSE",
  logo: "https://cryptologos.cc/logos/oasis-network-rose-logo.png",
};

// ตั้งค่า Provider
const privateKeyProvider = new EthereumPrivateKeyProvider({ 
  config: { chainConfig } 
});

// @ts-ignore - Web3Auth typing issue with privateKeyProvider
const web3authOptions: any = {
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET, 
  privateKeyProvider,
  uiConfig: {
    appName: "MeeChain Portal",
    mode: "dark",
    theme: {
      primary: "#3b82f6",
    },
    loginMethodsOrder: ["google", "facebook", "twitter", "discord"],
  },
};

// สร้าง Instance หลัก
export const web3auth = new Web3Auth(web3authOptions);