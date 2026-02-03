import React, { useState, useEffect } from "react";
import { web3auth } from "@/lib/web3auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut, Wallet } from "lucide-react";
import { useLocation } from "wouter";
import { useWalletContext } from "@/lib/wallet/WalletProvider";

export function MeeBotNavButton() {
  const { isConnected, wallets, activeWallet } = useWalletContext();
  const { toast } = useToast();
  const [setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  
  useEffect(() => {
    const init = async () => {
      try {
        if (web3auth.status === "not_ready") {
          await web3auth.init();
        }
        if (web3auth.connected) {
          const user = await web3auth.getUserInfo();
          setUserInfo(user);
        }
      } catch (error) {
        console.error("Web3Auth Init Error:", error);
      }
    };
    init();
  }, []);

  const login = async () => {
    try {
      setLoading(true);
      if (!web3auth.connected) {
        await web3auth.connect();
      }
      const user = await web3auth.getUserInfo();
      setUserInfo(user);
      toast({
        title: "Welcome!",
        description: `สวัสดีคุณ ${user.name || "User"}`,
      });
      setLocation("/dashboard");
    } catch (error) {
      console.error(error);
      toast({ title: "Login Failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await web3auth.logout();
      setUserInfo(null);
      setLocation("/");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  if (loading) {
    return (
      <Button variant="ghost" size="sm" className="bg-white/5 text-white">
        <Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading...
      </Button>
    );
  }

  if (!userInfo) {
    return (
      <Button 
        onClick={login} 
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-lg border border-white/10"
      >
        <Wallet className="w-4 h-4 mr-2" /> Connect MeeBot
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-white/5 p-1 pr-2 rounded-full border border-white/10 backdrop-blur-md">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded-full">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <div className="flex flex-col text-right">
           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Smart Wallet</span>
           <span className="text-xs font-bold text-white max-w-[100px] truncate">
             {userInfo.name || "User"}
           </span>
        </div>
      </div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={logout}
        className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-full"
      >
        <LogOut className="w-4 h-4" />
      </Button>
    </div>
  );
}
