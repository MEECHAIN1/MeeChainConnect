import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { 
  Wallet, 
  Zap, 
  Coins, 
  TrendingUp, 
  ArrowUpRight, 
  Cpu,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import XPBar from "@/components/XPBar";

// จำลองข้อมูลกราฟการขุด (ในอนาคตดึงจาก API)
const miningHistory = [
  { time: "00:00", hash: 30 },
  { time: "04:00", hash: 45 },
  { time: "08:00", hash: 38 },
  { time: "12:00", hash: 55 },
  { time: "16:00", hash: 48 },
  { time: "20:00", hash: 62 },
  { time: "23:59", hash: 58 },
];

const DashboardPage: React.FC = () => {
  const { address, isConnected } = useAccount();

  // ดึงข้อมูล Profile จาก Backend ที่เราเขียนไว้ใน routes.ts
  const { data: profile, isLoading } = useQuery<any>({
    queryKey: ["/api/profiles", address],
    enabled: !!isConnected,
  });

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-700">
      
      {/* Header & Connect Wallet */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">System Dashboard</h1>
          <p className="text-gray-400">ยินดีต้อนรับกลับเข้าสู่ MeeBotV2 Terminal</p>
        </div>
        <ConnectButton />
      </header>

      {!isConnected ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-900/30 border border-dashed border-gray-800 rounded-3xl">
          <Wallet className="w-16 h-16 text-gray-700 mb-4" />
          <h2 className="text-xl font-bold text-gray-500">โปรดเชื่อมต่อ Wallet เพื่อดูข้อมูลระบบ</h2>
        </div>
      ) : (
        <>
          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* MEE Balance */}
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 p-6 rounded-3xl backdrop-blur-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform">
                <Coins size={48} />
              </div>
              <p className="text-blue-400 text-sm font-bold uppercase tracking-widest">MEE Balance</p>
              <h2 className="text-3xl font-black text-white mt-2">
                {isLoading ? "..." : parseFloat(profile?.tokens || "0").toLocaleString()}
              </h2>
              <div className="flex items-center gap-1 text-green-400 text-xs mt-2 font-bold">
                <TrendingUp size={14} /> +12.5% <span className="text-gray-500 font-normal ml-1">from yesterday</span>
              </div>
            </div>

            {/* Energy Core */}
            <div className="bg-gray-800/40 border border-gray-700 p-6 rounded-3xl backdrop-blur-md">
              <div className="flex justify-between items-start">
                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Energy Core</p>
                <Zap className="text-yellow-400" size={18} />
              </div>
              <h2 className="text-3xl font-black text-white mt-2">{profile?.energy || 100}%</h2>
              <div className="w-full bg-gray-700 h-2 mt-4 rounded-full overflow-hidden">
                <div 
                  className="bg-yellow-400 h-full transition-all duration-1000" 
                  style={{ width: `${profile?.energy || 100}%` }}
                />
              </div>
            </div>

            {/* Smart Wallet Status */}
            <div className="bg-gray-800/40 border border-gray-700 p-6 rounded-3xl backdrop-blur-md flex flex-col justify-between">
              <div>
                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Identity Status</p>
                <div className="flex items-center gap-3 mt-3 mb-4">
                  <div className="bg-green-500/10 p-2 rounded-lg">
                    <ShieldCheck className="text-green-400" size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">Verified Persona</h3>
                    <p className="text-[10px] text-gray-500 font-mono">ID: {profile?.username || 'GUEST'}</p>
                  </div>
                </div>
              </div>

              {/* ✅ ใส่ XP Bar ตรงนี้ครับ */}
              <XPBar xp={profile?.xp || 0} level={profile?.level || 1} />
            </div>

            {/* Node Hashrate */}
            <div className="bg-gray-800/40 border border-gray-700 p-6 rounded-3xl backdrop-blur-md">
              <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Current Hashrate</p>
              <h2 className="text-3xl font-black text-white mt-2">45.2 <span className="text-sm text-gray-500 font-normal">MH/s</span></h2>
              <div className="flex items-center gap-2 mt-2 text-blue-400">
                <Cpu size={14} /> <span className="text-[10px] font-mono">Active Nodes: 12</span>
              </div>
            </div>
          </div>

          {/* Mining Activity Chart */}
          <div className="bg-gray-800/20 border border-gray-800 p-6 rounded-3xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp size={20} className="text-blue-500" /> Mining Performance
              </h3>
              <select className="bg-gray-900 border-gray-700 text-xs text-gray-400 rounded-lg px-3 py-1 outline-none">
                <option>Last 24 Hours</option>
                <option>Last 7 Days</option>
              </select>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={miningHistory}>
                  <defs>
                    <linearGradient id="colorHash" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis dataKey="time" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px' }}
                    itemStyle={{ color: '#3b82f6' }}
                  />
                  <Area type="monotone" dataKey="hash" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorHash)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Grid: Quick Actions & Recent Rewards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <div className="bg-gray-900/50 rounded-3xl border border-gray-800 p-6">
              <h3 className="text-white font-bold mb-4">Quick Operations</h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-800 rounded-2xl transition-all group">
                  <span className="text-sm font-medium text-gray-300">เริ่มขุดเหมือง</span>
                  <ArrowUpRight className="text-gray-500 group-hover:text-blue-400 transition-colors" size={18} />
                </button>
                <button className="flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-800 rounded-2xl transition-all group">
                  <span className="text-sm font-medium text-gray-300">คุยกับ AI</span>
                  <ArrowUpRight className="text-gray-500 group-hover:text-purple-400 transition-colors" size={18} />
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-900/50 rounded-3xl border border-gray-800 p-6">
              <h3 className="text-white font-bold mb-4">System Alerts</h3>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-gray-800/30 rounded-2xl border border-gray-800/50">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <Zap size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white font-medium">Daily Reward Claimed</p>
                      <p className="text-[10px] text-gray-500">2 hours ago • Reward: 5.0 MEE</p>
                    </div>
                    <ChevronRight size={16} className="text-gray-600" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
