import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Layers, Shield, Zap, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12 lg:py-24">
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24 mb-32">
        <div className="flex-1 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Mainnet Live
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-display font-bold leading-[1.1] mb-6">
              The Future of <br />
              <span className="text-gradient">Decentralized</span> Apps
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              MeeChain provides a high-performance, scalable, and secure infrastructure for the next generation of Web3 applications. Connect, stake, and trade with ease.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link href="/marketplace">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-xl">
                  Explore Marketplace <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/staking">
                <Button size="lg" variant="glass" className="w-full sm:w-auto h-14 px-8 text-lg rounded-xl">
                  Start Staking
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="flex-1 relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-blue-500/20 rounded-full blur-[100px]" />
          <div className="relative z-10 glass-card p-2 rounded-3xl border border-white/10 rotate-[-6deg] hover:rotate-0 transition-transform duration-500">
            <img 
              src="/logo.jpeg" 
              alt="Platform Preview" 
              className="rounded-2xl w-full object-cover shadow-2xl"
            />
          </div>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-32">
        {[
          { label: "Total Transactions", value: "2.4M+" },
          { label: "Active Wallets", value: "150k+" },
          { label: "Block Time", value: "~2s" },
          { label: "Avg Gas Fee", value: "<$0.001" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 rounded-2xl text-center border-white/5"
          >
            <h3 className="text-3xl font-display font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            icon: <Zap className="w-8 h-8 text-yellow-400" />,
            title: "Lightning Fast",
            description: "Experience near-instant transaction finality with our optimized consensus mechanism."
          },
          {
            icon: <Shield className="w-8 h-8 text-primary" />,
            title: "Bank-Grade Security",
            description: "Built on battle-tested standards ensuring your assets remain safe and secure."
          },
          {
            icon: <Layers className="w-8 h-8 text-blue-400" />,
            title: "Ecosystem Ready",
            description: "Seamlessly integrate with existing EVM tools, wallets, and dApps you already love."
          }
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-8 rounded-3xl hover:bg-white/5 transition-colors group border-white/5"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/10">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
