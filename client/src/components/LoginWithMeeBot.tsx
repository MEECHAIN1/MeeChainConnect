import React, { useState, useEffect } from "react";
import { web3auth } from "@/lib/web3auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";

const LoginWithMeeBot: React.FC = () => {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      try {
        console.log("Web3Auth Status:", web3auth.status);
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
    if (!web3auth) {
      toast({ title: "Error", description: "Web3Auth not initialized yet", variant: "destructive" });
      return;
    }
    try {
      setLoading(true);
      
      if (!web3auth.connected) {
        await web3auth.connect();
      }

      const user = await web3auth.getUserInfo();
      setUserInfo(user);

      toast({
        title: "Welcome to MeeChain!",
        description: `สวัสดีคุณ ${user.name || "User"} การเข้าสู่ระบบสำเร็จ!`,
      });
      
      // Redirect to dashboard after successful login
      setLocation("/dashboard");
    } catch (error) {
      console.error(error);
      toast({ title: "Login Failed", description: "การเข้าสู่ระบบถูกยกเลิก", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await web3auth.logout();
      setUserInfo(null);
      toast({ title: "Logged Out", description: "ออกจากระบบเรียบร้อยแล้ว" });
      setLocation("/");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  if (userInfo) {
    return (
      <div className="flex items-center gap-4 bg-gray-300/50 p-2 pr-6 rounded-full border border-green-300/30 backdrop-blur-md">
        <img 
          src={userInfo.profileImage || "https://github.com/shadcn.png"} 
          alt="Profile" 
          className="w-10 h-10 rounded-full border-2 border-green-500"
        />
        <div className="text-left">
          <p className="text-xs text-gray-400 font-bold">LOGGED IN AS</p>
          <p className="text-sm text-white font-bold">{userInfo.name}</p>
        </div>
        <button 
          onClick={logout}
          className="ml-2 text-xs text-red-200 hover:text-red-300 underline"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={login}
      disabled={loading}
      data-testid="button-login-meebot"
      className="group relative px-8 py-4 bg-white text-black rounded-2xl font-black text-lg transition-all transform hover:scale-100 hover:shadow-[0_0_10px_rgba(255,255,255,0.3)] active:scale-50 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 opacity-0 group-hover:opacity-16 transition-opacity" />
      <div className="flex items-center gap-3 relative z-10">
        {loading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <img 
            src="https://images.web3auth.io/web3auth-logo-w.svg" 
            className="w-6 h-6 invert" 
            alt="Web3Auth" 
          />
        )}
        <span>{loading ? "INITIALIZING..." : "LOGIN WITH MEEBOT ID"}</span>
      </div>
    </button>
  );
};

export default LoginWithMeeBot;