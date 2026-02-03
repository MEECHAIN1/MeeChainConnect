import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, User, Copy, Edit2, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useProfile, useUpdateProfile } from "@/hooks/use-profile";
import { useWalletContext } from "@/lib/wallet/WalletProvider";

export default function Profile() {
  const { activeWallet, isConnected } = useWalletContext();
  const address = activeWallet?.address;
  const { mutate: updateProfile, isPending: isSaving } = useUpdateProfile();
  const { toast } = useToast();
  const [bio, setBio] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const { data: profile, isLoading, error } = useProfile(address);

  useEffect(() => {
    if (profile) {
      setBio(profile.bio || "");
    }
  }, [profile]);

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

  // --- ส่วนตรวจสอบสถานะ (Loading / Error) ---

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-400 gap-4">
        <Wallet className="w-12 h-12 text-gray-600" />
        <p>Please login to view profile.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-red-400">Error loading profile</div>;
  }

  // ✅ 2. ลบกำแพงออกแล้ว! แสดง UI สวยๆ ได้เลย
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Banner */}
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
              <h1 className="text-3xl font-display font-bold mb-1 text-white">Miner User</h1>
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
            <Button variant="outline" className="bg-black/40 border-white/10 text-white hover:bg-white/10" onClick={() => setIsEditing(!isEditing)}>
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
            <div className="glass-card p-8 rounded-3xl border border-white/10 bg-gray-900/50 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                <User className="w-5 h-5 text-blue-500" /> About Me
              </h3>

              {isEditing ? (
                <div className="space-y-4">
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="min-h-[150px] bg-white/5 border-white/10 resize-none rounded-xl text-white"
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={isSaving} className="min-w-[120px] bg-blue-600 hover:bg-blue-500 text-white">
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">
                  {profile?.bio || "No bio yet. Click edit to add one!"}
                </p>
              )}
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="space-y-6"
          >
            <div className="glass-card p-6 rounded-3xl border border-white/10 bg-gray-900/50 backdrop-blur-sm">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Total Balance</h3>
              <div className="text-3xl font-display font-bold text-white mb-1">
                {/* ✅ 3. ใช้ข้อมูลจาก Profile แทน Balance เก่า */}
                {parseFloat(profile?.tokens || "0").toLocaleString()} 
                <span className="text-lg text-blue-500 ml-1">ROSE</span>
              </div>
            </div>

             <div className="glass-card p-6 rounded-3xl border border-white/10 bg-gray-900/50 backdrop-blur-sm">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Mining Stats</h3>
              <div className="space-y-3">
                 <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Level</span>
                    <span className="text-yellow-400 font-bold">{profile?.level || 1}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-gray-400">XP</span>
                    <span className="text-purple-400 font-bold">{profile?.xp || 0}</span>
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}