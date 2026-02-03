/**
 * EnhancedWalletUI
 * Complete wallet interface with mission tracking and NFT integration
 */

import React, { useState } from 'react';
import { useEnhancedWallet } from '@/hooks/useEnhancedWallet';
import { 
  ArrowRightIcon,
  ArrowLeftIcon,
  WalletIcon,
  LogInIcon as LogIn, 
  LogOutIcon as LogOut, 
  WalletIcon as Wallet,
  PlusIcon as Plus,
  SendIcon as Send,
  ShieldIcon as Shield,
  ZapIcon as Zap,
  FingerprintIcon as Fingerprint,
  UsersIcon as Users,
  CopyIcon as Copy,
  CheckIcon as Check,
} from '@heroicons/react/24/outline';

interface EnhancedWalletUIProps {
  web3AuthClientId: string;
  onMintSuccess?: (txHash: string) => void;
  onMissionComplete?: (missionId: string, walletAddress: string) => void;
}

export const EnhancedWalletUI: React.FC<EnhancedWalletUIProps> = ({
  web3AuthClientId,
  onMintSuccess,
  onMissionComplete,
}) => {
  const wallet = useEnhancedWallet(web3AuthClientId);
  const [activeTab, setActiveTab] = useState<'wallets' | 'send' | 'recovery' | 'missions'>('wallets');
  const [showCreateWallet, setShowCreateWallet] = useState(false);
  const [newWalletName, setNewWalletName] = useState('');
  const [walletType, setWalletType] = useState<'main' | 'savings' | 'dev'>('main');
  const [sendTo, setSendTo] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [isGasless, setIsGasless] = useState(false);
  const [gaslessQuote, setGaslessQuote] = useState<any>(null);

  // ===== HANDLERS =====

  const handleCreateWallet = async () => {
    try {
      await wallet.createWallet(newWalletName || `Wallet ${wallet.wallets.length + 1}`, walletType);
      setNewWalletName('');
      setShowCreateWallet(false);
    } catch (error) {
      console.error('Create wallet error:', error);
    }
  };

  const handleSendTransaction = async () => {
    try {
      if (!sendTo || !sendAmount) {
        wallet.clearError();
        wallet.error = 'Please fill in all fields';
        return;
      }

      const txHash = isGasless
        ? await wallet.sendGaslessTransaction(sendTo, sendAmount)
        : await wallet.sendTransaction(sendTo, sendAmount);

      onMintSuccess?.(txHash);
      setSendTo('');
      setSendAmount('');
      alert(`✅ Transaction sent: ${txHash}`);
    } catch (error) {
      console.error('Send error:', error);
    }
  };

  const handleCheckGasless = async () => {
    try {
      if (!wallet.activeWallet) return;
      const quote = await wallet.checkGaslessEligibility(wallet.activeWallet.id);
      setGaslessQuote(quote);
    } catch (error) {
      console.error('Gasless check error:', error);
    }
  };

  const handleSetupSocialRecovery = async (email: string) => {
    try {
      if (!wallet.activeWallet) return;
      await wallet.setupSocialRecovery(wallet.activeWallet.id, email);
      alert('✅ Social recovery configured');
    } catch (error) {
      console.error('Social recovery error:', error);
    }
  };

  const handleSetupBiometric = async () => {
    try {
      if (!wallet.activeWallet) return;
      const success = await wallet.setupBiometricRecovery(wallet.activeWallet.id);
      if (success) {
        alert('✅ Biometric recovery enabled');
      } else {
        alert('❌ Biometric not supported on this device');
      }
    } catch (error) {
      console.error('Biometric error:', error);
    }
  };

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // ===== RENDER =====

  if (!wallet.isInitialized) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <Wallet className="w-8 h-8 text-blue-600 mx-auto" />
          </div>
          <p className="text-slate-600">Initializing wallet...</p>
        </div>
      </div>
    );
  }

  if (!wallet.isConnected) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-8 text-center">
        <Wallet className="w-16 h-16 mx-auto mb-4 text-blue-600" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">MeeChain Wallet</h2>
        <p className="text-slate-600 mb-6">
          Secure, modular wallet with Account Abstraction support
        </p>
        <button
          onClick={wallet.login}
          disabled={wallet.isLoading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto transition-colors"
        >
          <LogIn className="w-5 h-5" />
          {wallet.isLoading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
           <WalletIcon className="w-4 h-4" />
            <div>
              <h1 className="text-2xl font-bold">MeeChain Wallet</h1>
              <p className="text-blue-100">{wallet.userEmail}</p>
            </div>
          </div>
          <button
            onClick={wallet.logout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* ACTIVE WALLET DISPLAY */}
        {wallet.activeWallet && (
          <div className="bg-blue-500/20 rounded-lg p-4 border border-blue-400/30">
            <div className="text-sm text-blue-100 mb-2">Active Wallet</div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-lg">{wallet.activeWallet.name}</div>
                <div className="font-mono text-sm text-blue-100 flex items-center gap-2">
                  {truncateAddress(wallet.activeWallet.address)}
                  <button
                    onClick={() => copyAddress(wallet.activeWallet!.address)}
                    className="hover:bg-blue-400/20 p-1 rounded transition-colors"
                  >
                    {copiedAddress === wallet.activeWallet.address ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-blue-100">Balance</div>
                <div className="text-2xl font-bold">{wallet.activeWallet.balance.native} ETH</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ERROR ALERT */}
      {wallet.error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
          <p className="font-semibold">Error</p>
          <p className="text-sm">{wallet.error}</p>
          <button
            onClick={wallet.clearError}
            className="mt-2 text-sm font-semibold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* TABS */}
      <div className="border-b border-slate-200 flex">
        {(['wallets', 'send', 'recovery', 'missions'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 px-6 font-semibold text-center transition-colors ${
              activeTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab === 'wallets' && <Wallet className="w-5 h-5 inline mr-2" />}
            {tab === 'send' && <Send className="w-5 h-5 inline mr-2" />}
            {tab === 'recovery' && <Shield className="w-5 h-5 inline mr-2" />}
            {tab === 'missions' && <Zap className="w-5 h-5 inline mr-2" />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="p-6">
        {/* WALLETS TAB */}
        {activeTab === 'wallets' && (
          <div className="space-y-6">
            {/* WALLET LIST */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4">Your Wallets</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {wallet.wallets.map(w => (
                  <div
                    key={w.id}
                    onClick={() => wallet.selectWallet(w.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      wallet.activeWallet?.id === w.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-slate-900">{w.name}</h3>
                        <span className="text-xs font-semibold text-slate-500 uppercase bg-slate-100 px-2 py-1 rounded">
                          {w.type}
                        </span>
                      </div>
                      {!w.isDeployed && (
                        <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded">
                          Not Deployed
                        </span>
                      )}
                    </div>
                    <p className="font-mono text-xs text-slate-600 break-all mb-2">
                      {truncateAddress(w.address)}
                    </p>
                    <div className="text-sm text-slate-600">
                      Balance: {w.balance.native} ETH
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CREATE WALLET */}
            <div className="bg-slate-50 rounded-lg p-6 border-2 border-dashed border-slate-300">
              {!showCreateWallet ? (
                <button
                  onClick={() => setShowCreateWallet(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Create New Wallet
                </button>
              ) : (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Wallet name (e.g., Savings)"
                    value={newWalletName}
                    onChange={e => setNewWalletName(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <select
                    value={walletType}
                    onChange={e => setWalletType(e.target.value as any)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="main">Main</option>
                    <option value="savings">Savings</option>
                    <option value="dev">Development</option>
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCreateWallet}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => setShowCreateWallet(false)}
                      className="flex-1 bg-slate-300 hover:bg-slate-400 text-slate-900 font-semibold py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SEND TAB */}
        {activeTab === 'send' && (
          <div className="space-y-6 max-w-md">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Recipient Address
              </label>
              <input
                type="text"
                placeholder="0x..."
                value={sendTo}
                onChange={e => setSendTo(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Amount (ETH)
              </label>
              <input
                type="text"
                placeholder="0.1"
                value={sendAmount}
                onChange={e => setSendAmount(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* GASLESS TOGGLE */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isGasless}
                  onChange={e => {
                    setIsGasless(e.target.checked);
                    if (e.target.checked) handleCheckGasless();
                  }}
                  className="w-4 h-4"
                />
                <div>
                  <div className="font-semibold text-slate-900 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    Use Gasless (Sponsored)
                  </div>
                  {gaslessQuote && (
                    <div className="text-xs text-slate-600 mt-1">
                      {gaslessQuote.eligible
                        ? `✅ Sponsored by ${gaslessQuote.sponsorName} (${gaslessQuote.dailyTransactionsRemaining} left today)`
                        : `❌ ${gaslessQuote.reason}`}
                    </div>
                  )}
                </div>
              </label>
            </div>

            <button
              onClick={handleSendTransaction}
              disabled={wallet.isLoading || !sendTo || !sendAmount}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Send className="w-5 h-5" />
              {wallet.isLoading ? 'Processing...' : 'Send Transaction'}
            </button>
          </div>
        )}

        {/* RECOVERY TAB */}
        {activeTab === 'recovery' && wallet.activeWallet && (
          <div className="space-y-6 max-w-md">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="font-semibold text-slate-900 mb-4">Account Recovery</h3>
              <p className="text-sm text-slate-600 mb-4">
                Set up recovery methods to regain access if you lose your keys.
              </p>
            </div>

            {/* SOCIAL RECOVERY */}
            <div className="border border-slate-200 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Social Recovery (Email)
              </h4>
              <input
                type="email"
                placeholder="recovery@email.com"
                onBlur={e => {
                  if (e.target.value) handleSetupSocialRecovery(e.target.value);
                }}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
              <p className="text-xs text-slate-500 mt-2">
                We'll help you recover your account via email verification
              </p>
            </div>

            {/* BIOMETRIC RECOVERY */}
            <div className="border border-slate-200 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-blue-600" />
                Biometric Recovery
              </h4>
              <button
                onClick={handleSetupBiometric}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
              >
                {wallet.activeWallet.recoveryConfig?.biometricEnabled
                  ? '✓ Enabled'
                  : 'Enable Biometric'}
              </button>
              <p className="text-xs text-slate-500 mt-2">
                Use your fingerprint or face ID for quick recovery
              </p>
            </div>

            {/* GUARDIAN RECOVERY */}
            <div className="border border-slate-200 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Guardian Recovery
              </h4>
              <p className="text-sm text-slate-600 mb-3">
                Add trusted guardians who can help you recover your account
              </p>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition-colors text-sm">
                Add Guardians
              </button>
            </div>
          </div>
        )}

        {/* MISSIONS TAB */}
        {activeTab === 'missions' && (
          <div className="max-w-2xl">
            <div className="bg-amber-50 rounded-lg p-6 border border-amber-200 text-center">
              <Zap className="w-12 h-12 mx-auto mb-4 text-amber-600" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">Complete Missions</h3>
              <p className="text-slate-600">
                Earn rewards and badges by completing quests in the MeeChain ecosystem
              </p>
              <button className="mt-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors">
                View All Missions →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedWalletUI;