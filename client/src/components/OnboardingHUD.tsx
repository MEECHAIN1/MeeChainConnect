import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Zap, 
  Wallet, 
  Cpu, 
  Rocket, 
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useAccount } from 'wagmi';

// ประเภทของ Badge
type BadgeType = 'wallet' | 'smart_wallet' | 'tx' | 'gasless' | 'recovery';

interface Badge {
  id: BadgeType;
  label: string;
  desc: string;
  icon: any;
  unlocked: boolean;
  color: string;
}

const OnboardingHUD: React.FC = () => {
  const { isConnected } = useAccount();
  const [activeNotification, setActiveNotification] = useState<Badge | null>(null);
  const [rituals, setRituals] = useState<Badge[]>([
    { id: 'wallet', label: 'Wallet Connected', desc: 'Link to MeeChain established', icon: Wallet, unlocked: false, color: 'text-blue-400' },
    { id: 'smart_wallet', label: 'Smart Wallet Created', desc: 'MeeBot Core initialized', icon: Cpu, unlocked: false, color: 'text-purple-400' },
    { id: 'tx', label: 'Transaction Sent', desc: 'First pulse on Sapphire chain', icon: Rocket, unlocked: false, color: 'text-green-400' },
    { id: 'gasless', label: 'Gasless Enabled', desc: 'Paymaster protocol active', icon: Zap, unlocked: false, color: 'text-yellow-400' },
    { id: 'recovery', label: 'Recovery Configured', desc: 'Guardian security locked', icon: ShieldCheck, unlocked: false, color: 'text-red-400' },
  ]);

  // ฟังก์ชันจำลองการปลดล็อก (คุณสามารถเรียกฟังก์ชันนี้จาก Action จริงได้)
  const unlockBadge = (id: BadgeType) => {
    setRituals(prev => prev.map(r => {
      if (r.id === id && !r.unlocked) {
        const updated = { ...r, unlocked: true };
        setActiveNotification(updated);
        // เล่นเสียง (ถ้าต้องการ) - new Audio('/sounds/unlock.mp3').play();
        setTimeout(() => setActiveNotification(null), 5000); // หายไปหลังจาก 5 วินาที
        return updated;
      }
      return r;
    }));
  };

  // เช็คสถานะการเชื่อมต่อ Wallet จริง
  useEffect(() => {
    if (isConnected) unlockBadge('wallet');
  }, [isConnected]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] p-6 flex flex-col items-end gap-4 overflow-hidden">
      
      {/* 🎖️ Notification Alert (Badge Unlock) */}
      <AnimatePresence>
        {activeNotification && (
          <motion.div
            initial={{ x: 300, opacity: 0, scale: 0.5 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: 100, opacity: 0, filter: 'blur(10px)' }}
            className="bg-black/80 border-2 border-white/20 backdrop-blur-xl p-4 rounded-2xl flex items-center gap-4 shadow-[0_0_30px_rgba(59,130,246,0.3)] relative"
          >
            <div className={`p-3 rounded-xl bg-white/5 ${activeNotification.color}`}>
              <activeNotification.icon size={32} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">New Ritual Completed</p>
              <h3 className="text-lg font-bold text-white leading-tight">{activeNotification.label}</h3>
              <p className="text-xs text-gray-400">{activeNotification.desc}</p>
            </div>
            {/* Scanline Effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-full w-full animate-pulse pointer-events-none rounded-2xl" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 📋 Sidebar Checklist (HUD Style) */}
      <div className="mt-auto bg-gray-900/40 border border-white/5 p-4 rounded-3xl backdrop-blur-md w-64 pointer-events-auto">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 size={16} className="text-blue-500" />
          <span className="text-xs font-black uppercase tracking-widest text-white">Ritual Progress</span>
        </div>
        
        <div className="space-y-3">
          {rituals.map((r) => (
            <div key={r.id} className={`flex items-center gap-3 transition-opacity duration-500 ${r.unlocked ? 'opacity-100' : 'opacity-30'}`}>
              <div className={`p-1.5 rounded-md ${r.unlocked ? 'bg-white/10 ' + r.color : 'bg-gray-800'}`}>
                {r.unlocked ? <r.icon size={14} /> : <Lock size={14} className="text-gray-600" />}
              </div>
              <span className={`text-[11px] font-bold ${r.unlocked ? 'text-gray-200' : 'text-gray-600'}`}>
                {r.label}
              </span>
              {r.unlocked && <motion.div layoutId="check" className="ml-auto text-blue-500"><CheckCircle2 size={12} /></motion.div>}
            </div>
          ))}
        </div>

        {/* HUD Progress Bar */}
        <div className="mt-4 pt-4 border-t border-white/5">
          <div className="flex justify-between text-[10px] font-mono mb-1">
            <span className="text-gray-500">SYNC_STATUS</span>
            <span className="text-blue-400">{(rituals.filter(r => r.unlocked).length / rituals.length * 100).toFixed(0)}%</span>
          </div>
          <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(rituals.filter(r => r.unlocked).length / rituals.length * 100)}%` }}
              className="h-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingHUD;
