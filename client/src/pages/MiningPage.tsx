import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Pickaxe, 
  Zap, 
  Coins, 
  Play, 
  Square, 
  RefreshCw,
  AlertTriangle 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import XPBar from "@/components/XPBar";
import LevelUpModal from "@/components/LevelUpModal";

const MiningPage: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { toast } = useToast();
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [previousLevel, setPreviousLevel] = useState<number | null>(null);
  const [isMining, setIsMining] = useState(false);
  const [localEnergy, setLocalEnergy] = useState(100);
  const [localTokens, setLocalTokens] = useState(0);
  const [sessionEarned, setSessionEarned] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { data: profile, isLoading } = useQuery<any>({
    queryKey: ["/api/profiles", address],
    enabled: !!isConnected,
  });

  useEffect(() => {
    if (profile) {
      if (!isMining) {
        setLocalEnergy(profile.energy ?? 100);
        setLocalTokens(parseFloat(profile.tokens ?? "0"));
      }
    }
  }, [profile, isMining]);

  useEffect(() => {
    if (profile?.level) {
      if (previousLevel !== null && profile.level > previousLevel) {
        setShowLevelUp(true);
        // playSound('/levelup.mp3'); // ถ้ามีเสียงใส่ตรงนี้
      }
      setPreviousLevel(profile.level);
    }
  }, [profile?.level]);

  const syncMutation = useMutation({
    mutationFn: async (vars: { energy: number; tokens: string }) => {
      const res = await apiRequest("POST", "/api/mining/sync", {
        walletAddress: address,
        energySpent: 0, // ส่งค่ารวมไปเลย หรือจะส่งส่วนต่างก็ได้ตาม logic ของ routes.ts
        energy: vars.energy,
        tokens: vars.tokens
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profiles", address] });
      toast({
        title: "Sync Successful",
        description: "บันทึกข้อมูลการขุดลงระบบเรียบร้อยแล้ว",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Sync Failed",
        description: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ ข้อมูลอาจไม่ถูกบันทึก",
      });
    }
  });

  const startMining = () => {
    if (localEnergy <= 0) {
      toast({ variant: "destructive", title: "Energy Depleted", description: "พลังงานหมดแล้ว โปรดรอการฟื้นฟู" });
      return;
    }
    setIsMining(true);
    
    timerRef.current = setInterval(() => {
      setLocalEnergy((prev) => {
        if (prev <= 0) {
          stopMining();
          return 0;
        }
        return prev - 1; // ลดพลังงานทีละ 1 ทุกๆ ช่วงเวลา
      });

      const gain = Math.random() * 0.5; // สุ่มเหรียญที่ได้
      setLocalTokens((prev) => prev + gain);
      setSessionEarned((prev) => prev + gain);
    }, 2000); // ขุดทุกๆ 2 วินาที
  };

  const stopMining = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsMining(false);
    syncMutation.mutate({
      energy: localEnergy,
      tokens: localTokens.toString()
    });
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-gray-500">
        <AlertTriangle size={48} className="mb-4 text-yellow-500" />
        <p className="text-xl font-bold">โปรดเชื่อมต่อ Wallet เพื่อเข้าถึงเหมือง</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Pickaxe className="text-blue-500" size={32} /> MEE MINING CORE
          </h1>
          <p className="text-gray-400">ขุดเหรียญ MEE ด้วยพลังงานจาก MeeBot ของคุณ</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Status</p>
          <p className={`font-bold ${isMining ? 'text-green-400 animate-pulse' : 'text-gray-500'}`}>
            {isMining ? '● ACTIVE MINING' : '○ STANDBY'}
          </p>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-3xl backdrop-blur-md relative overflow-hidden">
          <Zap className="absolute -right-4 -top-4 text-yellow-500/10" size={120} />
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Energy Remaining</p>
          <h2 className="text-5xl font-black text-white mt-2">{localEnergy}%</h2>
          <div className="w-full bg-gray-800 h-3 mt-4 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${localEnergy < 20 ? 'bg-red-500' : 'bg-yellow-400'}`}
              style={{ width: `${localEnergy}%` }}
            />
          </div>
            {/* ✅ ส่วน XP Bar (ต้องอยู่นอก div ของหลอด Energy) */}
            <div className="mt-6 pt-6 border-t border-gray-800">
               <XPBar xp={profile?.xp || 0} level={profile?.level || 1} />
          </div>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-3xl backdrop-blur-md relative overflow-hidden">
          <Coins className="absolute -right-4 -top-4 text-blue-500/10" size={120} />
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Total MEE Earned</p>
          <h2 className="text-5xl font-black text-white mt-2">{localTokens.toFixed(2)}</h2>
          <p className="text-blue-400 text-xs mt-2 font-mono">+{sessionEarned.toFixed(4)} this session</p>
        </div>
      </div>

      {/* Control Center */}
      <div className="bg-blue-600/5 border border-blue-500/20 p-10 rounded-[40px] flex flex-col items-center justify-center text-center space-y-6">
        <div className={`p-8 rounded-full border-4 ${isMining ? 'border-green-500 shadow-[0_0_50px_rgba(34,197,94,0.3)]' : 'border-gray-700'} transition-all duration-500`}>
          <Pickaxe size={64} className={`${isMining ? 'text-green-500 animate-bounce' : 'text-gray-700'}`} />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-white">
            {isMining ? 'ระบบกำลังประมวลผลการขุด...' : 'พร้อมเริ่มการขุดหรือไม่?'}
          </h3>
          <p className="text-gray-500 max-w-sm">
            การขุดจะใช้พลังงาน 1% ทุกๆ 2 วินาที และมอบรางวัลเป็นเหรียญ MEE แบบสุ่ม
          </p>
        </div>

        <button
          onClick={isMining ? stopMining : startMining}
          disabled={syncMutation.isPending || (localEnergy <= 0 && !isMining)}
          className={`flex items-center gap-3 px-12 py-5 rounded-2xl font-black text-lg transition-all transform active:scale-95 ${
            isMining 
            ? 'bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/30' 
            : 'bg-blue-600 text-white shadow-xl shadow-blue-900/40 hover:bg-blue-500'
          }`}
        >
          {syncMutation.isPending ? (
            <RefreshCw className="animate-spin" />
          ) : isMining ? (
            <><Square size={20} fill="currentColor" /> STOP MINING</>
          ) : (
            <><Play size={20} fill="currentColor" /> START CORE</>
          )}
        </button>
      </div>

      {/* Manual Sync Note */}
      <p className="text-center text-gray-600 text-[10px] font-mono">
        DATABASE_VERSION: 2.0.1-STABLE | AUTO_SYNC: ENABLED_ON_STOP
      </p>
    </div>
  );
};

export default MiningPage;
