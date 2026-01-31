import React from "react";
import { Crown } from "lucide-react";

interface XPBarProps {
  xp: number;
  level: number;
  className?: string;
}

const XPBar: React.FC<XPBarProps> = ({ xp = 0, level = 1, className }) => {
  // สูตรคำนวณ: XP ที่ต้องใช้ในการอัปเลเวลถัดไป = เลเวลปัจจุบัน * 100
  // เช่น Lv.1 ต้องเก็บ 100 XP, Lv.2 ต้องเก็บ 200 XP
  const xpNeeded = level * 100;
  
  // คำนวณ % ความกว้างของหลอด (ไม่ให้เกิน 100%)
  const progress = Math.min((xp / xpNeeded) * 100, 100);

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Header: Level & XP Text */}
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-2">
          <Crown size={16} className="text-purple-400" />
          <span className="text-sm font-bold text-white">
            Level <span className="text-purple-400 text-lg">{level}</span>
          </span>
        </div>
        <span className="text-[10px] font-mono text-gray-400">
          {xp} / {xpNeeded} XP
        </span>
      </div>

      {/* The Bar */}
      <div className="h-3 w-full bg-gray-900 rounded-full border border-gray-800 overflow-hidden relative">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-purple-900/10" />
        
        {/* Fill Animation */}
        <div 
          className="h-full bg-gradient-to-r from-indigo-600 via-purple-500 to-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all duration-1000 ease-out relative"
          style={{ width: `${progress}%` }}
        >
          {/* Shine Effect */}
          <div className="absolute top-0 right-0 bottom-0 w-[2px] bg-white/50 blur-[2px]" />
        </div>
      </div>
    </div>
  );
};

export default XPBar;
