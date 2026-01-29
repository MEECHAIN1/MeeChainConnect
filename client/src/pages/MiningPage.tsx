import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, 
  Zap, 
  Pickaxe, 
  Play, 
  Pause, 
  Download, 
  Activity, 
  Terminal 
} from 'lucide-react';
// import { useMeeBot } from '../../contexts/MeeBotContext'; // สมมติว่ามีการใช้ Context นี้
// import { miningService } from '../../services/miningService';

interface MiningLog {
  id: number;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning';
}

const MiningPage: React.FC = () => {
  // --- State Management ---
  const [isMining, setIsMining] = useState(false);
  const [hashRate, setHashRate] = useState(0); // MH/s
  const [pendingRewards, setPendingRewards] = useState(0.0000);
  const [energy, setEnergy] = useState(100);
  const [logs, setLogs] = useState<MiningLog[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // --- Mock Helpers (ฟังก์ชันจำลอง - เดี๋ยวเราเปลี่ยนไปใช้ Service จริง) ---
  const addLog = (message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const newLog = {
      id: Date.now(),
      message,
      timestamp: new Date().toLocaleTimeString(),
      type
    };
    setLogs(prev => [...prev.slice(-4), newLog]); // เก็บแค่ 5 logs ล่าสุด
  };

  const toggleMining = () => {
    if (isMining) {
      // Stop Logic
      setIsMining(false);
      setHashRate(0);
      addLog('Mining sequence stopped.', 'warning');
    } else {
      // Start Logic
      if (energy <= 0) {
        addLog('Not enough energy to start mining!', 'warning');
        return;
      }
      setIsMining(true);
      setHashRate(45.2); // Mock Hashrate
      addLog('Connecting to Mining Pool...', 'info');
      setTimeout(() => addLog('Connected. Hashing started.', 'success'), 800);
    }
  };

  const claimRewards = () => {
    if (pendingRewards <= 0) return;
    addLog(`Claimed ${pendingRewards.toFixed(4)} tokens successfully!`, 'success');
    setPendingRewards(0);
  };

  // --- Effects (Simulation Loop) ---
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isMining && energy > 0) {
      interval = setInterval(() => {
        // จำลองการขุด: เพิ่ม Reward, ลด Energy, ผันผวน Hashrate
        setPendingRewards(prev => prev + 0.0005);
        setEnergy(prev => Math.max(0, prev - 0.5));
        setHashRate(prev => 45 + (Math.random() * 2 - 1)); // ผันผวนเล็กน้อย +/- 1
        
        // ถ้าพลังงานหมด
        if (energy <= 0.5) {
            setIsMining(false);
            setHashRate(0);
            addLog('Energy depleted. Stopping mining.', 'warning');
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isMining, energy]);

  // Scroll logs to bottom
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // --- UI Components ---
  return (
    <div className="p-6 space-y-6 min-h-screen text-gray-100">
      
      {/* Header Section */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent flex items-center gap-3">
            <Pickaxe className="text-blue-400" /> MeeBot Mining Terminal
          </h1>
          <p className="text-gray-400 mt-1">Status: {isMining ? <span className="text-green-400 font-mono animate-pulse">ONLINE</span> : <span className="text-red-400 font-mono">OFFLINE</span>}</p>
        </div>
        
        {/* Claim Button */}
        <button
          onClick={claimRewards}
          disabled={pendingRewards === 0}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
            pendingRewards > 0 
              ? 'bg-yellow-500 hover:bg-yellow-400 text-black shadow-[0_0_15px_rgba(234,179,8,0.5)]' 
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Download size={20} />
          <span>Claim {pendingRewards.toFixed(4)} MEE</span>
        </button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Hashrate Card */}
        <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-2xl backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Cpu size={64} />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <Activity className="text-blue-400" size={20} />
            <h3 className="text-gray-400 text-sm font-medium">Current Hashrate</h3>
          </div>
          <div className="text-3xl font-mono font-bold text-white">
            {hashRate.toFixed(2)} <span className="text-lg text-gray-500">MH/s</span>
          </div>
          <div className="h-1 w-full bg-gray-700 mt-4 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-500" 
              style={{ width: `${(hashRate / 100) * 100}%` }}
            />
          </div>
        </div>

        {/* Energy Card */}
        <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-2xl backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap size={64} />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <Zap className={energy < 20 ? "text-red-500" : "text-yellow-400"} size={20} />
            <h3 className="text-gray-400 text-sm font-medium">Energy Core</h3>
          </div>
          <div className="text-3xl font-mono font-bold text-white">
            {energy.toFixed(1)}%
          </div>
          <div className="h-1 w-full bg-gray-700 mt-4 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${energy < 20 ? 'bg-red-500' : 'bg-yellow-500'}`}
              style={{ width: `${energy}%` }}
            />
          </div>
        </div>

        {/* Pending Rewards Card */}
        <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-2xl backdrop-blur-sm relative overflow-hidden group">
          <div className="flex items-center gap-3 mb-2">
            <Pickaxe className="text-green-400" size={20} />
            <h3 className="text-gray-400 text-sm font-medium">Unclaimed Rewards</h3>
          </div>
          <div className="text-3xl font-mono font-bold text-green-400">
            {pendingRewards.toFixed(6)}
          </div>
          <p className="text-xs text-gray-500 mt-1">Next block in ~12s</p>
        </div>
      </div>

      {/* Main Control & Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        
        {/* Visualizer & Control (Left 2/3) */}
        <div className="lg:col-span-2 bg-gray-900 rounded-2xl border border-gray-800 p-1 relative overflow-hidden flex flex-col items-center justify-center min-h-[300px]">
          {/* Animated Background */}
          {isMining && (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent animate-pulse"></div>
          )}
          
          {/* Central Mining Element */}
          <div className={`relative z-10 w-48 h-48 rounded-full border-4 flex items-center justify-center transition-all duration-500 ${isMining ? 'border-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.5)]' : 'border-gray-700 grayscale'}`}>
            <div className={`absolute inset-0 rounded-full border-t-4 border-blue-400 ${isMining ? 'animate-spin' : 'hidden'}`}></div>
            {/* Replace with actual MeeBot Image later */}
            <div className="w-40 h-40 bg-gray-800 rounded-full flex items-center justify-center">
               <img 
                 src="https://api.dicebear.com/7.x/bottts/svg?seed=MeeBotV2" 
                 alt="MeeBot" 
                 className={`w-32 h-32 transition-transform duration-300 ${isMining ? 'scale-110' : 'scale-100'}`}
               />
            </div>
          </div>

          {/* Toggle Button */}
          <button
            onClick={toggleMining}
            className={`mt-8 flex items-center gap-3 px-8 py-4 rounded-full text-lg font-bold transition-all transform hover:scale-105 active:scale-95 ${
              isMining 
              ? 'bg-red-500/10 text-red-400 border border-red-500/50 hover:bg-red-500/20' 
              : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/30'
            }`}
          >
            {isMining ? (
              <> <Pause fill="currentColor" /> Stop Operation </>
            ) : (
              <> <Play fill="currentColor" /> Start Mining </>
            )}
          </button>
        </div>

        {/* Log Console (Right 1/3) */}
        <div className="bg-black/80 rounded-2xl border border-gray-800 p-4 font-mono text-xs md:text-sm h-[300px] flex flex-col">
          <div className="flex items-center gap-2 text-gray-500 mb-2 border-b border-gray-800 pb-2">
            <Terminal size={14} />
            <span>System Log</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {logs.length === 0 && <span className="text-gray-600 italic">Waiting for command...</span>}
            {logs.map((log) => (
              <div key={log.id} className="flex gap-2">
                <span className="text-gray-600">[{log.timestamp}]</span>
                <span className={`${
                  log.type === 'error' ? 'text-red-400' :
                  log.type === 'success' ? 'text-green-400' :
                  log.type === 'warning' ? 'text-yellow-400' : 'text-blue-300'
                }`}>
                  {log.message}
                </span>
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default MiningPage;
