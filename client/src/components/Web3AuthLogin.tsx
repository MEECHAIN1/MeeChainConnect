import React, { useState, useEffect } from 'react';
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, IProvider } from "@web3auth/base";
import { Button } from "./ui/button";
import { Loader2, LogIn, LogOut, User } from "lucide-react";
import { WalletManager } from "../lib/WalletManager"; // เรียกใช้ Manager ที่เราทำไว้

// Config ของคุณ
const clientId = "BDoEZ3QXE314y8jyZl9QYB9gwZX6b6LkNvU3li8GSYf17B-dlMGn3WBlrRj_dqIAI_0-GZBs7YJmMlUnwPs0XfI";

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x5afe", // Hex ของ 23294 (Sapphire Mainnet)
  rpcTarget: "[https://sapphire.oasis.io](https://sapphire.oasis.io)",
  displayName: "Oasis Sapphire Mainnet",
  blockExplorer: "[https://explorer.oasis.io/mainnet/sapphire](https://explorer.oasis.io/mainnet/sapphire)",
  ticker: "ROSE",
  tickerName: "ROSE",
};

export const Web3AuthLogin = () => {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3Auth({
          clientId,
          chainConfig,
          web3AuthNetwork: "sapphire_mainnet", // ตรงตาม Environment ของคุณ
        });

        setWeb3auth(web3auth);
        await web3auth.initModal();

        if (web3auth.connected) {
          setProvider(web3auth.provider);
          setLoggedIn(true);
          const user = await web3auth.getUserInfo();
          setUserInfo(user);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const login = async () => {
    if (!web3auth) return;
    try {
      const web3authProvider = await web3auth.connect();
      setProvider(web3authProvider);
      setLoggedIn(true);
      const user = await web3auth.getUserInfo();
      setUserInfo(user);

      // สร้าง Smart Wallet ทันทีที่ล็อกอินสำเร็จ
      if (user.email) {
        await WalletManager.createSmartWallet(user.email, "Social Vault", "main");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const logout = async () => {
    if (!web3auth) return;
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
    setUserInfo(null);
  };

  if (loading) {
    return <Button disabled variant="ghost"><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Loading Auth...</Button>;
  }

  if (loggedIn) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden md:flex flex-col items-end mr-2">
          <span className="text-xs font-bold text-blue-400">{userInfo?.name}</span>
          <span className="text-[10px] text-gray-500">{userInfo?.email}</span>
        </div>
        <img src={userInfo?.profileImage} alt="Profile" className="w-8 h-8 rounded-full border border-blue-500/30" />
        <Button onClick={logout} variant="destructive" size="sm">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={login} className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg">
      <LogIn className="mr-2 h-4 w-4" />
      Login with Social
    </Button>
  );
};