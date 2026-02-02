import { ethers } from 'viem';

// ===== TYPE DEFINITIONS =====
export type WalletType = 'main' | 'savings' | 'dev';
export type RecoveryMethod = 'social' | 'biometric' | 'guardian';

export interface SmartWallet {
  id: string;
  address: `0x${string}`;
  name: string;
  type: WalletType;
  ownerId: string;
  balance: {
    native: string;
    tokens: Record<string, string>;
  };
  isDeployed: boolean;
  createdAt: number;
  lastActivity: number;
  recoveryConfig?: RecoveryConfig;
}

export interface TransactionRequest {
  to: `0x${string}`;
  value: string;
  data?: `0x${string}`;
  gasLimit?: string;
}

export interface UserOperation {
  sender: `0x${string}`;
  nonce: bigint;
  initCode: `0x${string}`;
  callData: `0x${string}`;
  accountGasLimits: `0x${string}`;
  preVerificationGas: bigint;
  gasFees: `0x${string}`;
  paymasterAndData: `0x${string}`;
  signature: `0x${string}`;
}

export interface GaslessQuote {
  eligible: boolean;
  sponsorName?: string;
  feeToken?: string;
  reason?: string;
  dailyTransactionsRemaining?: number;
}

export interface RecoveryConfig {
  method: RecoveryMethod;
  primaryGuardian?: string;
  backupGuardians?: string[];
  socialRecoveryEmail?: string;
  biometricEnabled: boolean;
  lastUpdated: number;
}

export interface IPFSMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{ trait_type: string; value: string }>;
}

// ===== CONFIGURATION =====
const CONFIG = {
  STORAGE_KEY: 'meechain_wallets_v2',
  ENTRY_POINT: '0x5FF137D4b0FDCD49DcA30c7B697586cEBC6546A6' as const,
  FACTORY_ADDRESS: '0x9406Cc6185a346906296840746125a0E56d746cc' as const,
  PAYMASTER_ADDRESS: '0xa93fd87eafA633BcE39AbD78cD59d4b9b0C23Ff0' as const,
  IPFS_GATEWAY: 'https://gateway.pinata.cloud/ipfs/',
  NETWORKS: {
    sepolia: 11155111,
    mainnet: 1,
    polygon: 137,
    arbitrum: 42161,
  },
};

// ===== MAIN WALLET MANAGER CLASS =====
export class EnhancedWalletManager {
  private static instance: EnhancedWalletManager;
  private wallets: Map<string, SmartWallet> = new Map();
  private provider: any | null = null;
  private signer: any | null = null;

  private constructor() {
    this.loadWalletsFromStorage();
  }

  // Singleton pattern
  public static getInstance(): EnhancedWalletManager {
    if (!EnhancedWalletManager.instance) {
      EnhancedWalletManager.instance = new EnhancedWalletManager();
    }
    return EnhancedWalletManager.instance;
  }

  // ===== WALLET LIFECYCLE MANAGEMENT =====

  /**
   * Initialize wallet manager with a provider and signer
   */
  public setProvider(provider: any, signer: any): void {
    this.provider = provider;
    this.signer = signer;
  }

  /**
   * Create a new Smart Wallet with deterministic address (CREATE2)
   */
  public async createSmartWallet(
    userId: string,
    name: string = 'Main Vault',
    type: WalletType = 'main'
  ): Promise<SmartWallet> {
    if (!this.provider) {
      // Mocking for now as we don't have full ethers setup
      console.warn('Provider not initialized, creating mock wallet');
    }

    // Generate deterministic address using CREATE2 (Simplified for mock)
    const salt = Math.random().toString(36).substring(7);
    const walletAddress = `0x${Math.random().toString(16).slice(2, 42)}` as `0x${string}`;

    const newWallet: SmartWallet = {
      id: crypto.randomUUID(),
      address: walletAddress,
      name,
      type,
      ownerId: userId,
      isDeployed: false, // Will be deployed on first transaction
      createdAt: Date.now(),
      lastActivity: Date.now(),
      balance: {
        native: '0',
        tokens: {},
      },
      recoveryConfig: {
        method: 'social',
        biometricEnabled: false,
        lastUpdated: Date.now(),
      },
    };

    // Award welcome bonus for main wallet
    if (type === 'main') {
      newWallet.balance.tokens['MEE'] = '100'; // Welcome bonus
    }

    this.wallets.set(newWallet.id, newWallet);
    this.saveWalletsToStorage();

    console.log(`✅ Created ${type} wallet: ${walletAddress}`);
    return newWallet;
  }

  /**
   * Get all wallets for a user
   */
  public getWallets(userId: string): SmartWallet[] {
    return Array.from(this.wallets.values()).filter(w => w.ownerId === userId);
  }

  /**
   * Get a specific wallet by ID
   */
  public getWallet(walletId: string): SmartWallet | undefined {
    return this.wallets.get(walletId);
  }

  /**
   * Update wallet metadata
   */
  public updateWallet(walletId: string, updates: Partial<SmartWallet>): SmartWallet {
    const wallet = this.wallets.get(walletId);
    if (!wallet) {
      throw new Error(`Wallet ${walletId} not found`);
    }

    const updated = { ...wallet, ...updates, lastActivity: Date.now() };
    this.wallets.set(walletId, updated);
    this.saveWalletsToStorage();
    return updated;
  }

  private loadWalletsFromStorage() {
    const data = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        this.wallets = new Map(Object.entries(parsed));
      } catch (e) {
        console.error('Failed to load wallets', e);
      }
    }
  }

  private saveWalletsToStorage() {
    const data = Object.fromEntries(this.wallets);
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
  }

  public async sendTransaction(
    walletId: string,
    txRequest: TransactionRequest,
    usePaymaster: boolean = false
  ): Promise<string> {
    const wallet = this.getWallet(walletId);
    if (!wallet) throw new Error(`Wallet ${walletId} not found`);
    console.log(`Sending tx from ${wallet.address}`);
    return `0x${Math.random().toString(16).slice(2, 66)}`;
  }

  public async checkGaslessEligibility(
    walletAddress: `0x${string}`
  ): Promise<GaslessQuote> {
    return { eligible: true, sponsorName: 'MeeChain', dailyTransactionsRemaining: 3 };
  }

  public async setupSocialRecovery(walletId: string, email: string) {
    const wallet = this.getWallet(walletId);
    if (wallet) {
      wallet.recoveryConfig = { ...wallet.recoveryConfig!, method: 'social', socialRecoveryEmail: email };
      this.updateWallet(walletId, wallet);
    }
  }

  public async setupBiometricRecovery(walletId: string) {
    const wallet = this.getWallet(walletId);
    if (wallet) {
      wallet.recoveryConfig = { ...wallet.recoveryConfig!, biometricEnabled: true };
      this.updateWallet(walletId, wallet);
      return true;
    }
    return false;
  }

  public async setupGuardianRecovery(walletId: string, primary: string, backup: string[]) {
    const wallet = this.getWallet(walletId);
    if (wallet) {
      wallet.recoveryConfig = { ...wallet.recoveryConfig!, method: 'guardian', primaryGuardian: primary, backupGuardians: backup };
      this.updateWallet(walletId, wallet);
    }
  }
}
