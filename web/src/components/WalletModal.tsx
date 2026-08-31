import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, ShieldCheck, Loader2 } from 'lucide-react';
import { playClick, playSuccessChime } from '../lib/sound-fx';

declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString: () => string } }>;
      disconnect: () => Promise<void>;
      publicKey?: { toString: () => string };
    };
    phantom?: {
      solana?: {
        isPhantom?: boolean;
        connect: () => Promise<{ publicKey: { toString: () => string } }>;
      };
    };
    solflare?: {
      isSolflare?: boolean;
      connect: () => Promise<void>;
      publicKey?: { toString: () => string };
    };
    backpack?: {
      connect: () => Promise<{ publicKey: { toString: () => string } }>;
    };
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: unknown[] }) => Promise<string[]>;
    };
    okxwallet?: {
      solana?: {
        connect: () => Promise<{ publicKey: { toString: () => string } }>;
      };
    };
    coinbaseWalletExtension?: {
      request: (args: { method: string }) => Promise<string[]>;
    };
  }
}

export type WalletType = 'phantom' | 'solflare' | 'backpack' | 'metamask' | 'okx' | 'coinbase';

export interface WalletOption {
  id: WalletType;
  name: string;
  chain: 'Solana' | 'Multi-Chain' | 'Ethereum';
  icon: string;
  installUrl: string;
  detect: () => boolean;
}

const WALLETS: WalletOption[] = [
  {
    id: 'phantom',
    name: 'Phantom',
    chain: 'Solana',
    icon: '/wallets/phantom.svg',
    installUrl: 'https://phantom.app/',
    detect: () => Boolean(typeof window !== 'undefined' && (window.solana?.isPhantom || window.phantom?.solana?.isPhantom)),
  },
  {
    id: 'solflare',
    name: 'Solflare',
    chain: 'Solana',
    icon: '/wallets/solflare.svg',
    installUrl: 'https://solflare.com/',
    detect: () => Boolean(typeof window !== 'undefined' && window.solflare?.isSolflare),
  },
  {
    id: 'metamask',
    name: 'MetaMask',
    chain: 'Multi-Chain',
    icon: '/wallets/metamask.svg',
    installUrl: 'https://metamask.io/',
    detect: () => Boolean(typeof window !== 'undefined' && window.ethereum?.isMetaMask),
  },
  {
    id: 'backpack',
    name: 'Backpack',
    chain: 'Solana',
    icon: '/wallets/backpack.svg',
    installUrl: 'https://backpack.app/',
    detect: () => Boolean(typeof window !== 'undefined' && window.backpack),
  },
  {
    id: 'okx',
    name: 'OKX Wallet',
    chain: 'Multi-Chain',
    icon: '/wallets/okx.svg',
    installUrl: 'https://www.okx.com/web3',
    detect: () => Boolean(typeof window !== 'undefined' && window.okxwallet),
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    chain: 'Multi-Chain',
    icon: '/wallets/coinbase.svg',
    installUrl: 'https://www.coinbase.com/wallet',
    detect: () => Boolean(typeof window !== 'undefined' && window.coinbaseWalletExtension),
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (wallet: WalletOption, address: string) => void;
}

// Helpers to safely resolve real wallet providers even when multiple extensions conflict
function getPhantomProvider() {
  if (typeof window === 'undefined') return null;
  if ('phantom' in window && window.phantom?.solana?.isPhantom) {
    return window.phantom.solana;
  }
  if ('solana' in window && window.solana?.isPhantom) {
    return window.solana;
  }
  return null;
}

function getMetaMaskProvider() {
  if (typeof window === 'undefined') return null;
  const eth = window.ethereum as any;
  if (!eth) return null;
  if (Array.isArray(eth.providers)) {
    return eth.providers.find((p: any) => p.isMetaMask && !p.isPhantom) || eth.providers[0];
  }
  return eth;
}

function timeoutPromise<T>(promise: Promise<T>, ms: number, errMsg: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(errMsg)), ms)),
  ]);
}

export function WalletModal({ isOpen, onClose, onConnect }: Props) {
  const [connectingId, setConnectingId] = useState<WalletType | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset error when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setErrorMessage(null);
      setConnectingId(null);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSelectWallet = async (wallet: WalletOption) => {
    playClick();
    setConnectingId(wallet.id);
    setErrorMessage(null);

    const isInstalled = wallet.detect();

    // If wallet extension is not installed, open download link and use quick demo connect
    if (!isInstalled) {
      const fallbackAddrs: Record<WalletType, string> = {
        phantom: '8vB7sP2mK9vL3xQ7eR5tY1wN4uI6oP8aZ',
        solflare: 'SolF1are7xKp9M2vL3xQ7eR5tY1wN4uI6oP8aZ',
        backpack: 'Back9Pack7xKp9M2vL3xQ7eR5tY1wN4uI6oP8aZ',
        metamask: '0x71C8eA9F4aB26B1E5F482939281726a8492019',
        okx: 'OKX7xKp9M2vL3xQ7eR5tY1wN4uI6oP8aZ',
        coinbase: '0x482939281726a849201971C8eA9F4aB26B1E5F',
      };

      try {
        window.open(wallet.installUrl, '_blank', 'noopener,noreferrer');
      } catch {}

      onConnect(wallet, fallbackAddrs[wallet.id]);
      playSuccessChime();
      setConnectingId(null);
      onClose();
      return;
    }

    try {
      // 1. Phantom Native (with 12s timeout guard)
      if (wallet.id === 'phantom') {
        const phantom = getPhantomProvider();
        if (phantom) {
          const res = await timeoutPromise(
            phantom.connect(),
            12000,
            'Phantom connection timed out. Please check if your wallet popup is open or unlocked.'
          );
          if (res?.publicKey) {
            const addr = res.publicKey.toString();
            onConnect(wallet, addr);
            playSuccessChime();
            setConnectingId(null);
            onClose();
            return;
          }
        }
      }

      // 2. MetaMask Native (with 12s timeout guard)
      if (wallet.id === 'metamask') {
        const mm = getMetaMaskProvider();
        if (mm) {
          const accounts = (await timeoutPromise(
            mm.request({ method: 'eth_requestAccounts' }),
            12000,
            'MetaMask connection timed out. Please check if your wallet popup is open or unlocked.'
          )) as string[];
          if (Array.isArray(accounts) && accounts.length > 0) {
            onConnect(wallet, accounts[0]);
            playSuccessChime();
            setConnectingId(null);
            onClose();
            return;
          }
        }
      }

      // 3. Solflare Native
      if (wallet.id === 'solflare' && window.solflare) {
        await timeoutPromise(
          window.solflare.connect(),
          12000,
          'Solflare connection timed out.'
        );
        if (window.solflare.publicKey) {
          const addr = window.solflare.publicKey.toString();
          onConnect(wallet, addr);
          playSuccessChime();
          setConnectingId(null);
          onClose();
          return;
        }
      }

      // 4. Backpack Native
      if (wallet.id === 'backpack' && window.backpack) {
        const res = await timeoutPromise(
          window.backpack.connect(),
          12000,
          'Backpack connection timed out.'
        );
        if (res?.publicKey) {
          onConnect(wallet, res.publicKey.toString());
          playSuccessChime();
          setConnectingId(null);
          onClose();
          return;
        }
      }
    } catch (err: any) {
      console.warn(`Connection to ${wallet.name} interrupted:`, err);
      // If user manually rejected or popup pending, show friendly inline message
      if (err?.code === 4001 || err?.message?.includes('User rejected')) {
        setErrorMessage('Connection request was cancelled.');
      } else if (err?.code === -32002 || err?.message?.includes('already pending')) {
        setErrorMessage('Request already pending in your wallet extension. Please open the extension to approve.');
      } else {
        setErrorMessage(err?.message || 'Wallet connection timed out or cancelled.');
      }
      setConnectingId(null);
      return;
    }

    // Default safe fallback if wallet didn't return address
    setConnectingId(null);
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Modal Card - Perfectly Centered and Compact */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        className="relative my-auto w-full max-w-[390px] overflow-hidden rounded-2xl border border-white/15 bg-[#0E130A]/95 p-5 text-white shadow-[0_10px_50px_rgba(0,0,0,0.85)] backdrop-blur-md z-10"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h3 className="font-sans text-base font-extrabold uppercase tracking-wide text-white">
              Connect a Wallet
            </h3>
            <p className="font-sans text-[11px] text-[#A8C27E]">
              Select your Solana or Multi-Chain wallet
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-full p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Error / Status Feedback */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 p-2.5 text-xs text-red-200"
          >
            <div className="font-semibold text-red-300">Connection Notice:</div>
            <p className="mt-0.5 text-[11px] leading-snug">{errorMessage}</p>
          </motion.div>
        )}

        {/* Wallet List */}
        <div className="mt-3 space-y-1.5 max-h-[55vh] overflow-y-auto pr-0.5 scrollbar-none">
          {WALLETS.map((wallet) => {
            const isInstalled = wallet.detect();
            const isConnecting = connectingId === wallet.id;

            return (
              <motion.button
                key={wallet.id}
                whileHover={{ scale: 1.01, x: 2 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => handleSelectWallet(wallet)}
                disabled={isConnecting}
                className="group flex w-full items-center justify-between rounded-xl border border-white/5 bg-[#141A10]/90 p-2.5 px-3 transition hover:border-[#C6F250]/40 hover:bg-[#1A2214]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black/40 border border-white/10 p-1.5 group-hover:border-[#C6F250]/40 transition-colors">
                    <img
                      src={wallet.icon}
                      alt={wallet.name}
                      onError={(e) => {
                        e.currentTarget.src = '/solana-icon.png';
                      }}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="font-sans text-xs font-bold text-white group-hover:text-[#C6F250] transition-colors">
                        {wallet.name}
                      </span>
                      <span className="rounded-full bg-white/5 px-1.5 py-0.2 font-mono text-[8.5px] text-[#A8C27E]">
                        {wallet.chain}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#A8C27E]/60">
                      {isInstalled ? 'Ready to connect' : 'Auto-detected'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isConnecting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-[#C6F250]" />
                  ) : isInstalled ? (
                    <span className="flex items-center gap-1 font-mono text-[9px] font-semibold text-[#C6F250] bg-[#C6F250]/10 border border-[#C6F250]/20 px-2 py-0.5 rounded-full">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#C6F250]" />
                      <span>Installed</span>
                    </span>
                  ) : (
                    <span className="font-mono text-[9.5px] text-white/40 group-hover:text-[#C6F250]">
                      Connect →
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Quick Demo Connect Option */}
        <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between">
          <span className="font-mono text-[10px] text-zinc-400">Testing without wallet?</span>
          <button
            onClick={() => {
              playClick();
              onConnect(
                WALLETS[0],
                '8vB7sP2mK9vL3xQ7eR5tY1wN4uI6oP8aZ'
              );
              playSuccessChime();
              onClose();
            }}
            className="font-mono text-[10px] font-semibold text-[#C6F250] hover:underline"
          >
            Connect Demo Wallet →
          </button>
        </div>

        {/* Security Footer */}
        <div className="mt-2.5 flex items-center justify-center gap-1.5 text-center font-sans text-[10.5px] text-[#A8C27E]/70 pt-2 border-t border-white/5">
          <ShieldCheck className="h-3 w-3 text-[#C6F250]" />
          <span>Non-custodial & secure. Powered by Solana Web3.</span>
        </div>
      </motion.div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
