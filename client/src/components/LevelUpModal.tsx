import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Zap, X } from "lucide-react";
import Confetti from "react-confetti"; // ถ้าอยากได้พลุกระดาษ (option) หรือใช้ CSS particle ก็ได้

interface LevelUpModalProps {
  isOpen: boolean;
  newLevel: number;
  onClose: () => void;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ isOpen, newLevel, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 100 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -100 }}
            className="relative w-full max-w-md bg-[#1a1b26] border-2 border-purple-500 rounded-3xl p-8 text-center overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.4)]"
          >
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-purple-500/20 to-transparent pointer-events-none" />

            {/* Icon */}
            <div className="relative z-10 mx-auto w-24 h-24 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-xl border-4 border-[#1a1b26]">
              <Crown size={48} className="text-white animate-bounce" />
            </div>

            {/* Text */}
            <h2 className="relative z-10 text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
              LEVEL UP!
            </h2>
            <p className="relative z-10 text-gray-400 mb-8">
              ยินดีด้วย! คุณก้าวสู่ระดับที่ <span className="text-white font-bold text-xl">{newLevel}</span> แล้ว
            </p>

            {/* Rewards Stats */}
            <div className="relative z-10 bg-black/30 rounded-2xl p-4 border border-purple-500/30 mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Zap className="text-yellow-400" size={24} />
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-500 uppercase font-bold">Max Energy</p>
                  <p className="text-white font-bold">+10 Capacity</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-yellow-400">UPGRADED</p>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={onClose}
              className="relative z-10 w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-bold text-lg hover:brightness-110 transition-all active:scale-95 shadow-lg"
            >
              CLAIM REWARDS
            </button>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LevelUpModal;