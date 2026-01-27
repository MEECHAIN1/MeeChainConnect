import { createPublicClient, http, parseEther, formatEther } from 'viem';
import { ritualChain } from './wagmi'; // หรือไฟล์ config ของคุณ
import { SmartWallet, TransactionRequest, GaslessQuote } from '../types/smartWallet';

// ใช้ Client ที่เราตั้งค่าไว้
const client = createPublicClient({
	chain: ritualChain,
	transport: http()
});

/**
 * WalletManager: ระบบจัดการกระเป๋าอัจฉริยะ (Account Abstraction Interface)
 * รวบรวมฟังก์ชัน Create, List, Send, Gasless, Recover ไว้ในที่เดียว
 */
export class WalletManager {
	private static STORAGE_KEY = 'meechain_wallets_v1';

	// --- 1. Wallet Listing & Management (จาก list.js) ---

	/**
	 * ดึงรายชื่อกระเป๋าทั้งหมดของผู้ใช้
	 */
	static getWallets(userId: string): SmartWallet[] {
		try {
			const data = localStorage.getItem(this.STORAGE_KEY);
			const wallets: SmartWallet[] = data ? JSON.parse(data) : [];
			return wallets.filter(w => w.ownerId === userId);
		} catch (error) {
			console.error('Failed to load wallets', error);
			return [];
		}
	}

	/**
	 * บันทึกกระเป๋าลงใน Local Storage (จำลอง Database)
	 */
	private static saveWallet(wallet: SmartWallet): void {
		const wallets = this.getAllWalletsFromStorage();
		wallets.push(wallet);
		localStorage.setItem(this.STORAGE_KEY, JSON.stringify(wallets));
	}

	private static getAllWalletsFromStorage(): SmartWallet[] {
		const data = localStorage.getItem(this.STORAGE_KEY);
		return data ? JSON.parse(data) : [];
	}

	// --- 2. Creation Logic (จาก aa/create.js) ---

	/**
	 * สร้าง Smart Wallet ใหม่ (Deterministic Address)
	 */
	static async createSmartWallet(
		userId: string, 
		name: string = "Main Vault",
		type: 'main' | 'savings' = 'main'
	): Promise<SmartWallet> {

		// จำลองการคำนวณ Address แบบ CREATE2 (ใน Production ควรใช้ Factory Contract)
		const mockAddress = this.generateDeterministicAddress(userId, Date.now());

		const newWallet: SmartWallet = {
			id: crypto.randomUUID(),
			address: mockAddress,
			name,
			type,
			ownerId: userId,
			isDeployed: false, // ยังไม่ได้ Deploy จริงบนเชน จนกว่าจะมีธุรกรรมแรก
			createdAt: Date.now(),
			balance: {
				native: '0.00',
				tokens: {}
			}
		};

		// มอบรางวัลต้อนรับ (ตามไฟล์ create.js เดิม)
		if (type === 'main') {
			newWallet.balance.tokens['MEE'] = '100'; // Welcome Bonus
		}

		this.saveWallet(newWallet);
		console.log(`[WalletManager] Created ${type} wallet: ${mockAddress}`);

		return newWallet;
	}

	// --- 3. Gasless Logic (จาก aa/gasless.js) ---

	/**
	 * ตรวจสอบสิทธิ์การใช้งานแบบไร้แก๊ส (Paymaster)
	 */
	static async checkGaslessEligibility(walletAddress: string): Promise<GaslessQuote> {
		// Logic จำลอง: ถ้าเป็น VIP หรือทำภารกิจครบ
		// ในที่นี้จำลองว่า User ทุกคนที่มีกระเป๋า Main ได้สิทธิ์วันละ 3 ครั้ง
		const isEligible = true; 

		if (isEligible) {
			return {
				eligible: true,
				sponsorName: "MeeChain Foundation",
				reason: "Welcome Package"
			};
		}

		return { eligible: false, reason: "Daily limit exceeded" };
	}

	// --- 4. Sending Logic (จาก aa/send.js) ---

	/**
	 * ส่งธุรกรรม (รองรับ AA / Paymaster)
	 */
	static async sendTransaction(
		wallet: SmartWallet, 
		tx: TransactionRequest, 
		usePaymaster: boolean = false
	): Promise<string> {
		console.log(`[WalletManager] Preparing UserOp for ${wallet.address}...`);

		if (usePaymaster) {
			const quote = await this.checkGaslessEligibility(wallet.address);
			if (!quote.eligible) {
				throw new Error(`Gasless failed: ${quote.reason}`);
			}
			console.log(`[WalletManager] Paymaster Sponsored by: ${quote.sponsorName}`);
		}

		// จำลองการส่งธุรกรรม (ในของจริงต้องเรียก EntryPoint Contract)
		await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay

		const txHash = `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
		console.log(`[WalletManager] Transaction submitted: ${txHash}`);

		return txHash;
	}

	// --- 5. Recovery Logic (จาก aa/recover.js) ---

	/**
	 * ตั้งค่าการกู้คืนบัญชี
	 */
	static async setupRecovery(walletId: string, method: 'social' | 'biometric'): Promise<boolean> {
		console.log(`[WalletManager] Setting up ${method} recovery for ${walletId}`);
		// จำลองการบันทึกค่าลง Storage
		return true;
	}

	// --- Helpers ---

	private static generateDeterministicAddress(userId: string, salt: number): `0x${string}` {
		// ฟังก์ชันจำลองการสร้าง Address
		const randomHex = Math.floor(Math.random() * 0xffffffffff).toString(16).padEnd(40, '0');
		return `0x${randomHex}` as `0x${string}`;
	}
}