import React from "react";
import { Link } from "wouter";
import LoginWithMeeBot from "@/components/LoginWithMeeBot";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Cpu } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white relative overflow-hidden">

      {/* --- Background Effects --- */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 py-12 lg:py-24 relative z-10">

        {/* --- Hero Section (MeeBot Style) --- */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24 mb-32">

          {/* Left Side: Text & Login */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Powered by Oasis Sapphire
              </div>

              <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-[1.1] mb-6">
                MEE<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">BOT</span>
              </h1>

              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                The Future of AI x Blockchain. <br/>
                เข้าสู่ระบบด้วย Social ID ของคุณและเริ่มขุดเหมืองอัจฉริยะได้ทันที
              </p>

              {/* ✅ ปุ่ม Login + ปุ่มรอง */}
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <div className="w-full sm:w-auto">
                   <LoginWithMeeBot />
                   <p className="text-[10px] text-gray-500 mt-2 text-center lg:text-left">Powered by Web3Auth MPC</p>
                </div>

                <Link href="/marketplace">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto h-[60px] px-8 text-lg rounded-2xl border-gray-700 hover:bg-gray-800 text-gray-300">
                    Explore Market <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Image/Visual */}
          <motion.div 
            className="flex-1 relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full blur-[100px]" />
            <div className="relative z-10 bg-gray-900/40 backdrop-blur-xl p-2 rounded-[40px] border border-white/10 rotate-[-6deg] hover:rotate-0 transition-transform duration-500 shadow-2xl">
              <img 
                src="/logo.jpeg" 
                alt="MeeBot Preview" 
                className="rounded-[32px] w-full object-cover shadow-inner min-h-[300px]"
                onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '<div class="h-64 w-full flex items-center justify-center text-gray-500 font-mono">MeeBot Visualizer Active</div>';
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* --- Stats Grid --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-32">
          {[
            { label: "Active Nodes", value: "1,240+" },
            { label: "Total Mined", value: "4.8M" },
            { label: "Block Time", value: "~2s" },
            { label: "Avg Gas Fee", value: "Gasless" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-gray-900/30 backdrop-blur-md p-6 rounded-3xl text-center border border-white/5 hover:border-blue-500/30 transition-colors"
            >
              <h3 className="text-3xl font-black text-white mb-1">{stat.value}</h3>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* --- Features --- */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Zap className="w-8 h-8 text-yellow-400" />,
              title: "Lightning Fast",
              description: "สัมผัสประสบการณ์การขุดที่รวดเร็วและการทำธุรกรรมที่ลื่นไหลบน Oasis Sapphire"
            },
            {
              icon: <Shield className="w-8 h-8 text-blue-400" />,
              title: "Bank-Grade Security",
              description: "ระบบ Smart Wallet ที่ปลอดภัยระดับสถาบัน พร้อมการกู้คืนบัญชีด้วย Social ID"
            },
            {
              icon: <Cpu className="w-8 h-8 text-purple-400" />,
              title: "AI Powered Core",
              description: "MeeBot AI ช่วยจัดการพลังงานและเพิ่มประสิทธิภาพการขุดให้คุณอัตโนมัติ"
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-gray-900/30 backdrop-blur-md p-8 rounded-3xl hover:bg-gray-800/50 transition-all duration-300 group border border-white/5 hover:border-blue-500/20"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/10">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}