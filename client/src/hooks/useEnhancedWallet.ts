import { useState, useEffect } from "react";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK, IProvider } from "@web3auth/base";
import { RPC } from "@/lib/wallet/rpc";

// 1. ตั้งค่า Oasis Sapphire
const SAPPHIRE_CONFIG = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x5afe",
  rpcTarget: "https://sapphire.oasis.io",
  displayName: "Oasis Sapphire Mainnet",
  blockExplorerUrl: "https://explorer.oasis.io/mainnet/sapphire",
  ticker: "ROSE",
  tickerName: "ROSE",
  logo: "https://cryptologos.cc/logos/oasis-network-rose-logo.png",
};

export interface UseEnhancedWalletReturn {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isConnected: boolean;
  address: string | null;
  balance: string;
  isLoading: boolean;
  error: string | null;
  activeWallet: { address: string } | null;
  wallets: any[];
}

export const useEnhancedWallet = (clientId: string): UseEnhancedWalletReturn => {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState("0");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- 1. เริ่มต้นระบบ (Initialize) ---
  useEffect(() => {
    const init = async () => {
      if (!clientId) return;
      
      try {
        setIsLoading(true);

        // ✅ แก้ไข: ส่ง chainConfig เข้าไปตรงๆ (ไม่ต้องสร้าง privateKeyProvider เอง)
        const web3authInstance = new Web3Auth({
          clientId, 
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
          chainConfig: SAPPHIRE_CONFIG,
        });

        // Add UI configuration separately for the modal
        await web3authInstance.initModal({
          config: {
            loginMethodsOrder: ["google", "facebook", "twitter"],
            theme: "dark",
          }
        });
        setWeb3auth(web3authInstance);

        if (web3authInstance.connected) {
          const web3authProvider = web3authInstance.provider;
          setProvider(web3authProvider);
          setIsConnected(true);
        }
      } catch (error) {
        console.error("Init Error:", error);
        setError("Failed to initialize wallet system");
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [clientId]);

  // --- 2. Login ---
  const login = async () => {
    if (!web3auth) {
      console.error("Web3Auth not initialized");
      return;
    }
    try {
      setIsLoading(true);
      const web3authProvider = await web3auth.connect();
      setProvider(web3authProvider);
      setIsConnected(true);
    } catch (err: any) {
      console.error("Login Failed:", err);
      setError("Login cancelled or failed");
    } finally {
      setIsLoading(false);
    }
  };

  // --- 3. Logout ---
  const logout = async () => {
    if (!web3auth) return;
    try {
      await web3auth.logout();
      setProvider(null);
      setIsConnected(false);
      setAddress(null);
      setBalance("0");
    } catch (err) {
      console.error("Logout Error:", err);
    }
  };

  // --- 4. ดึงข้อมูล User ---
  useEffect(() => {
    const fetchUserData = async () => {
      if (isConnected && provider) {
        try {
          const rpc = new RPC(provider);
          const userAddress = await rpc.getAccounts();
          setAddress(userAddress);
          const userBalance = await rpc.getBalance();
          setBalance(userBalance);
        } catch (err) {
          console.error("Fetch Data Error:", err);
        }
      }
    };

    fetchUserData();
  }, [isConnected, provider]);

  return {
    login,
    logout,
    isConnected,
    address,
    balance,
    isLoading,
    error,
    activeWallet: address ? { address } : null,
    wallets: address ? [{ address }] : [],
  };
};