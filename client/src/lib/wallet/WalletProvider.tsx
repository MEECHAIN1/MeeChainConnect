import React, { createContext, useContext } from 'react';
import { useEnhancedWallet, UseEnhancedWalletReturn } from '@/hooks/useEnhancedWallet';

// Client ID ตัวเดิมของคุณ
const CLIENT_ID = "BJKP4aMOeucmV3PQrx_ET9CALg81jN-Er3qfuDekG9gt5h0oNtM9iDNL4fE6k8CkYoq5JJYBxt2VX_sz8HW4Vi4";

const WalletContext = createContext<UseEnhancedWalletReturn | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  // เรียกใช้ Hook ที่นี่จุดเดียว เพื่อให้เป็นสมองกลาง
  const wallet = useEnhancedWallet(CLIENT_ID);

  return (
    <WalletContext.Provider value={wallet}>
      {children}
    </WalletContext.Provider>
  );
}

// สร้าง Hook ใหม่สำหรับดึงข้อมูลจากสมองกลาง
export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWalletContext must be used within a WalletProvider");
  }
  return context;
};