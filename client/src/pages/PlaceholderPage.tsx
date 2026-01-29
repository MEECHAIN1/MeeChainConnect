import React from "react";
import { useLocation } from "wouter"; // ใช้ wouter ตามที่ระบุใน package.json
import { Construction, ArrowLeft, Rocket, Sparkles } from "lucide-react";

interface PlaceholderProps {
  title?: string;
}

const PlaceholderPage: React.FC<PlaceholderProps> = ({ title = "กำลังพัฒนาฟีเจอร์ใหม่" }) => {
  const [, setLocation] = useLocation();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
      {/* Visual Element */}
      <div className="relative mb-10">
        {/* Glowing Background Effect */}
        <div className="absolute inset-0 bg-blue-600/20 blur-[100px] rounded-full animate-pulse"></div>
        
        <div className="relative bg-gray-900/80 border border-gray-800 p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
          <div className="relative">
            <Rocket className="w-20 h-20 text-blue-400 animate-bounce" />
            <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400 animate-pulse" />
          </div>
          <div className="absolute -bottom-4 -right-4 bg-yellow-500 p-2 rounded-lg rotate-12 shadow-lg">
            <Construction className="w-6 h-6 text-black" />
          </div>
        </div>
      </div>

      {/* Text Content */}
      <h1 className="text-4xl font-black text-white mb-4 tracking-tight">
        {title}
      </h1>
      <p className="text-gray-400 max-w-lg mb-10 text-lg leading-relaxed">
        ทีมงาน MeeBot กำลังปรับปรุงระบบและเพิ่มความสามารถใหม่ๆ เพื่อให้คุณได้รับประสบการณ์ที่ดีที่สุด 
        โปรดรอติดตามการอัปเดตในเร็วๆ นี้!
      </p>

      {/* Navigation Button */}
      <button
        onClick={() => window.history.back()}
        className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl shadow-blue-900/40"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        กลับไปยังหน้าที่แล้ว
      </button>

      {/* Progress Dots Decoration */}
      <div className="flex gap-2 mt-12">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
        <div className="w-2 h-2 bg-blue-500/60 rounded-full"></div>
        <div className="w-2 h-2 bg-blue-500/30 rounded-full"></div>
      </div>
    </div>
  );
};

export default PlaceholderPage;