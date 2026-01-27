import React, { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance } from "wagmi";
import { injected } from "wagmi/connectors";
import { Button } from "./ui/button"; // ตรวจสอบ path ให้ตรงกับโปรเจกต์คุณ
import { Wallet, LogOut, Loader2, CreditCard, Plus, Send } from "lucide-react";
import { WalletManager } from '../lib/WalletManager';
import { SmartWallet } from '../types/smartWallet'; // ตรวจสอบ path
import { formatEther } from "viem";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // ตรวจสอบ path ให้ตรงกับ UI Library ของคุณ

export function ConnectWallet() {
  const { address, isConnected, isConnecting } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  
  // State สำหรับ Smart Wallet
  const [smartWallets, setSmartWallets] = useState<SmartWallet[]>([]);
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // ดึง Balance ของ EOA (กระเป๋าหลัก)
  const { data: balance } = useBalance({
    address,
  });

  // 1. โหลดกระเป๋า Smart Wallet เมื่อเชื่อมต่อสำเร็จ
  useEffect(() => {
    if (address) {
      const userWallets = WalletManager.getWallets(address);
      setSmartWallets(userWallets);
    } else {
      setSmartWallets([]);
    }
  }, [address]);

  // 2. ฟังก์ชันสร้างกระเป๋าใหม่ (Smart Wallet)
  const handleCreateSmartWallet = async () => {
    if (!address) return;
    
    setIsCreatingWallet(true);
    try {
      // สร้างกระเป๋าประเภท 'main' (หรือจะเพิ่ม UI ให้เลือกประเภทก็ได้)
      const newWallet = await WalletManager.createSmartWallet(address, "MeeVault 01", "main");
      
      // อัปเดต State ทันทีเพื่อให้ UI เปลี่ยน
      setSmartWallets(prev => [...prev, newWallet]);
      
      alert(`🎉 Smart Wallet Created!\nAddress: ${newWallet.address}\nBonus: 100 MEE Token`);
    } catch (error) {
      console.error("Create wallet failed:", error);
      alert("Failed to create smart wallet.");
    } finally {
      setIsCreatingWallet(false);
    }
  };

  // 3. ฟังก์ชันทดสอบส่งธุรกรรมแบบ Gasless (Paymaster)
  const handleTestTransaction = async (wallet: SmartWallet) => {
    setIsSending(true);
    try {
      // จำลองการส่ง 0 ETH ไปหาตัวเอง เพื่อทดสอบระบบ
      const txHash = await WalletManager.sendTransaction(
        wallet, 
        { to: wallet.address, value: "0" }, 
        true // เปิดใช้ Gasless (Paymaster)
      );
      
      alert(`✅ Transaction Sent Successfully!\nHash: ${txHash}\nGas Fee: Sponsored by MeeChain`);
    } catch (e: any) {
      console.error(e);
      alert(`Transaction Failed: ${e.message}`);
    } finally {
      setIsSending(false);
    }
  };

  // --- UI Render Logic ---

  if (isConnecting) {
    return (
      <Button variant="outline" disabled className="bg-white/10 backdrop-blur-md border-white/20 text-white">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Connecting...
      </Button>
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex gap-2">
        {/* Dropdown Menu หลัก */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 font-mono">
              <Wallet className="mr-2 h-4 w-4 text-green-400" />
              {address.slice(0, 6)}...{address.slice(-4)}
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-72 bg-[#1a1b26] border-[#2e2f3e] text-white">
            <DropdownMenuLabel>My EOA Account</DropdownMenuLabel>
            <div className="px-2 py-2 text-sm text-gray-400 bg-black/20 rounded mx-2 mb-2 border border-white/5">
               <div className="flex justify-between">
                 <span>Balance:</span>
                 <span className="text-white font-medium">
                   {balance ? `${Number(formatEther(balance.value)).toFixed(4)} ${balance.symbol}` : '...'}
                 </span>
               </div>
            </div>

            <DropdownMenuSeparator className="bg-white/10" />
            
            <DropdownMenuLabel className="flex justify-between items-center">
              <span>My Smart Wallets</span>
              {smartWallets.length > 0 && (
                <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">
                  {smartWallets.length} Active
                </span>
              )}
            </DropdownMenuLabel>

            {/* List Smart Wallets */}
            {smartWallets.length > 0 ? (
              smartWallets.map((wallet) => (
                <div key={wallet.id} className="p-2 hover:bg-white/5 mx-1 rounded cursor-default group">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-sm text-blue-300">{wallet.name}</div>
                      <div className="text-xs text-gray-500 font-mono">{wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}</div>
                    </div>
                    {/* ปุ่ม Action สำหรับแต่ละกระเป๋า */}
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.preventDefault();
                        handleTestTransaction(wallet);
                      }}
                      disabled={isSending}
                    >
                      {isSending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                    </Button>
                  </div>
                  {/* Show Mock Balance */}
                  <div className="text-xs text-gray-400 mt-1 flex gap-2">
                     <span>MEE: {wallet.balance.tokens['MEE'] || '0'}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">
                No smart wallets found.
              </div>
            )}

            <DropdownMenuItem 
              onClick={(e) => {
                e.preventDefault();
                handleCreateSmartWallet();
              }} 
              className="text-blue-400 focus:text-blue-300 cursor-pointer justify-center font-medium mt-1"
              disabled={isCreatingWallet}
            >
              {isCreatingWallet ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Create New Vault
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-white/10" />
            
            <DropdownMenuItem onClick={() => disconnect()} className="text-red-400 focus:text-red-300 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // State: ยังไม่ Connect
  return (
    <Button 
      onClick={() => connect({ connector: injected() })}
      className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg hover:shadow-blue-500/20 transition-all"
    >
      <CreditCard className="mr-2 h-4 w-4" />
      Connect Wallet
    </Button>
  );
}