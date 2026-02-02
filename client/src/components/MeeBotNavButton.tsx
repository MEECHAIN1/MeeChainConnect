import React from "react";
import { useEnhancedWallet } from "@/hooks/useEnhancedWallet"; // ดึง Hook ตัวเก่งของเรามาใช้
import { Button } from "@/components/ui/button";
import { Loader2, LogOut, Wallet, User } from "lucide-react";

export function MeeBotNavButton() {
  // ดึง Client ID จาก .env (ต้องตรงกับที่ใช้ใน Home)
  const clientId = import.meta.env.VITE_WEB3AUTH_CLIENT_ID;
  const { isConnected, login, logout, userEmail, isLoading, activeWallet } = useEnhancedWallet(clientId);

  if (isLoading) {
    return (
      <Button variant="ghost" size="sm" className="bg-white/5 text-white">
        <Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading...
      </Button>
    );
  }

  // 1. ถ้ายังไม่ล็อกอิน -> โชว์ปุ่ม Login
  if (!isConnected) {
    return (
      <Button 
        onClick={login} 
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-lg border border-white/10"
      >
        <Wallet className="w-4 h-4 mr-2" /> Connect MeeBot
      </Button>
    );
  }

  // 2. ถ้าล็อกอินแล้ว -> โชว์ชื่อ + ปุ่ม Logout
  return (
    <div className="flex items-center gap-3 bg-white/5 p-1 pr-2 rounded-full border border-white/10 backdrop-blur-md">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded-full">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <div className="flex flex-col text-right">
           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Smart Wallet</span>
           <span className="text-xs font-bold text-white max-w-[100px] truncate">
             {userEmail || activeWallet?.address.slice(0, 6) + "..."}
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
