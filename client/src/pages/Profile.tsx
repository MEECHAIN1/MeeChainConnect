import { useAccount, useBalance } from "wagmi";
import { useProfile, useUpdateProfile } from "@/hooks/use-profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, Wallet, User, Copy, Edit2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { formatEther } from "viem";
import { motion } from "framer-motion";

export default function Profile() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const { data: profile, isLoading } = useProfile(address);
  const { mutate: updateProfile, isPending: isSaving } = useUpdateProfile();
  const { toast } = useToast();

  const [bio, setBio] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (profile) {
      setBio(profile.bio || "");
    }
  }, [profile]);

  if (!isConnected) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="glass-card p-12 rounded-3xl text-center max-w-md w-full border border-white/10">
          <Wallet className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-50" />
          <h2 className="text-2xl font-bold mb-4">Wallet Not Connected</h2>
          <p className="text-muted-foreground mb-8">
            Please connect your wallet to view and manage your profile.
          </p>
          <div className="animate-pulse bg-white/5 h-12 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleSave = () => {
    if (!address) return;
    updateProfile(
      { walletAddress: address, bio },
      {
        onSuccess: () => {
          setIsEditing(false);
          toast({ title: "Profile updated", description: "Your bio has been saved successfully." });
        },
        onError: (err) => {
          toast({ title: "Error", description: err.message, variant: "destructive" });
        },
      }
    );
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast({ title: "Copied!", description: "Address copied to clipboard" });
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Header / Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-48 md:h-64 rounded-3xl overflow-hidden bg-gradient-to-r from-purple-900 to-indigo-900 mb-20"
      >
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      </motion.div>

      <div className="px-4 md:px-8 -mt-24 relative z-10">
        <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-6 mb-8">
          <div className="flex items-end gap-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-black border-4 border-black overflow-hidden shadow-2xl"
            >
              <img 
                src={`https://api.dicebear.com/7.x/shapes/svg?seed=${address}`} 
                alt="Avatar" 
                className="w-full h-full object-cover bg-white/5"
              />
            </motion.div>
            <div className="pb-2">
              <h1 className="text-3xl font-display font-bold mb-1">Unnamed User</h1>
              <div 
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white cursor-pointer transition-colors"
                onClick={copyAddress}
              >
                <span className="font-mono">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                <Copy className="w-3 h-3" />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="bg-black/40 border-white/10" onClick={() => setIsEditing(!isEditing)}>
              <Edit2 className="w-4 h-4 mr-2" />
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 space-y-8"
          >
            <div className="glass-card p-8 rounded-3xl border border-white/10">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" /> About Me
              </h3>
              
              {isEditing ? (
                <div className="space-y-4">
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="min-h-[150px] bg-white/5 border-white/10 resize-none rounded-xl"
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={isSaving} className="min-w-[120px]">
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {profile?.bio || "No bio yet. Click edit to add one!"}
                </p>
              )}
            </div>

            <div className="glass-card p-8 rounded-3xl border border-white/10">
              <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground bg-white/5 rounded-2xl border border-white/5 border-dashed">
                <p>No recent transactions found.</p>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="space-y-6"
          >
            <div className="glass-card p-6 rounded-3xl border border-white/10">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Wallet Balance</h3>
              <div className="text-3xl font-display font-bold text-white mb-1">
                {balance ? Number(formatEther(balance.value)).toFixed(4) : "0.00"}
                <span className="text-lg text-primary ml-1">{balance?.symbol}</span>
              </div>
              <p className="text-sm text-green-400 font-medium">+2.4% (24h)</p>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-white/10">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">NFT Collection</h3>
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square rounded-xl bg-white/5 animate-pulse" />
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4 text-xs">View All</Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
