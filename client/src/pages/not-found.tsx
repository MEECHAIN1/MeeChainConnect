import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, ArrowLeft, Home, Ghost } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0c] p-4 relative overflow-hidden">

      {/* Background Decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <Card className="w-full max-w-md bg-gray-900/40 border-gray-800 backdrop-blur-xl border-2 relative z-10 overflow-hidden">
        {/* Neon Top Bar */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />

        <CardContent className="pt-10 pb-10 text-center">
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <Ghost className="h-20 w-20 text-red-500/20 absolute -top-2 -left-2 animate-pulse" />
              <AlertTriangle className="h-16 w-16 text-red-500 relative z-10" />
            </div>
            <h1 className="text-4xl font-black text-white mt-6 tracking-tighter">
              404 <span className="text-red-500">ERROR</span>
            </h1>
            <div className="h-px w-20 bg-gray-800 my-4" />
            <h2 className="text-xl font-bold text-gray-200">SIGNAL LOST IN DEEP SPACE</h2>
          </div>

          <p className="text-sm text-gray-500 leading-relaxed px-4">
            พิกัดที่คุณกำลังตามหาไม่มีอยู่ในฐานข้อมูลของ MeeBot <br/>
            ระบบอาจจะถูกย้าย หรือคุณอาจจะหลุดเข้าไปใน Black Hole ของ Code แล้ว
          </p>

          <div className="mt-10 flex flex-col gap-3 px-6">
            <Link href="/">
              <button className="w-full flex items-center justify-center gap-2 bg-white text-black font-black py-4 rounded-2xl hover:bg-blue-500 hover:text-white transition-all transform active:scale-95 shadow-lg shadow-white/5">
                <Home size={18} />
                BACK TO TERMINAL
              </button>
            </Link>

            <button 
              onClick={() => window.history.back()}
              className="w-full flex items-center justify-center gap-2 bg-gray-800/50 text-gray-400 font-bold py-4 rounded-2xl border border-gray-700 hover:bg-gray-800 hover:text-white transition-all"
            >
              <ArrowLeft size={18} />
              PREVIOUS SECTOR
            </button>
          </div>
        </CardContent>

        {/* Decorative Terminal Text */}
        <div className="p-4 bg-black/40 border-t border-gray-800/50">
          <p className="text-[10px] font-mono text-red-500/50 text-center uppercase tracking-[0.3em]">
            System Error: PAGE_NOT_FOUND_EXCEPTION
          </p>
        </div>
      </Card>
    </div>
  );
}