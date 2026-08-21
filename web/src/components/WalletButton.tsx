import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Copy, ExternalLink, LogOut, ChevronDown, RefreshCw } from 'lucide-react';
import { playClick } from '../lib/sound-fx';
import { WalletModal, WalletOption } from './WalletModal';

export function WalletButton() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string>('');
  const [selectedWallet, setSelectedWallet] = useState<WalletOption | null>(null);
  const [balance, setBalance] = useState<string>('0.00');
  const [usdValue, setUsdValue] = useState<string>('0.00');
  const [symbol, setSymbol] = useState<string>('SOL');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('mousedown', handleOutsideClick);
    return () => window.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Fetch real on-chain balance from MetaMask or Solana RPC
  const fetchBalance = useCallback(async (addr: string) => {
    if (!addr) return;
    setIsRefreshing(true);

    const isEvmAddr = addr.startsWith('0x');
    setSymbol(isEvmAddr ? 'ETH' : 'SOL');

    try {
      if (isEvmAddr && typeof window !== 'undefined' && window.ethereum) {
        // Fetch real balance from MetaMask via RPC
        const hex = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [addr, 'latest'],
        });
        if (typeof hex === 'string') {
          const wei = BigInt(hex);
          // 1 ETH = 10^18 Wei
          const eth = Number(wei) / 1e18;
          const formatted = eth < 0.0001 && eth > 0 ? eth.toFixed(6) : eth.toFixed(4);
          setBalance(formatted);
          // Approximate USD at ~$2,680 / ETH
          setUsdValue((eth * 2680).toFixed(2));
          setIsRefreshing(false);
          return;
        }
      } else if (!isEvmAddr) {
        // Fetch real Solana balance via public RPC
        const res = await fetch('https://api.mainnet-beta.solana.com', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'getBalance',
            params: [addr],
          }),
        });
        const data = await res.json();
        if (data?.result?.value !== undefined) {
          const sol = data.result.value / 1e9;
          const formatted = sol < 0.001 && sol > 0 ? sol.toFixed(4) : sol.toFixed(3);
          setBalance(formatted);
          // Approximate USD at ~$194 / SOL
          setUsdValue((sol * 194.5).toFixed(2));
          setIsRefreshing(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Real on-chain balance fetch notice:', err);
    }

    // Default safe fallback if network is unreachable or demo address
    if (isEvmAddr) {
      setBalance('0.00');
      setUsdValue('0.00');
    } else {
      setBalance('0.00');
      setUsdValue('0.00');
    }
    setIsRefreshing(false);
  }, []);

  // Check if wallet was previously connected
  useEffect(() => {
    const saved = localStorage.getItem('pounce-wallet-connected');
    const savedName = localStorage.getItem('pounce-wallet-name') || 'Phantom';
    const savedChain = (localStorage.getItem('pounce-wallet-chain') || 'Solana') as 'Solana' | 'Multi-Chain' | 'Ethereum';
    const savedIcon = localStorage.getItem('pounce-wallet-icon') || '/wallets/phantom.svg';

    if (saved) {
      setAddress(saved);
      setSelectedWallet({
        id: 'phantom',
        name: savedName,
        chain: savedChain,
        icon: savedIcon,
        installUrl: '',
        detect: () => true,
      });
      setConnected(true);
      fetchBalance(saved);
    }
  }, [fetchBalance]);

  const handleWalletSelected = (wallet: WalletOption, addr: string) => {
    setSelectedWallet(wallet);
    setAddress(addr);
    setConnected(true);
    localStorage.setItem('pounce-wallet-connected', addr);
    localStorage.setItem('pounce-wallet-name', wallet.name);
    localStorage.setItem('pounce-wallet-chain', wallet.chain);
    localStorage.setItem('pounce-wallet-icon', wallet.icon);
    fetchBalance(addr);
  };

  const handleDisconnect = () => {
    playClick();
    setConnected(false);
    setAddress('');
    setSelectedWallet(null);
    setBalance('0.00');
    setUsdValue('0.00');
    setMenuOpen(false);
    localStorage.removeItem('pounce-wallet-connected');
    localStorage.removeItem('pounce-wallet-name');
    localStorage.removeItem('pounce-wallet-chain');
    localStorage.removeItem('pounce-wallet-icon');
  };

  const handleCopy = async () => {
    playClick();
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const isEvm = address.startsWith('0x');
  const shortAddress = address
    ? `${address.slice(0, 4)}...${address.slice(-4)}`
    : '';

  const explorerUrl = isEvm
    ? `https://etherscan.io/address/${address}`
    : `https://solscan.io/account/${address}`;

  return (
    <>
      <div className="relative shrink-0" ref={dropdownRef}>
        {!connected ? (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              playClick();
              setIsModalOpen(true);
            }}
            className="btn-brand-lime flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 text-xs font-bold shadow-[0_0_15px_rgba(198,242,80,0.25)] shrink-0"
          >
            <Wallet className="h-3.5 w-3.5" />
            <span className="sm:hidden">Connect</span>
            <span className="hidden sm:inline">Connect Wallet</span>
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              playClick();
              setMenuOpen((prev) => !prev);
              if (!menuOpen) fetchBalance(address);
            }}
            className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-[#C6F250]/40 bg-[#0B0F07]/90 py-1 sm:py-1.5 px-2 sm:px-3 text-xs font-semibold text-white shadow-[0_0_12px_rgba(198,242,80,0.15)] transition hover:border-[#C6F250] shrink-0"
          >
            {/* Wallet Brand Icon */}
            {selectedWallet?.icon && (
              <img
                src={selectedWallet.icon}
                alt={selectedWallet.name}
                onError={(e) => {
                  e.currentTarget.src = '/solana-icon.png';
                }}
                className="h-3.5 w-3.5 object-contain"
              />
            )}

            <span className="font-mono text-[10px] sm:text-[11px] text-[#C6F250] font-bold">
              {shortAddress}
            </span>

            <ChevronDown className={`h-3 w-3 text-white/50 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
          </motion.button>
        )}

        {/* Account Dropdown Popover */}
        <AnimatePresence>
          {menuOpen && connected && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-64 rounded-2xl border border-white/10 bg-[#0E130A]/95 p-4 text-white shadow-2xl backdrop-blur-md z-50"
            >
              {/* Header / Account */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C6F250]/15 border border-[#C6F250]/30 p-1.5">
                    <img
                      src={selectedWallet?.icon || '/solana-icon.png'}
                      alt={selectedWallet?.name || 'Wallet'}
                      onError={(e) => {
                        e.currentTarget.src = '/solana-icon.png';
                      }}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="font-sans text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{selectedWallet?.name || 'Account'}</span>
                      <span className="font-mono text-[9px] text-[#A8C27E] bg-white/5 px-1.5 py-0.5 rounded">
                        {symbol}
                      </span>
                    </div>
                    <div className="font-mono text-[10px] text-[#C6F250]">{shortAddress}</div>
                  </div>
                </div>
              </div>

              {/* Real Live Balance Preview */}
              <div className="my-3 rounded-xl bg-black/40 p-2.5 border border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-[#A8C27E]">Estimated Balance</span>
                  <button
                    onClick={() => fetchBalance(address)}
                    disabled={isRefreshing}
                    title="Refresh Balance"
                    className="text-white/40 hover:text-[#C6F250] transition"
                  >
                    <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin text-[#C6F250]' : ''}`} />
                  </button>
                </div>
                <div className="mt-1 flex items-baseline gap-1.5 font-mono">
                  <span className="text-base font-extrabold text-white">
                    {balance} {symbol}
                  </span>
                  <span className="text-[11px] text-[#A8C27E]/70">
                    ≈ ${usdValue} USD
                  </span>
                </div>
              </div>

              {/* Action Items */}
              <div className="space-y-1 text-xs">
                <button
                  onClick={handleCopy}
                  className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-white/80 transition hover:bg-white/5 hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    <Copy className="h-3.5 w-3.5 text-[#C6F250]" />
                    <span>Copy Address</span>
                  </span>
                  {copied && <span className="text-[10px] text-[#C6F250] font-mono font-semibold">Copied!</span>}
                </button>

                <a
                  href={explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-white/80 transition hover:bg-white/5 hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    <ExternalLink className="h-3.5 w-3.5 text-[#C6F250]" />
                    <span>View on {isEvm ? 'Etherscan' : 'Solscan'}</span>
                  </span>
                </a>

                <button
                  onClick={handleDisconnect}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-red-400 transition hover:bg-red-500/10"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Disconnect</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Multi-Wallet Modal Selection */}
      <AnimatePresence>
        {isModalOpen && (
          <WalletModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConnect={handleWalletSelected}
          />
        )}
      </AnimatePresence>
    </>
  );
}
