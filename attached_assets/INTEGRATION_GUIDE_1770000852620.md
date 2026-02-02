# MeeChain Web3 Wallet Integration Guide

## 📋 Overview

This guide covers the complete integration of:
- **Web3Auth** - Social login and wallet management
- **Account Abstraction (AA)** - Smart wallets with gasless transactions
- **IPFS** - Decentralized metadata storage
- **Smart Contracts** - Mission tracking and NFT management
- **Modular Architecture** - Easy to extend and customize

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     MeeChain DApp                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           EnhancedWalletUI (React Component)           │ │
│  │  - Wallet management interface                         │ │
│  │  - Transaction sending (gasless support)               │ │
│  │  - Recovery setup (social, biometric, guardian)        │ │
│  │  - Mission tracking                                    │ │
│  └────────────────────────────────────────────────────────┘ │
│                              △                                │
│                              │                                │
│  ┌────────────────────────────────────────────────────────┐ │
│  │        useEnhancedWallet (React Hook)                  │ │
│  │  - State management                                    │ │
│  │  - Web3Auth integration                                │ │
│  │  - Action handlers                                     │ │
│  └────────────────────────────────────────────────────────┘ │
│                              △                                │
│                              │                                │
│  ┌────────────────────────────────────────────────────────┐ │
│  │    EnhancedWalletManager (Core Business Logic)        │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  Wallet Lifecycle Management                     │ │ │
│  │  │  - Create smart wallets (CREATE2)                │ │ │
│  │  │  - List/update wallets                           │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  Account Abstraction (AA)                        │ │ │
│  │  │  - UserOp creation & signing                     │ │ │
│  │  │  - EntryPoint interaction                        │ │ │
│  │  │  - Bundler submission                           │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  Gasless & Paymaster                            │ │ │
│  │  │  - Eligibility checking                          │ │ │
│  │  │  - Paymaster data encoding                       │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  Recovery Mechanisms                             │ │ │
│  │  │  - Social recovery (email)                       │ │ │
│  │  │  - Biometric (WebAuthn)                          │ │ │
│  │  │  - Guardian-based                                │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  IPFS & Metadata                                 │ │ │
│  │  │  - Upload metadata                               │ │ │
│  │  │  - Retrieve from IPFS                            │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  NFT & Mission Integration                       │ │ │
│  │  │  - Verify NFT holdings                           │ │ │
│  │  │  - Prepare mint metadata                         │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  Storage Management                              │ │ │
│  │  │  - LocalStorage persistence                      │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
│                              △                                │
│                              │                                │
│  ┌────────────────────────────────────────────────────────┐ │
│  │   MissionAndNFTSmartContracts (Blockchain Interaction) │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  MissionTracker                                  │ │ │
│  │  │  - Complete missions                             │ │ │
│  │  │  - Verify completion                             │ │ │
│  │  │  - Distribute rewards                            │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  NFTManager                                      │ │ │
│  │  │  - Mint NFTs                                     │ │ │
│  │  │  - Evolve NFTs                                   │ │ │
│  │  │  - Check balances                                │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  BadgeSystem                                     │ │ │
│  │  │  - Award badges                                  │ │ │
│  │  │  - Retrieve user badges                          │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  IntegratedMissionSystem                         │ │ │
│  │  │  - Full mission completion flow                  │ │ │
│  │  │  - User profile & status                         │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
│                              △                                │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────┐  ┌──────────────────────────────┐ │
│  │    Blockchain       │  │   External Services         │ │
│  │  - EntryPoint       │  │  - Web3Auth                  │ │
│  │  - Factories        │  │  - Pinata (IPFS)             │ │
│  │  - Paymasters       │  │  - Bundler Service           │ │
│  │  - Contracts        │  │                              │ │
│  └─────────────────────┘  └──────────────────────────────┘ │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### 1. Installation

```bash
npm install @web3auth/modal ethers pinata lucide-react
```

### 2. Setup Environment Variables

```env
# .env.local
VITE_WEB3AUTH_CLIENT_ID=your_web3auth_client_id
VITE_PINATA_JWT=your_pinata_jwt
VITE_MISSION_TRACKER_ADDRESS=0x...
VITE_NFT_MANAGER_ADDRESS=0x...
VITE_BADGE_SYSTEM_ADDRESS=0x...
```

### 3. Basic Component Setup

```tsx
import { EnhancedWalletUI } from './EnhancedWalletUI';

export function App() {
  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <EnhancedWalletUI
        web3AuthClientId={import.meta.env.VITE_WEB3AUTH_CLIENT_ID}
        onMintSuccess={(txHash) => {
          console.log('NFT minted:', txHash);
        }}
        onMissionComplete={(missionId, walletAddress) => {
          console.log(`Mission ${missionId} completed by ${walletAddress}`);
        }}
      />
    </div>
  );
}
```

---

## 💼 Wallet Management

### Creating a Smart Wallet

```typescript
const wallet = useEnhancedWallet(web3AuthClientId);

// Create a new wallet
const newWallet = await wallet.createWallet('My Savings', 'savings');
console.log('Created wallet:', newWallet.address);
```

### Selecting Active Wallet

```typescript
wallet.selectWallet(walletId);
```

### Renaming a Wallet

```typescript
await wallet.renameWallet(walletId, 'New Name');
```

---

## 💸 Sending Transactions

### Regular Transaction

```typescript
const txHash = await wallet.sendTransaction(
  '0xrecipient...',
  '0.1' // ETH amount
);
```

### Gasless Transaction

```typescript
// Check eligibility first
const quote = await wallet.checkGaslessEligibility(walletId);

if (quote.eligible) {
  const txHash = await wallet.sendGaslessTransaction(
    '0xrecipient...',
    '0.1'
  );
  console.log(`✅ Gasless tx sent! ${quote.dailyTransactionsRemaining} left today`);
}
```

### Custom Transaction (AA)

```typescript
// Using UserOperation directly
const userOp = await walletManager.createUserOperation(
  walletAddress,
  {
    to: '0x...',
    value: '1000000000000000000',
    data: '0x',
  },
  usePaymaster
);

const txHash = await walletManager.sendTransaction(walletId, txRequest);
```

---

## 🔐 Account Recovery

### Social Recovery (Email)

```typescript
await wallet.setupSocialRecovery(
  walletId,
  'user@example.com'
);

// User can later recover by verifying email
```

### Biometric Recovery

```typescript
const success = await wallet.setupBiometricRecovery(walletId);

if (success) {
  console.log('Biometric recovery enabled');
} else {
  console.log('Biometric not supported');
}
```

### Guardian-Based Recovery

```typescript
await wallet.setupGuardianRecovery(
  walletId,
  '0xprimary_guardian...',
  [
    '0xbackup_guardian_1...',
    '0xbackup_guardian_2...',
  ]
);
```

---

## 🎮 Mission & NFT Integration

### Complete a Mission

```typescript
const missionSystem = createMissionSystem(provider, signer);

const result = await missionSystem.completeMissionFull(
  'mission_001',
  'proof_data',
  userAddress,
  '100', // reward tokens
  1 // badge ID
);

console.log('Mission completed:', result);
// {
//   missionTx: '0x...',
//   rewardTx: '0x...',
//   badgeTx: '0x...'
// }
```

### Check Mission Status

```typescript
const status = await missionSystem.getUserMissionStatus(
  userAddress,
  ['mission_001', 'mission_002', 'mission_003']
);

Object.entries(status).forEach(([missionId, { completed, metadata }]) => {
  console.log(`${missionId}:`, completed ? '✅ Done' : '⏳ In Progress');
  console.log(`  Name: ${metadata?.name}`);
  console.log(`  Reward: ${metadata?.rewardTokens} tokens`);
});
```

### Get User Profile

```typescript
const profile = await missionSystem.getUserProfile(userAddress);

console.log('Profile:', {
  address: profile.address,
  nftBalance: profile.nftBalance,
  badges: profile.badgeCount,
  badgeList: profile.badges,
});
```

### Mint NFT

```typescript
const nftManager = new NFTManager(provider, signer);

const { tokenId, txHash } = await nftManager.mintNFT(
  userAddress,
  'ipfs://QmXxxx...' // metadata URI
);

console.log(`NFT #${tokenId} minted in ${txHash}`);
```

### Evolve NFT

```typescript
const txHash = await nftManager.evolveNFT(
  '1', // token ID
  'ipfs://QmNew...' // new metadata URI
);

console.log('NFT evolved:', txHash);
```

---

## 🌐 IPFS Integration

### Upload Metadata

```typescript
const metadata = {
  name: 'MeeBot #001',
  description: 'A joyful digital creature',
  image: 'data:image/png;base64,...',
  attributes: [
    { trait_type: 'Mood', value: 'Joyful' },
    { trait_type: 'Energy', value: '85' },
  ],
};

const ipfsUri = await walletManager.uploadMetadataToIPFS(metadata);
console.log('Metadata uploaded:', ipfsUri); // ipfs://QmXxxx...
```

### Retrieve Metadata

```typescript
const metadata = await walletManager.fetchMetadataFromIPFS('QmXxxx...');
console.log('Retrieved:', metadata);
```

---

## 📊 Multi-Chain Support

### Supported Networks

- Oasis Sapphire (Primary)
- Ethereum Mainnet
- Polygon
- Arbitrum One
- Sepolia Testnet

### Switch Networks

```typescript
await wallet.switchNetwork(137); // Switch to Polygon

console.log('Chain ID:', wallet.chainId);
console.log('Is correct network:', wallet.isCorrectNetwork);
```

---

## 🔧 Advanced Usage

### Custom Wallet Types

```typescript
// Create a development wallet for testing
const devWallet = await wallet.createWallet(
  'Dev Testing',
  'dev'
);

// Create a savings wallet with higher security
const savingsWallet = await wallet.createWallet(
  'Long-term Savings',
  'savings'
);
```

### Batch Operations

```typescript
// Complete multiple missions at once
const missions = ['mission_001', 'mission_002', 'mission_003'];

const completions = await Promise.all(
  missions.map(id =>
    missionSystem.completeMissionFull(
      id,
      'proof',
      userAddress,
      '50',
      undefined
    )
  )
);

console.log('Completed', completions.length, 'missions');
```

### Recovery Scenarios

```typescript
// Setup comprehensive recovery strategy
await wallet.setupSocialRecovery(walletId, 'backup@email.com');
await wallet.setupBiometricRecovery(walletId);
await wallet.setupGuardianRecovery(
  walletId,
  '0xtrustworthy_friend...',
  ['0xtrusted_family_1...', '0xtrusted_family_2...']
);

console.log('✅ Multi-layered recovery configured');
```

---

## 🚨 Error Handling

```typescript
try {
  const txHash = await wallet.sendGaslessTransaction(to, amount);
} catch (error) {
  if (error.message.includes('Not eligible')) {
    console.log('User has used up daily gasless quota');
  } else if (error.message.includes('Invalid address')) {
    console.log('Invalid recipient address');
  } else {
    console.log('Transaction failed:', error.message);
  }

  wallet.clearError();
}
```

---

## 📈 Performance Optimization

### Lazy Loading

```typescript
// Wallets are loaded on-demand
const wallet = useEnhancedWallet(clientId);

// Wait for initialization
if (!wallet.isInitialized) {
  return <LoadingSpinner />;
}
```

### Batch Fetching

```typescript
// Fetch all mission statuses at once
const statuses = await Promise.all(
  missionIds.map(id => missionSystem.getMissionMetadata(id))
);
```

---

## 🧪 Testing

### Mock Setup

```typescript
import { EnhancedWalletManager } from './EnhancedWalletManager';

// Create in-memory instance for testing
const mockManager = EnhancedWalletManager.getInstance();
mockManager.clearStorage();

// Create test wallet
const testWallet = await mockManager.createSmartWallet(
  'test_user@example.com',
  'Test Wallet',
  'main'
);

expect(testWallet.address).toBeDefined();
expect(testWallet.balance.native).toBe('0');
```

---

## 🔒 Security Best Practices

1. **Never expose private keys** - Web3Auth handles key management
2. **Use recovery mechanisms** - Set up multiple recovery options
3. **Verify contract addresses** - Always verify mainnet contract addresses
4. **Rate limit transactions** - Use gasless eligibility for abuse prevention
5. **Validate on-chain** - Always verify actions on-chain before UI updates

---

## 🆘 Troubleshooting

### "Biometric not supported"

Ensure browser supports WebAuthn API. Not supported in:
- Older browsers (IE, old Firefox)
- Incognito/private windows on some browsers

### "IPFS fetch timeout"

Try alternative gateways:
```typescript
const gateways = [
  'https://gateway.pinata.cloud/ipfs/',
  'https://ipfs.io/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
];
```

### "Network mismatch"

User is on a different network than expected. Call `switchNetwork()` to prompt switch.

---

## 📚 API Reference

### EnhancedWalletManager

```typescript
// Singleton instance
const manager = EnhancedWalletManager.getInstance();

// Wallet Management
manager.createSmartWallet(userId, name, type)
manager.getWallets(userId)
manager.getWallet(walletId)
manager.updateWallet(walletId, updates)

// Transactions
manager.createUserOperation(address, tx, usePaymaster)
manager.sendTransaction(walletId, tx, usePaymaster)

// Gasless
manager.checkGaslessEligibility(address)

// Recovery
manager.setupSocialRecovery(walletId, email)
manager.setupBiometricRecovery(walletId)
manager.setupGuardianRecovery(walletId, primary, backups)

// IPFS
manager.uploadMetadataToIPFS(metadata)
manager.fetchMetadataFromIPFS(cid)
manager.prepareMintMetadata(name, desc, image, attrs)

// Verification
manager.verifyNFTHolding(address, contract, tokenIds)

// Storage
manager.clearStorage()
```

### useEnhancedWallet Hook

```typescript
const {
  // State
  isInitialized,
  isConnected,
  isLoading,
  user,
  userEmail,
  wallets,
  activeWallet,
  provider,
  signer,
  chainId,
  isCorrectNetwork,
  error,
  
  // Actions
  login(),
  logout(),
  createWallet(name, type),
  selectWallet(id),
  renameWallet(id, name),
  sendTransaction(to, value),
  sendGaslessTransaction(to, value),
  checkGaslessEligibility(id),
  setupSocialRecovery(id, email),
  setupBiometricRecovery(id),
  setupGuardianRecovery(id, primary, backups),
  switchNetwork(chainId),
  clearError(),
} = useEnhancedWallet(clientId);
```

---

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review example code
3. Check smart contract ABIs
4. Contact MeeChain team

---

## 📄 License

Part of MeeChain Protocol - All Rights Reserved

---

**Last Updated:** February 2026
**Version:** 2.0.0
