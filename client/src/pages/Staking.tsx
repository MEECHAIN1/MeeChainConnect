import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Wallet, TrendingUp, Lock, Timer } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Staking() {
  const [amount, setAmount] = useState("");
  const [activeTab, setActiveTab] = useState<"stake" | "unstake">("stake");

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl lg:text-5xl font-display font-bold mb-4">Earn Rewards</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Stake your MEE tokens to secure the network and earn compounded rewards.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Stats Column */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-6 rounded-2xl border-l-4 border-l-primary"
          >
            <div className="flex items-center gap-4 mb-2">
              <div className="p-2 bg-primary/20 rounded-lg text-primary">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-muted-foreground font-medium">Annual APY</span>
            </div>
            <p className="text-3xl font-bold font-display">12.5%</p>
            <p className="text-xs text-muted-foreground mt-1">Dynamic rate based on TVL</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 rounded-2xl border-l-4 border-l-blue-500"
          >
            <div className="flex items-center gap-4 mb-2">
              <div className="p-2 bg-blue-500/20 rounded-lg text-blue-500">
                <Lock className="w-5 h-5" />
              </div>
              <span className="text-muted-foreground font-medium">Total Staked</span>
            </div>
            <p className="text-3xl font-bold font-display">4.2M MEE</p>
            <p className="text-xs text-muted-foreground mt-1">$8.5M USD Value</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 rounded-2xl border-l-4 border-l-green-500"
          >
            <div className="flex items-center gap-4 mb-2">
              <div className="p-2 bg-green-500/20 rounded-lg text-green-500">
                <Timer className="w-5 h-5" />
              </div>
              <span className="text-muted-foreground font-medium">Lock Period</span>
            </div>
            <p className="text-3xl font-bold font-display">14 Days</p>
            <p className="text-xs text-muted-foreground mt-1">Unbonding time</p>
          </motion.div>
        </div>

        {/* Staking Action Card */}
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="glass-card rounded-3xl overflow-hidden border border-white/10">
            <div className="grid grid-cols-2 border-b border-white/10">
              <button
                onClick={() => setActiveTab("stake")}
                className={`p-6 text-center font-bold text-lg transition-colors ${
                  activeTab === "stake" ? "bg-primary/20 text-primary" : "hover:bg-white/5"
                }`}
              >
                Stake
              </button>
              <button
                onClick={() => setActiveTab("unstake")}
                className={`p-6 text-center font-bold text-lg transition-colors ${
                  activeTab === "unstake" ? "bg-primary/20 text-primary" : "hover:bg-white/5"
                }`}
              >
                Unstake
              </button>
            </div>

            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <label className="text-sm font-medium text-muted-foreground">Amount to {activeTab}</label>
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Wallet className="w-3 h-3" /> Balance: 0.00 MEE
                </span>
              </div>

              <div className="relative mb-8">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-20 text-3xl font-display font-bold bg-black/20 border-white/10 pl-6 pr-24 rounded-2xl focus-visible:ring-primary/50"
                />
                <button 
                  className="absolute right-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-white/10 rounded-lg text-xs font-bold hover:bg-white/20 transition-colors"
                  onClick={() => setAmount("100")} // Mock max
                >
                  MAX
                </button>
              </div>

              <div className="flex flex-col gap-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Exchange Rate</span>
                  <span className="font-mono">1 MEE = 1 stMEE</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Estimated Gas</span>
                  <span className="font-mono">0.0004 MEE</span>
                </div>
                <div className="w-full h-px bg-white/10 my-2" />
                <div className="flex justify-between text-base font-bold">
                  <span>You will receive</span>
                  <span className="text-primary">0.00 stMEE</span>
                </div>
              </div>

              <Button size="lg" className="w-full h-14 text-lg rounded-xl font-bold shadow-lg shadow-primary/20">
                {activeTab === "stake" ? "Approve & Stake" : "Withdraw Assets"}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
