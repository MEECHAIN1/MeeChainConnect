import { useState, useEffect, useCallback, useRef } from 'react';
import { Web3Auth } from '@web3auth/modal';
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from '@web3auth/base';
import { ethers } from 'ethers';
import {
  EnhancedWalletManager,
  SmartWallet,
  TransactionRequest,
  GaslessQuote,
} from '../lib/wallet/EnhancedWalletManager';

export interface UseEnhancedWalletState {
  isInitialized: boolean;
  isConnected: boolean;
  isLoading: boolean;
  user: any | null;
  userEmail: string | null;
  wallets: SmartWallet[];
  activeWallet: SmartWallet | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  chainId: number | null;
  isCorrectNetwork: boolean;
  error: string | null;
}

const SAPPHIRE_CONFIG = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: '0x5afe',
  rpcTarget: 'https://sapphire.oasis.io',
  displayName: 'Oasis Sapphire Mainnet',
  blockExplorer: 'https://explorer.oasis.io/mainnet/sapphire',
  ticker: 'ROSE',
  tickerName: 'ROSE',
};

export function useEnhancedWallet(web3AuthClientId: string) {
  const [state, setState] = useState<UseEnhancedWalletState>({
    isInitialized: false,
    isConnected: false,
    isLoading: true,
    user: null,
    userEmail: null,
    wallets: [],
    activeWallet: null,
    provider: null,
    signer: null,
    chainId: null,
    isCorrectNetwork: false,
    error: null,
  });

  const web3authRef = useRef<Web3Auth | null>(null);
  const walletManagerRef = useRef(EnhancedWalletManager.getInstance());

  useEffect(() => {
    const initWeb3Auth = async () => {
      try {
        const web3auth = new Web3Auth({
          clientId: web3AuthClientId,
          chainConfig: SAPPHIRE_CONFIG,
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
        });

        web3authRef.current = web3auth;
        await web3auth.initModal();

        if (web3auth.connected) {
          await handleConnection(web3auth);
        }

        setState(prev => ({ ...prev, isInitialized: true, isLoading: false }));
      } catch (error) {
        setState(prev => ({ ...prev, isLoading: false, error: 'Init failed' }));
      }
    };
    initWeb3Auth();
  }, [web3AuthClientId]);

  const handleConnection = async (web3auth: Web3Auth) => {
    const provider = new ethers.BrowserProvider(web3auth.provider!);
    const signer = await provider.getSigner();
    const user = await web3auth.getUserInfo();
    
    walletManagerRef.current.setProvider(provider, signer);
    const userId = user.email || signer.address;
    let wallets = walletManagerRef.current.getWallets(userId);
    
    if (wallets.length === 0) {
      const mainWallet = await walletManagerRef.current.createSmartWallet(userId);
      wallets = [mainWallet];
    }

    setState(prev => ({
      ...prev,
      isConnected: true,
      user,
      userEmail: user.email || null,
      provider,
      signer,
      wallets,
      activeWallet: wallets[0],
    }));
  };

  const login = async () => {
    await web3authRef.current?.connect();
    if (web3authRef.current) await handleConnection(web3authRef.current);
  };

  const logout = async () => {
    await web3authRef.current?.logout();
    setState(prev => ({ ...prev, isConnected: false, activeWallet: null }));
  };

  const createWallet = async (name: string, type: any) => {
    const wallet = await walletManagerRef.current.createSmartWallet(state.userEmail!, name, type);
    setState(prev => ({ ...prev, wallets: [...prev.wallets, wallet] }));
    return wallet;
  };

  const selectWallet = (id: string) => {
    const wallet = state.wallets.find(w => w.id === id);
    if (wallet) setState(prev => ({ ...prev, activeWallet: wallet }));
  };

  const sendTransaction = async (to: string, value: string) => {
    if (!state.activeWallet) throw new Error('No wallet');
    return walletManagerRef.current.sendTransaction(state.activeWallet.id, { to: to as any, value });
  };

  const sendGaslessTransaction = async (to: string, value: string) => {
    if (!state.activeWallet) throw new Error('No wallet');
    return walletManagerRef.current.sendTransaction(state.activeWallet.id, { to: to as any, value }, true);
  };

  const checkGaslessEligibility = async (id: string) => {
    const wallet = state.wallets.find(w => w.id === id);
    return walletManagerRef.current.checkGaslessEligibility(wallet!.address);
  };

  const setupSocialRecovery = async (id: string, email: string) => walletManagerRef.current.setupSocialRecovery(id, email);
  const setupBiometricRecovery = async (id: string) => walletManagerRef.current.setupBiometricRecovery(id);
  const setupGuardianRecovery = async (id: string, p: string, b: string[]) => walletManagerRef.current.setupGuardianRecovery(id, p, b);

  return { ...state, login, logout, createWallet, selectWallet, sendTransaction, sendGaslessTransaction, checkGaslessEligibility, setupSocialRecovery, setupBiometricRecovery, setupGuardianRecovery, clearError: () => setState(p => ({ ...p, error: null })) };
}
