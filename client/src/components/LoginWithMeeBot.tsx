import React, { useEffect } from "react";
import useWalletContext from "@/lib/wallet/WalletProvider";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wallet } from "lucide-react";
import { useLocation } from "wouter";

const LoginWithMeeBot = () => {
  // ดึงคำสั่ง login และสถานะมาจาก WalletProvider โดยตรง
  const { login, isLoading, isConnected, error } = useWalletContext();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // ถ้าเชื่อมต่อสำเร็จ ให้พาไปหน้า Dashboard
  useEffect(() => {
    if (isConnected) {
      toast({
        title: "Welcome back!",
        description: "Connected to MeeBot Wallet successfully",
        className: "bg-green-500 text-white border-none",
      });
      setLocation("/dashboard");
    }
  }, [isConnected, setLocation, toast]);

  // ถ้ามี Error จากสมองกลาง ให้แจ้งเตือน
  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: error,
      });
    }
  }, [error, toast]);

  return (
    <button
      onClick={() => login()} // 👉 สั่งงานไปที่สมองกลาง
      disabled={isLoading}
      className="group relative flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-full shadow-lg shadow-blue-500/30 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
    >
      {/* เอฟเฟกต์แสงวิบวับพาดผ่าน */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

      {/* เนื้อหาในปุ่ม */}
      <div className="relative flex items-center gap-3">
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin text-white" />
        ) : (
          <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
             <Wallet size={18} className="text-white" />
          </div>
        )}
        
        <div className="text-left flex flex-col">
          <span className="text-[10px] text-blue-200 uppercase tracking-wider font-bold leading-tight">
            Powered by Web3Auth
          </span>
          <span className="text-sm font-bold leading-tight">
            {isLoading ? "INITIALIZING..." : "Connect w/ MeeBot ID"}
          </span>
        </div>
      </div>
    </button>
  );
};

export default LoginWithMeeBot;