import React from "react";
import { Link } from "wouter";
import { EnhancedWalletUI } from "@/components/EnhancedWalletUI";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Cpu } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const web3AuthClientId = import.meta.env.VITE_WEB3AUTH_CLIENT_ID;

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white relative overflow-hidden">
      {/* --- Background Effects --- */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 py-12 lg:py-24 relative z-10">
        {/* --- Hero Section with Enhanced Wallet --- */}
        <div className="flex flex-col items-center gap-12 mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
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

            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed font-light">
              The Future of AI x Blockchain. <br/>
              ระบบกระเป๋าเงินอัจฉริยะ พร้อมการกู้คืนบัญชีและค่าแก๊สฟรี
            </p>

            {/* ✅ Integrated Enhanced Wallet UI */}
            <div className="max-w-xl mx-auto">
              <EnhancedWalletUI web3AuthClientId={web3AuthClientId} />
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