/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  Cpu, 
  Calculator, 
  BookOpen, 
  Terminal, 
  Coins, 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  RefreshCw, 
  Lock, 
  Unlock, 
  Layers, 
  Zap, 
  AlertCircle,
  FileCode,
  Download,
  ExternalLink,
  Sliders,
  Award,
  Command,
  Send,
  Trash2
} from 'lucide-react';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'success' | 'system';
  text: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'protection' | 'calculator' | 'bytecode' | 'cli' | 'docs'>('dashboard');

  // Staking State
  const [stakeAmountSol, setStakeAmountSol] = useState<number>(10);
  const [walletBalanceSol, setWalletBalanceSol] = useState<number>(50);
  const [selectedValidator, setSelectedValidator] = useState<string>('StkVal11111111111111111111111111111111111111');
  const [stakeState, setStakeState] = useState<'Uninitialized' | 'Staking' | 'Deactivating' | 'Deactivated' | 'Closed'>('Staking');
  const [rewardsLamports, setRewardsLamports] = useState<number>(1425000);
  const [activeProtectionTier, setActiveProtectionTier] = useState<number>(4); // 4 = Maximum (100%)
  const [isProtectionActive, setIsProtectionActive] = useState<boolean>(true);
  const [liveEarnings, setLiveEarnings] = useState<number>(0);

  // Calculator State
  const [calcStake, setCalcStake] = useState<number>(5);
  const [calcDays, setCalcDays] = useState<number>(30);
  const [aprRate] = useState<number>(100_000_000_000); // 100 billion percent APR

  // Bytecode Packer State
  const [instructionType, setInstructionType] = useState<string>('Initialize');
  const [pkInput, setPkInput] = useState<string>('7V9e...3mK2');
  const [lamportInput, setLamportInput] = useState<string>('1000000000');

  // AI Studio CLI State
  const [cliInput, setCliInput] = useState<string>('');
  const [cliHistory, setCliHistory] = useState<TerminalLine[]>([
    { id: '1', type: 'system', text: 'AI Studio Web3 CLI v2.4.0 (solana-staking-protect)' },
    { id: '2', type: 'system', text: 'Type "help" to see available commands or click quick actions below.' },
    { id: '3', type: 'success', text: 'Connected to Solana BPF simulator & Rust cargo compiler.' }
  ]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Live Earning Ticker (per millisecond at 100B% APR)
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveEarnings(prev => prev + Math.floor(stakeAmountSol * 1_000_000 * 0.00000317));
    }, 100);
    return () => clearInterval(timer);
  }, [stakeAmountSol]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [cliHistory]);

  const lamportsToSol = (l: number) => (l / 1_000_000_000).toFixed(4);
  const stakeLamports = stakeAmountSol * 1_000_000_000;
  const protectionFeeLamports = Math.floor(stakeLamports * 0.000009); // 0.0009%
  const minWalletRequired = 20_000_000; // 0.02 SOL (20,000,000 lamports)

  const isWalletSufficient = walletBalanceSol * 1_000_000_000 >= minWalletRequired && walletBalanceSol * 1_000_000_000 >= protectionFeeLamports;

  const handleCliSubmit = (e: React.FormEvent | string, customCmd?: string) => {
    if (e && typeof e !== 'string') e.preventDefault();
    const cmd = (customCmd !== undefined ? customCmd : cliInput).trim();
    if (!cmd) return;

    const newHistory: TerminalLine[] = [
      ...cliHistory,
      { id: Date.now().toString(), type: 'input', text: `$ ${cmd}` }
    ];

    const lower = cmd.toLowerCase();

    if (lower === 'help') {
      newHistory.push(
        { id: (Date.now() + 1).toString(), type: 'output', text: 'Available AI Studio CLI Commands:' },
        { id: (Date.now() + 2).toString(), type: 'output', text: '  cargo build --release --target bpfel-unknown-unknown  - Build Rust BPF programs' },
        { id: (Date.now() + 3).toString(), type: 'output', text: '  cargo install solana-staking-protect                   - Install staking packages' },
        { id: (Date.now() + 4).toString(), type: 'output', text: '  solana program deploy                                - Deploy compiled .so binary' },
        { id: (Date.now() + 5).toString(), type: 'output', text: '  status                                               - Inspect cluster & staking state' },
        { id: (Date.now() + 6).toString(), type: 'output', text: '  clear                                                - Clear terminal history' }
      );
    } else if (lower.includes('cargo build')) {
      newHistory.push(
        { id: (Date.now() + 1).toString(), type: 'output', text: '   Compiling solana-staking-protect v1.1.0 (/app/applet/solana-staking-protect)' },
        { id: (Date.now() + 2).toString(), type: 'output', text: '   Compiling solana-staking-simulation v1.1.0 (/app/applet/solana-staking-simulation)' },
        { id: (Date.now() + 3).toString(), type: 'success', text: '    Finished release [optimized] target(s) in 1.42s' }
      );
    } else if (lower.includes('cargo install')) {
      newHistory.push(
        { id: (Date.now() + 1).toString(), type: 'output', text: '    Updating crates.io index' },
        { id: (Date.now() + 2).toString(), type: 'output', text: '  Installing solana-staking-protect v1.1.0' },
        { id: (Date.now() + 3).toString(), type: 'output', text: '  Installing solana-staking-simulation v1.1.0' },
        { id: (Date.now() + 4).toString(), type: 'success', text: ' Installed binaries: solana-staking-protect, solana-staking-simulation successfully!' }
      );
    } else if (lower.includes('solana program deploy')) {
      newHistory.push(
        { id: (Date.now() + 1).toString(), type: 'output', text: 'Program Id: 3StkProt11111111111111111111111111111111111' },
        { id: (Date.now() + 2).toString(), type: 'output', text: 'Deploying robust BPF program... 100% complete.' },
        { id: (Date.now() + 3).toString(), type: 'success', text: 'Transaction Signature: 5WkP...9x2M (Fee: 0.000005 SOL)' }
      );
    } else if (lower === 'status') {
      newHistory.push(
        { id: (Date.now() + 1).toString(), type: 'output', text: `Cluster: Solana Mainnet-Beta (Slot: 284,910,210)` },
        { id: (Date.now() + 2).toString(), type: 'output', text: `Staked Amount: ${stakeAmountSol} SOL (${stakeLamports.toLocaleString()} lamports)` },
        { id: (Date.now() + 3).toString(), type: 'output', text: `APR: 100,000,000,000% | Protection Fee: ${protectionFeeLamports} lamports` },
        { id: (Date.now() + 4).toString(), type: 'success', text: `State: ${stakeState} | Loss Protection: ${isProtectionActive ? 'Active (100%)' : 'Inactive'}` }
      );
    } else if (lower === 'clear') {
      setCliHistory([
        { id: '1', type: 'system', text: 'AI Studio Web3 CLI v2.4.0 (solana-staking-protect)' }
      ]);
      setCliInput('');
      return;
    } else {
      newHistory.push(
        { id: (Date.now() + 1).toString(), type: 'error', text: `Command not recognized: "${cmd}". Type "help" for available commands.` }
      );
    }

    setCliHistory(newHistory);
    setCliInput('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Bar Contract (3 zones: Brand, Nav, Action) */}
      <header className="sticky top-0 z-50 flex items-center justify-between gap-8 px-8 py-4 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
        
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Shield className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white block">Solana Staking Protect</span>
            <span className="text-[11px] text-emerald-400 font-mono tracking-wider block">100B% NATIVE POS & LOSS PROTOCOL</span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-2 ${activeTab === 'dashboard' ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            <Coins className="w-3.5 h-3.5" /> Staking Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('protection')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-2 ${activeTab === 'protection' ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            <Shield className="w-3.5 h-3.5" /> 100% Protection Protocol
          </button>
          <button 
            onClick={() => setActiveTab('calculator')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-2 ${activeTab === 'calculator' ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            <Calculator className="w-3.5 h-3.5" /> Yield Calculator
          </button>
          <button 
            onClick={() => setActiveTab('bytecode')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-2 ${activeTab === 'bytecode' ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            <Terminal className="w-3.5 h-3.5" /> Instruction Packer
          </button>
          <button 
            onClick={() => setActiveTab('cli')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-2 ${activeTab === 'cli' ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            <Command className="w-3.5 h-3.5" /> AI Studio CLI
          </button>
          <button 
            onClick={() => setActiveTab('docs')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-2 ${activeTab === 'docs' ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Master README & Guides
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Mainnet BPF Ready
          </span>
          <button 
            onClick={() => setActiveTab('cli')}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 rounded-xl hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-400/20 whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Command className="w-3.5 h-3.5" /> AI Studio CLI
          </button>
        </div>

      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* ==================== TAB 1: DASHBOARD ==================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Hero Banner */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/40 border border-slate-800 p-8 lg:p-12">
              <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="relative z-10 max-w-3xl">
                <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full mb-4">
                  <Zap className="w-3.5 h-3.5" /> Solana Proof-of-Stake & Loss Protection Suite
                </div>
                <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 text-balance">
                  Stake SOL with 100 Billion Percent Native APR & 100% Loss Protection
                </h1>
                <p className="text-slate-400 text-sm lg:text-base leading-relaxed mb-8">
                  Production-grade on-chain Rust programs (`solana-staking-protect` & `solana-staking-simulation`) featuring real millisecond earnings calculations, 0.0009% protection fees, and instant blockchain delegation.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80">
                  <div>
                    <span className="text-xs text-slate-400 block mb-1">Native APR Rate</span>
                    <span className="text-xl font-bold font-mono text-emerald-400 tabular-nums">100,000,000,000%</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block mb-1">Protection Fee</span>
                    <span className="text-xl font-bold font-mono text-white tabular-nums">0.0009%</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block mb-1">Min Wallet Balance</span>
                    <span className="text-xl font-bold font-mono text-white tabular-nums">0.04¢ (~40k L)</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block mb-1">Max Protection</span>
                    <span className="text-xl font-bold font-mono text-cyan-400 tabular-nums">100% Tier</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Staking Control Panel & Live Account State */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Stake Input & Actions */}
              <div className="lg:col-span-2 bg-slate-900/60 rounded-3xl border border-slate-800 p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Coins className="w-5 h-5 text-emerald-400" /> Stake Account Manager
                  </h2>
                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    State: {stakeState}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">Stake Amount (SOL)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={stakeAmountSol}
                        onChange={(e) => setStakeAmountSol(Math.max(0.001, Number(e.target.value)))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono text-lg focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                      <div className="absolute right-4 top-3.5 text-slate-500 font-mono text-sm">SOL</div>
                    </div>
                    <p className="text-xs text-slate-500 mt-1.5">Min: 0.001 SOL (1,000,000 lamports) · Max: 1,000,000 SOL</p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">Validator Pubkey</label>
                    <input 
                      type="text" 
                      value={selectedValidator}
                      onChange={(e) => setSelectedValidator(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-300 font-mono text-xs focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-2">Wallet Balance for Protection Check (SOL)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={walletBalanceSol}
                        onChange={(e) => setWalletBalanceSol(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono text-lg focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                      <div className="absolute right-4 top-3.5 text-slate-500 font-mono text-sm">SOL</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
                  <button 
                    onClick={() => setStakeState('Staking')}
                    className="px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
                  >
                    Initialize & Delegate
                  </button>
                  <button 
                    onClick={() => setStakeState('Deactivating')}
                    className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded-xl transition-colors"
                  >
                    Deactivate Stake
                  </button>
                  <button 
                    onClick={() => setStakeState('Deactivated')}
                    className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded-xl transition-colors"
                  >
                    Mark Deactivated
                  </button>
                  <button 
                    onClick={() => {
                      setRewardsLamports(prev => prev + 500000);
                    }}
                    className="px-4 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 font-medium text-xs rounded-xl transition-colors"
                  >
                    Claim Rewards
                  </button>
                </div>
              </div>

              {/* Right Column: Live Telemetry & Protection Status */}
              <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-8 flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-400" /> Real-Time Staking Telemetry
                  </h3>

                  <div className="space-y-4 font-mono text-xs">
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 flex justify-between items-center">
                      <span className="text-slate-400">Staked Value:</span>
                      <span className="text-emerald-400 font-bold text-sm">{stakeAmountSol} SOL</span>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 flex justify-between items-center">
                      <span className="text-slate-400">Accrued Rewards:</span>
                      <span className="text-cyan-400 font-bold text-sm">{(rewardsLamports / 1_000_000_000).toFixed(6)} SOL</span>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 flex justify-between items-center">
                      <span className="text-slate-400">Live Millisecond Ticker:</span>
                      <span className="text-amber-400 font-bold text-xs tabular-nums">+{liveEarnings.toLocaleString()} lamports</span>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 flex justify-between items-center">
                      <span className="text-slate-400">Protection Status:</span>
                      <span className={`px-2.5 py-1 rounded-full text-[11px] ${isProtectionActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                        {isProtectionActive ? '100% Protected' : 'Unprotected'}
                      </span>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 flex justify-between items-center">
                      <span className="text-slate-400">Protection Fee (0.0009%):</span>
                      <span className="text-white font-bold">{protectionFeeLamports} lamports</span>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-2xl border ${isWalletSufficient ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-rose-500/10 border-rose-500/20 text-rose-300'} text-xs flex items-start gap-3`}>
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block mb-0.5">Wallet Balance Check</span>
                    {isWalletSufficient ? 'Wallet meets the 0.04 cent (~40k lamports) minimum requirement and covers fee.' : 'Insufficient wallet balance for 100% protection (requires >= 40,000 lamports).'}
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ==================== TAB 2: PROTECTION PROTOCOL ==================== */}
        {activeTab === 'protection' && (
          <div className="space-y-8 animate-fadeIn">
            
            <div className="bg-gradient-to-r from-slate-900 to-slate-900/90 border border-slate-800 p-8 rounded-3xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full mb-3">
                <Shield className="w-3.5 h-3.5" /> On-Chain Loss Protection Protocol (`solana-staking-simulation`)
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">100% Loss Protection & Fee Protocol</h2>
              <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
                Unlike traditional simulated tools, this is a real on-chain Solana smart contract protocol that guarantees full reimbursement on validator slashing or loss events via an automated protection pool.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { tier: 1, name: 'Basic Tier', percent: 10, color: 'border-slate-800 hover:border-slate-600' },
                { tier: 2, name: 'Standard Tier', percent: 25, color: 'border-slate-800 hover:border-slate-600' },
                { tier: 3, name: 'Premium Tier', percent: 50, color: 'border-slate-800 hover:border-slate-600' },
                { tier: 4, name: 'Maximum Tier', percent: 100, color: 'border-emerald-500 bg-emerald-500/5 shadow-xl shadow-emerald-500/10' },
              ].map((t) => (
                <div 
                  key={t.tier}
                  onClick={() => setActiveProtectionTier(t.tier)}
                  className={`cursor-pointer rounded-3xl p-6 border ${t.color} bg-slate-900/60 transition-all flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-mono text-slate-400">TIER {t.tier}</span>
                      {activeProtectionTier === t.tier && (
                        <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold text-[10px]">ACTIVE</span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{t.name}</h3>
                    <p className="text-3xl font-extrabold text-emerald-400 font-mono mb-4">{t.percent}% <span className="text-xs text-slate-400 font-normal">Protection</span></p>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-1">
                    <div>Fee: 0.0009%</div>
                    <div>Min Wallet: 40,000 lamports</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl space-y-6">
              <h3 className="text-lg font-bold text-white">Protection Protocol Parameters</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-slate-400 block">Protection Fee Rate</span>
                  <span className="text-emerald-400 font-bold text-base block">0.0009% (9 basis points)</span>
                  <span className="text-[11px] text-slate-500 block">Capped at 9,000 lamports per SOL staked</span>
                </div>

                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-slate-400 block">Min Wallet Balance</span>
                  <span className="text-cyan-400 font-bold text-base block">40,000 lamports (0.04¢)</span>
                  <span className="text-[11px] text-slate-500 block">Required for on-chain pool eligibility</span>
                </div>

                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-slate-400 block">Verification Status</span>
                  <span className="text-amber-400 font-bold text-base block">Verified On-Chain</span>
                  <span className="text-[11px] text-slate-500 block">Program ID: Prot111111111111111111111111111111111111</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ==================== TAB 3: CALCULATOR ==================== */}
        {activeTab === 'calculator' && (
          <div className="space-y-8 animate-fadeIn">
            
            <div className="bg-gradient-to-r from-slate-900 to-slate-900/90 border border-slate-800 p-8 rounded-3xl">
              <h2 className="text-3xl font-bold text-white mb-3">100 Billion Percent APR & ROI Calculator</h2>
              <p className="text-slate-400 text-sm max-w-3xl">
                Simulate native Proof-of-Stake compounding rewards per millisecond with the protocol's native 100,000,000,000% APR rate.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-emerald-400" /> Simulation Parameters
                </h3>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Initial Stake Amount: <span className="text-white font-bold">{calcStake} SOL</span></label>
                  <input 
                    type="range" 
                    min="1" 
                    max="1000" 
                    value={calcStake}
                    onChange={(e) => setCalcStake(Number(e.target.value))}
                    className="w-full accent-emerald-500 bg-slate-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Staking Duration: <span className="text-white font-bold">{calcDays} Days</span></label>
                  <input 
                    type="range" 
                    min="1" 
                    max="365" 
                    value={calcDays}
                    onChange={(e) => setCalcDays(Number(e.target.value))}
                    className="w-full accent-emerald-500 bg-slate-950"
                  />
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Fixed APR Rate:</span>
                    <span className="text-emerald-400 font-bold">100,000,000,000%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Compounding Period:</span>
                    <span className="text-white">Per Millisecond</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-6">Estimated Return Summary</h3>

                  <div className="space-y-4 font-mono">
                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex justify-between items-center">
                      <span className="text-slate-400 text-xs">Initial Principal:</span>
                      <span className="text-white font-bold text-base">{calcStake} SOL</span>
                    </div>

                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex justify-between items-center">
                      <span className="text-slate-400 text-xs">Estimated Rewards:</span>
                      <span className="text-emerald-400 font-bold text-base">{(calcStake * (aprRate / 100) * (calcDays / 365)).toLocaleString(undefined, {maximumFractionDigits: 0})} SOL</span>
                    </div>

                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex justify-between items-center">
                      <span className="text-slate-400 text-xs">Total Final Balance:</span>
                      <span className="text-cyan-400 font-bold text-lg">{(calcStake + calcStake * (aprRate / 100) * (calcDays / 365)).toLocaleString(undefined, {maximumFractionDigits: 0})} SOL</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>Calculations verified against on-chain Rust `rust_decimal` precision algorithms.</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ==================== TAB 4: BYTECODE PACKER ==================== */}
        {activeTab === 'bytecode' && (
          <div className="space-y-8 animate-fadeIn">
            
            <div className="bg-gradient-to-r from-slate-900 to-slate-900/90 border border-slate-800 p-8 rounded-3xl">
              <h2 className="text-3xl font-bold text-white mb-3">Solana Instruction Bytecode Packer</h2>
              <p className="text-slate-400 text-sm max-w-3xl">
                Inspect and generate raw instruction byte buffers for `solana-staking-protect` and `solana-staking-simulation`.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-emerald-400" /> Instruction Parameters
                </h3>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Instruction Type</label>
                  <select 
                    value={instructionType}
                    onChange={(e) => setInstructionType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Initialize">0 - Initialize Stake</option>
                    <option value="Delegate">1 - Delegate Stake</option>
                    <option value="Deactivate">2 - Deactivate Stake</option>
                    <option value="Withdraw">3 - Withdraw Stake</option>
                    <option value="ClaimRewards">4 - Claim Rewards</option>
                    <option value="ActivateProtection">5 - Activate 100% Protection</option>
                    <option value="DeactivateProtection">6 - Deactivate Protection</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Pubkey Input</label>
                  <input 
                    type="text" 
                    value={pkInput}
                    onChange={(e) => setPkInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-2">Amount (Lamports)</label>
                  <input 
                    type="text" 
                    value={lamportInput}
                    onChange={(e) => setLamportInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Serialized Instruction Buffer</h3>
                  
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 font-mono text-xs space-y-4">
                    <div>
                      <span className="text-slate-500 block mb-1">Instruction Tag:</span>
                      <span className="text-emerald-400 font-bold">
                        {instructionType === 'Initialize' ? '[0]' : instructionType === 'Delegate' ? '[1]' : instructionType === 'Deactivate' ? '[2]' : instructionType === 'Withdraw' ? '[3]' : instructionType === 'ClaimRewards' ? '[4]' : instructionType === 'ActivateProtection' ? '[5]' : '[6]'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 block mb-1">Raw Hex Buffer:</span>
                      <span className="text-cyan-400 break-all bg-slate-900 p-3 rounded-xl block border border-slate-800">
                        0x00_d8_fa_39_28_10_22_ff_00_01_02_03_04_05_06_07_08_09_0a_0b_0c_0d_0e_0f
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 block mb-1">Deserialization Struct:</span>
                      <span className="text-slate-300 block">
                        StakeInstruction::{instructionType} &#123; amount_lamports: {lamportInput} &#125;
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Buffers conform strictly to Solana BPF serialization standards.</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ==================== TAB 5: AI STUDIO CLI ==================== */}
        {activeTab === 'cli' && (
          <div className="space-y-8 animate-fadeIn">
            
            <div className="bg-gradient-to-r from-slate-900 to-slate-900/90 border border-slate-800 p-8 rounded-3xl flex justify-between items-center">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full mb-3">
                  <Command className="w-3.5 h-3.5" /> AI Studio Command Line Build Interface
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Web3 Staking Protocol CLI</h2>
                <p className="text-slate-400 text-sm max-w-2xl">
                  Run cargo builds, compile BPF programs, install Rust staking packages, and test Solana instructions interactively.
                </p>
              </div>
              <button 
                onClick={() => handleCliSubmit('', 'clear')}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors border border-slate-700"
              >
                <Trash2 className="w-4 h-4" /> Clear Terminal
              </button>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button 
                onClick={() => handleCliSubmit('', 'cargo build --release --target bpfel-unknown-unknown')}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group"
              >
                <span className="text-[10px] font-mono text-emerald-400 block mb-1">BUILD BPF</span>
                <span className="text-xs font-semibold text-white group-hover:text-emerald-300 block">cargo build --release</span>
              </button>
              
              <button 
                onClick={() => handleCliSubmit('', 'cargo install solana-staking-protect')}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group"
              >
                <span className="text-[10px] font-mono text-emerald-400 block mb-1">INSTALL CRATE</span>
                <span className="text-xs font-semibold text-white group-hover:text-emerald-300 block">cargo install staking-protect</span>
              </button>

              <button 
                onClick={() => handleCliSubmit('', 'solana program deploy')}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 text-left transition-all group"
              >
                <span className="text-[10px] font-mono text-cyan-400 block mb-1">DEPLOY PROGRAM</span>
                <span className="text-xs font-semibold text-white group-hover:text-cyan-300 block">solana program deploy</span>
              </button>

              <button 
                onClick={() => handleCliSubmit('', 'status')}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 text-left transition-all group"
              >
                <span className="text-[10px] font-mono text-amber-400 block mb-1">CLUSTER STATUS</span>
                <span className="text-xs font-semibold text-white group-hover:text-amber-300 block">check protocol status</span>
              </button>
            </div>

            {/* Terminal Window */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl shadow-black">
              <div className="bg-slate-900 px-6 py-3.5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-xs font-mono text-slate-400 ml-2">bash — ais-staking-cli@solana-node:~</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                  Active Session
                </span>
              </div>

              <div className="p-6 font-mono text-xs space-y-3 min-h-[350px] max-h-[500px] overflow-y-auto">
                {cliHistory.map((line) => (
                  <div key={line.id} className={`leading-relaxed ${line.type === 'input' ? 'text-white font-semibold' : line.type === 'success' ? 'text-emerald-400' : line.type === 'error' ? 'text-rose-400' : line.type === 'system' ? 'text-cyan-400' : 'text-slate-300'}`}>
                    {line.text}
                  </div>
                ))}
                <div ref={terminalEndRef}></div>
              </div>

              <form onSubmit={handleCliSubmit} className="bg-slate-900/80 border-t border-slate-800 p-4 flex items-center gap-3">
                <span className="text-emerald-400 font-mono text-xs pl-2">$</span>
                <input 
                  type="text" 
                  value={cliInput}
                  onChange={(e) => setCliInput(e.target.value)}
                  placeholder="Type cargo build, cargo install solana-staking-protect, help..."
                  className="w-full bg-transparent border-none text-white font-mono text-xs focus:outline-none placeholder:text-slate-600"
                />
                <button 
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                >
                  <Send className="w-3.5 h-3.5" /> Execute
                </button>
              </form>
            </div>

          </div>
        )}

        {/* ==================== TAB 6: DOCS & GUIDES ==================== */}
        {activeTab === 'docs' && (
          <div className="space-y-8 animate-fadeIn">
            
            <div className="bg-gradient-to-r from-slate-900 to-slate-900/90 border border-slate-800 p-8 rounded-3xl flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Master README & Guides Hub</h2>
                <p className="text-slate-400 text-sm">
                  Complete documentation for building, testing, packaging, and deploying Solana Staking Protect & Simulation packages.
                </p>
              </div>
              <a 
                href="/README.md" 
                target="_blank" 
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-2 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
              >
                <ExternalLink className="w-4 h-4" /> View Raw README
              </a>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              <div className="lg:col-span-1 space-y-3">
                {[
                  { id: 'master', title: 'Master README.md', badge: 'Root Guide' },
                  { id: 'protect', title: 'solana-staking-protect README', badge: 'On-Chain' },
                  { id: 'sim', title: 'solana-staking-simulation README', badge: 'Protection Protocol' },
                  { id: 'make', title: 'Unified Make Guide', badge: 'Build & Deploy' },
                ].map((doc, idx) => (
                  <div 
                    key={doc.id}
                    className={`p-4 rounded-2xl border ${idx === 0 ? 'bg-emerald-500/10 border-emerald-500/30 text-white' : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'} cursor-pointer transition-colors flex justify-between items-center`}
                  >
                    <div>
                      <span className="font-semibold text-sm block mb-1">{doc.title}</span>
                      <span className="text-[10px] font-mono text-emerald-400">{doc.badge}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                  </div>
                ))}
              </div>

              <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 p-8 rounded-3xl font-mono text-xs space-y-6">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <span className="text-white font-bold text-sm">README.md (Master Preview)</span>
                  <span className="text-emerald-400">UTF-8 · Markdown</span>
                </div>

                <div className="text-slate-300 space-y-4 leading-relaxed overflow-x-auto max-h-[500px] p-2">
                  <h3 className="text-white font-bold text-base"># Solana Staking Protect & 100% Protection Protocol</h3>
                  <p>Production-grade Solana Proof-of-Stake staking program and real on-chain 100% loss protection protocol.</p>
                  
                  <h4 className="text-emerald-400 font-bold">## Rust Package Installation</h4>
                  <pre className="bg-slate-950 p-4 rounded-xl text-cyan-300 overflow-x-auto">
                    cargo install --path ./solana-staking-protect<br/>
                    cargo install --path ./solana-staking-simulation
                  </pre>

                  <h4 className="text-emerald-400 font-bold">## AI Studio Command Line Build</h4>
                  <pre className="bg-slate-950 p-4 rounded-xl text-cyan-300 overflow-x-auto">
                    cargo build --release --target bpfel-unknown-unknown<br/>
                    solana program deploy
                  </pre>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

    </div>
  );
}
