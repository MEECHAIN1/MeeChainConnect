import React, { createContext, useContext, ReactNode } from "react";
import { useEnhancedWallet, UseEnhancedWalletReturn } from "@/hooks/useEnhancedWallet";

// ✅ ใส่ Client ID ของคุณที่นี่
const CLIENT_ID = "BMbqZuhP2kuUZ-k8uwOUnPKAFb8LrP8j6NXS1QLFfo-f695HpfwVa9AMrjh5pQQB8ngY6lzKQw-cp3Zm-bATqoA";

// สร้าง Context
const WalletContext = createContext<UseEnhancedWalletReturn | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const wallet = useEnhancedWallet(CLIENT_ID);

  return (
    <WalletContext.Provider value={wallet}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWalletContext must be used within a WalletProvider");
  }
  return context;
};

export default WalletProvider;
