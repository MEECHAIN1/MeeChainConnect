import React, { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance } from "wagmi";
import { injected } from "wagmi/connectors";
import { Button } from "./ui/button";
import { Wallet, LogOut, Loader2, CreditCard, Plus, Send } from "lucide-react";
import { WalletManager } from '../lib/WalletManager';
import { SmartWallet } from '../types/smartWallet';
import { formatEther } from "viem";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ConnectWallet() {
  const { address, isConnected, isConnecting } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  
  const [smartWallets, setSmartWallets] = useState<SmartWallet[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const { data: balance } = useBalance({ address });

  // 1. โหลดกระเป๋า Smart Wallet เมื่อเชื่อมต่อสำเร็จ
  useEffect(() => {
    if (address) {
      const userWallets = WalletManager.getWallets(address);
      setSmartWallets(userWallets);
    } else {
      setSmartWallets([]);
    }
  }, [address]);

  // 2. ฟังก์ชันสร้างกระเป๋าใหม่
  const handleCreateWallet = async () => {
    if (!address) return;
    setIsCreating(true);
    try {
      const newWallet = await WalletManager.createSmartWallet(address, "MeeVault", "main");
      setSmartWallets(prev => [...prev, newWallet]);
      alert(`🎉 Wallet Created!\nAddress: ${newWallet.address}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  // 3. ฟังก์ชันทดสอบส่งธุรกรรม
  const handleSendTest = async (wallet: SmartWallet) => {
    setIsSending(true);
    try {
      const txHash = await WalletManager.sendTransaction(
        wallet, 
        { to: wallet.address, value: "0" }, 
        true
      );
      alert(`✅ Sent! Hash: ${txHash}`);
    } catch (e: any) {
      alert(`Failed: ${e.message}`);
    } finally {
      setIsSending(false);
    }
  };

  if (isConnecting) {
    return <Button disabled><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Connecting...</Button>;
  }

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="font-mono">
            <Wallet className="mr-2 h-4 w-4 text-green-400" />
            {address.slice(0, 6)}...{address.slice(-4)}
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-72">
          <DropdownMenuLabel>EOA Balance: {balance ? `${Number(formatEther(balance.value)).toFixed(4)} ${balance.symbol}` : '...'}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel>Smart Wallets ({smartWallets.length})</DropdownMenuLabel>
          {smartWallets.map((wallet) => (
            <div key={wallet.id} className="p-2 hover:bg-muted rounded flex justify-between items-center text-sm">
              <div>
                <div className="font-medium">{wallet.name}</div>
                <div className="text-xs text-muted-foreground">{wallet.address.slice(0,6)}...</div>
              </div>
              <Button size="icon" variant="ghost" onClick={() => handleSendTest(wallet)} disabled={isSending}>
                {isSending ? <Loader2 className="h-3 w-3 animate-spin"/> : <Send className="h-3 w-3"/>}
              </Button>
            </div>
          ))}

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleCreateWallet} disabled={isCreating} className="cursor-pointer">
            {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Plus className="mr-2 h-4 w-4"/>}
            Create New Vault
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => disconnect()} className="text-red-500 cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" /> Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button onClick={() => connect({ connector: injected() })}>
      <CreditCard className="mr-2 h-4 w-4" /> Connect Wallet
    </Button>
  );
}