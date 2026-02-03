import React from "react";
import { WalletProvider } from "@/lib/wallet/WalletProvider";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export function MeeBotNavButton() {
  const { isConnected, login, logout, isLoading, activeWallet } = useWalletContext();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Disconnected",
      description: "Logged out successfully",
    });
    setLocation("/");
  };

  if (isLoading) {
    return (
      <Button variant="ghost" disabled className="gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading...</span>
      </Button>
    );
  }

  if (isConnected && activeWallet) {
    return (
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          className="gap-2 border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
          onClick={() => setLocation("/profile")}
        >
          <Wallet className="h-4 w-4" />
          <span className="hidden sm:inline">
            {activeWallet.address.slice(0, 6)}...{activeWallet.address.slice(-4)}
          </span>
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-gray-400 hover:text-red-400 hover:bg-red-500/10"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button 
      onClick={handleLogin}
      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/20"
    >
      Connect Wallet
    </Button>
  );
}