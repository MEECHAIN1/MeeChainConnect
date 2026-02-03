import type { IProvider } from "@web3auth/base";
import { createWalletClient, custom, formatEther } from "viem";

// กำหนดค่า Oasis Sapphire Chain ให้ Viem รู้จัก
const oasisSapphire = {
  id: 23294, // 0x5afe
  name: "Oasis Sapphire",
  network: "sapphire",
  nativeCurrency: {
    decimals: 18,
    name: "ROSE",
    symbol: "ROSE",
  },
  rpcUrls: {
    public: { http: ["https://sapphire.oasis.io"] },
    default: { http: ["https://sapphire.oasis.io"] },
  },
  blockExplorers: {
    default: { name: "Oasis Explorer", url: "https://explorer.oasis.io/mainnet/sapphire" },
  },
} as const;

export class RPC {
  private provider: IProvider;

  constructor(provider: IProvider) {
    this.provider = provider;
  }

  // ฟังก์ชันดึง Wallet Address
  async getAccounts(): Promise<string> {
    try {
      const client = createWalletClient({
        chain: oasisSapphire,
        transport: custom(this.provider),
      });

      const addresses = await client.getAddresses();
      return addresses[0];
    } catch (error) {
      console.error("RPC Error (getAccounts):", error);
      return "";
    }
  }

  // ฟังก์ชันดึงยอดเงิน (Balance)
  async getBalance(): Promise<string> {
    try {
      const client = createWalletClient({
        chain: oasisSapphire,
        transport: custom(this.provider),
      });

      const addresses = await client.getAddresses();
      const balance = await client.getBalance({ 
        address: addresses[0] 
      });

      // แปลงหน่วยจาก Wei เป็น Ether (ROSE)
      return formatEther(balance);
    } catch (error) {
      console.error("RPC Error (getBalance):", error);
      return "0";
    }
  }

  // (แถม) ฟังก์ชันสำหรับ Sign Message (เผื่อใช้ในอนาคต)
  async signMessage(message: string): Promise<string> {
    try {
      const client = createWalletClient({
        chain: oasisSapphire,
        transport: custom(this.provider),
      });

      const addresses = await client.getAddresses();
      const signature = await client.signMessage({
        account: addresses[0],
        message: message,
      });

      return signature;
    } catch (error) {
       console.error("RPC Error (signMessage):", error);
       return "";
    }
  }
}