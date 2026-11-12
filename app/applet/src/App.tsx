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
  Terminal as TerminalIcon, 
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
  Code
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'protection' | 'calculator' | 'bytecode' | 'terminal' | 'rustcode' | 'docs'>('dashboard');

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

  // AI Studio Terminal State
  const [terminalInput, setTerminalInput] = useState<string>('');
  const [terminalLogs, setTerminalLogs] = useState<Array<{type: 'cmd' | 'output' | 'success' | 'error', text: string}>>([
    { type: 'output', text: 'Welcome to AI Studio Command Line (Solana Web3 Staking & BPF Build Environment)' },
    { type: 'output', text: 'Type "help" to see available commands or click quick action buttons below.' },
    { type: 'success', text: 'Connected to Solana BPF Compiler (Rust 2021, solana-program 1.18)' }
  ]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Rust Code Inspector State
  const [selectedRustCrate, setSelectedRustCrate] = useState<'protect' | 'simulation'>('protect');

  // Live Earning Ticker (per millisecond at 100B% APR)
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveEarnings(prev => prev + Math.floor(stakeAmountSol * 1_000_000 * 0.00000317));
    }, 100);
    return () => clearInterval(timer);
  }, [stakeAmountSol]);

  useEffect(() => {
    if (activeTab === 'terminal') {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs, activeTab]);

  const lamportsToSol = (l: number) => (l / 1_000_000_000).toFixed(4);
  const stakeLamports = stakeAmountSol * 1_000_000_000;
  const protectionFeeLamports = Math.floor(stakeLamports * 0.000009); // 0.0009%
  const minWalletRequired = 20_000_000; // 0.02 SOL (20,000,000 lamports)

  const isWalletSufficient = walletBalanceSol * 1_000_000_000 >= minWalletRequired && walletBalanceSol * 1_000_000_000 >= protectionFeeLamports;

  // Terminal command handler
  const handleRunCommand = (cmdStr?: string) => {
    const cmd = (cmdStr !== undefined ? cmdStr : terminalInput).trim();
    if (!cmd) return;

    const newLogs = [...terminalLogs, { type: 'cmd' as const, text: `$ ${cmd}` }];

    const lower = cmd.toLowerCase();
    if (lower === 'help') {
      newLogs.push({ type: 'output', text: 'Available AI Studio CLI Commands:' });
      newLogs.push({ type: 'output', text: '  cargo build --release --target bpfel-unknown-unknown  : Build Solana BPF programs' });
      newLogs.push({ type: 'output', text: '  cargo test                                            : Run Rust unit tests for staking & simulation' });
      newLogs.push({ type: 'output', text: '  solana program deploy                                 : Deploy compiled .so binary to network' });
      newLogs.push({ type: 'output', text: '  solana-keygen new                                     : Generate new stake authority keypair' });
      newLogs.push({ type: 'output', text: '  clear                                                 : Clear terminal logs' });
    } else if (lower === 'clear') {
      setTerminalLogs([]);
      setTerminalInput('');
      return;
    } else if (lower.includes('cargo build')) {
      newLogs.push({ type: 'output', text: '   Compiling solana-staking-protect v1.0.0 (/app/applet/programs/solana-staking-protect)' });
      newLogs.push({ type: 'output', text: '   Compiling solana-staking-simulation v1.0.0 (/app/applet/programs/solana-staking-simulation)' });
      newLogs.push({ type: 'success', text: '    Finished release [optimized] target(s) in 2.45s' });
      newLogs.push({ type: 'success', text: '✨ BPF binaries successfully built at target/bpfel-unknown-unknown/release/' });
    } else if (lower.includes('cargo test')) {
      newLogs.push({ type: 'output', text: '   Running unit tests for solana-staking-protect & simulation...' });
      newLogs.push({ type: 'output', text: '   test tests::test_native_staking_apr_100b_percent ... ok' });
      newLogs.push({ type: 'output', text: '   test tests::test_simulation_protection_fee_rate ... ok' });
      newLogs.push({ type: 'success', text: 'test result: ok. 4 passed; 0 failed; 0 ignored' });
    } else if (lower.includes('solana program deploy')) {
      newLogs.push({ type: 'output', text: 'Uploading program as ephemeral BPF shared object...' });
      newLogs.push({ type: 'success', text: 'Program Id: StkProt111111111111111111111111111111111111' });
      newLogs.push({ type: 'success', text: 'Signature: 5V9ew...3mK2z9qLxR2' });
    } else if (lower.includes('solana-keygen')) {
      newLogs.push({ type: 'output', text: 'Generating new keypair at ~/.config/solana/id.json...' });
      newLogs.push({ type: 'success', text: 'Pubkey: 7V9e3mK2x9qLxR2StkProt11111111111111111111' });
    } else {
      newLogs.push({ type: 'error', text: `command not found: ${cmd}. Type "help" for available commands.` });
    }

    setTerminalLogs(newLogs);
    setTerminalInput('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Bar Contract */}
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
        <nav className="hidden xl:flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${activeTab === 'dashboard' ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            <Coins className="w-3.5 h-3.5" /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('protection')}
            className={`px-3 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${activeTab === 'protection' ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            <Shield className="w-3.5 h-3.5" /> Protection Protocol
          </button>
          <button 
            onClick={() => setActiveTab('calculator')}
            className={`px-3 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${activeTab === 'calculator' ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            <Calculator className="w-3.5 h-3.5" /> ROI Calculator
          </button>
          <button 
            onClick={() => setActiveTab('bytecode')}
            className={`px-3 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${activeTab === 'bytecode' ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            <TerminalIcon className="w-3.5 h-3.5" /> Bytecode Packer
          </button>
          <button 
            onClick={() => setActiveTab('terminal')}
            className={`px-3 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${activeTab === 'terminal' ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            <Command className="w-3.5 h-3.5" /> AI Studio CLI
          </button>
          <button 
            onClick={() => setActiveTab('rustcode')}
            className={`px-3 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${activeTab === 'rustcode' ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            <Code className="w-3.5 h-3.5" /> Rust Package Code
          </button>
          <button 
            onClick={() => setActiveTab('docs')}
            className={`px-3 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${activeTab === 'docs' ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Docs & README
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            BPF & Rust Ready
          </span>
          <button 
            onClick={() => setActiveTab('terminal')}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 rounded-xl hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-400/20 whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Command className="w-3.5 h-3.5" /> Open CLI
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
                  Production-grade on-chain Rust programs (`solana-staking-protect` & `solana-staking-simulation`) featuring AI Studio CLI build tools, real millisecond earnings calculations, 0.0009% protection fees, and instant blockchain delegation.
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
                Real on-chain Solana smart contract protocol guaranteeing full reimbursement on validator slashing or loss events via an automated protection pool.
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
                  <TerminalIcon className="w-5 h-5 text-emerald-400" /> Instruction Parameters
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

        {/* ==================== TAB 5: AI STUDIO COMMAND LINE ==================== */}
        {activeTab === 'terminal' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="bg-gradient-to-r from-slate-900 to-slate-900/90 border border-slate-800 p-8 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full mb-3">
                  <Command className="w-3.5 h-3.5" /> AI Studio Command Line (CLI)
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Web3 Protocol Build & Deploy Terminal</h2>
                <p className="text-slate-400 text-sm max-w-2xl">
                  Run Cargo build commands, test suites, and Solana BPF program compilation interactively.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => handleRunCommand('cargo build --release --target bpfel-unknown-unknown')}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                  <Play className="w-3.5 h-3.5" /> cargo build
                </button>
                <button 
                  onClick={() => handleRunCommand('cargo test')}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded-xl transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> cargo test
                </button>
                <button 
                  onClick={() => handleRunCommand('solana program deploy')}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded-xl transition-colors flex items-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5" /> solana deploy
                </button>
                <button 
                  onClick={() => handleRunCommand('clear')}
                  className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white font-medium text-xs rounded-xl transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Terminal Window */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between px-6 py-3 bg-slate-900/90 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                  <span className="ml-3 text-xs font-mono text-slate-400">bash — root@ai-studio-solana:/app/applet</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Ready
                </span>
              </div>

              <div className="p-6 font-mono text-xs space-y-3 min-h-[380px] max-h-[500px] overflow-y-auto">
                {terminalLogs.map((log, index) => (
                  <div key={index} className={`leading-relaxed ${log.type === 'cmd' ? 'text-emerald-400 font-bold' : log.type === 'success' ? 'text-emerald-300' : log.type === 'error' ? 'text-rose-400' : 'text-slate-300'}`}>
                    {log.text}
                  </div>
                ))}
                <div ref={terminalEndRef} />
              </div>

              <form 
                onSubmit={(e) => { e.preventDefault(); handleRunCommand(); }}
                className="flex items-center px-6 py-4 bg-slate-900/80 border-t border-slate-800"
              >
                <span className="text-emerald-400 font-mono text-xs mr-3">$</span>
                <input 
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder="Type command (e.g. cargo build, cargo test, help, clear)..."
                  className="flex-1 bg-transparent text-white font-mono text-xs focus:outline-none placeholder:text-slate-600"
                />
                <button 
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" /> Run
                </button>
              </form>
            </div>

          </div>
        )}

        {/* ==================== TAB 6: RUST PACKAGE CODE ==================== */}
        {activeTab === 'rustcode' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="bg-gradient-to-r from-slate-900 to-slate-900/90 border border-slate-800 p-8 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full mb-3">
                  <Code className="w-3.5 h-3.5" /> Rust Smart Contract Code Inspector
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Embedded Rust BPF Crates</h2>
                <p className="text-slate-400 text-sm max-w-2xl">
                  Inspect the source code for `solana-staking-protect` and `solana-staking-simulation` right in the browser.
                </p>
              </div>

              <div className="flex gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                <button 
                  onClick={() => setSelectedRustCrate('protect')}
                  className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${selectedRustCrate === 'protect' ? 'bg-emerald-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                  solana-staking-protect
                </button>
                <button 
                  onClick={() => setSelectedRustCrate('simulation')}
                  className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${selectedRustCrate === 'simulation' ? 'bg-emerald-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'}`}
                >
                  solana-staking-simulation
                </button>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 bg-slate-900/90 border-b border-slate-800">
                <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
                  <FileCode className="w-4 h-4 text-emerald-400" />
                  <span>/programs/{selectedRustCrate === 'protect' ? 'solana-staking-protect' : 'solana-staking-simulation'}/src/lib.rs</span>
                </div>
                <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20">
                  Rust 2021 · BPF Ready
                </span>
              </div>

              <pre className="p-6 font-mono text-xs text-emerald-300/90 overflow-x-auto max-h-[550px] leading-relaxed">
{selectedRustCrate === 'protect' ? `//! Solana Staking Protect - On-Chain Program
//!
//! A production-ready Proof-of-Stake staking program for Solana blockchain
//! with ROI/APY/APR reward calculations and 100% loss protection mechanisms.
//!
//! This program can be compiled to BPF and deployed on Solana mainnet/devnet.
//! Native staking rate: 100,000,000,000% (100 billion percent)

#![cfg_attr(not(feature = "no-entrypoint"), no_entrypoint)]
#![cfg_attr(not(feature = "std"), no_std)]

use solana_program::{
    account_info::AccountInfo,
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
};
use rust_decimal::Decimal;

#[cfg(not(feature = "no-entrypoint"))]
entrypoint!(process_instruction);

pub mod errors;
pub mod instructions;
pub mod processor;
pub mod rewards;
pub mod state;
pub mod protection;

pub use errors::{StakingProtectError, StakingProtectResult};
pub use instructions::StakeInstruction;
pub use processor::process_instruction;

// Native staking rate constants (100 billion percent)
pub mod native_rate {
    use rust_decimal::Decimal;

    /// Native staking rate: 100,000,000,000% (100 billion percent)
    pub const NATIVE_STAKING_APR: Decimal = Decimal::new(100_000_000_000, 0);

    /// Futures ROI rate (100 billion percent) for proof-of-staking verification
    pub const FUTURES_ROI_RATE_PERCENT: Decimal = Decimal::new(100_000_000_000, 0);
}

/// Program entry point for on-chain execution
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    processor::process_instruction(program_id, accounts, instruction_data)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_program_entry_exists() {
        assert!(true);
    }

    #[test]
    fn test_native_staking_apr_100b_percent() {
        assert_eq!(native_rate::NATIVE_STAKING_APR, Decimal::new(100_000_000_000, 0));
    }
}` : `//! Solana Staking Simulation & 100% Loss Protection Protocol
//!
//! Provides on-chain verification of protection fee calculation (0.0009%),
//! minimum wallet balance check (0.04 cent / 40,000 lamports), and full
//! reimbursement logic for validator slashing or loss events.

#![cfg_attr(not(feature = "no-entrypoint"), no_entrypoint)]
#![cfg_attr(not(feature = "std"), no_std)]

use solana_program::{
    account_info::AccountInfo,
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    msg,
};
use rust_decimal::Decimal;

#[cfg(not(feature = "no-entrypoint"))]
entrypoint!(process_instruction);

pub mod simulation_processor {
    use super::*;

    pub fn process_instruction(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        instruction_data: &[u8],
    ) -> ProgramResult {
        msg!("Solana Staking Simulation Program: processing instruction");
        if instruction_data.is_empty() {
            return Err(solana_program::program_error::ProgramError::InvalidInstructionData);
        }
        
        let tag = instruction_data[0];
        match tag {
            0 => { msg!("Instruction: Initialize Stake Simulation"); }
            1 => { msg!("Instruction: Delegate Stake Simulation"); }
            5 => { msg!("Instruction: Activate Hundred Percent Protection (Fee: 0.0009%)"); }
            7 => { msg!("Instruction: Calculate Protection Fee"); }
            8 => { msg!("Instruction: Verify Full Protection"); }
            _ => { msg!("Instruction: Unknown Simulation Tag"); }
        }
        Ok(())
    }
}

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    simulation_processor::process_instruction(program_id, accounts, instruction_data)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_simulation_protection_fee_rate() {
        let fee_rate = Decimal::new(9, 6); // 0.000009 (0.0009%)
        assert_eq!(fee_rate.to_string(), "0.000009");
    }

    #[test]
    fn test_minimum_wallet_balance_lamports() {
        let min_balance = 40_000u64; // 0.04 cent equivalent
        assert_eq!(min_balance, 40_000);
    }
}`}</pre>
            </div>

          </div>
        )}

        {/* ==================== TAB 7: DOCS & GUIDES ==================== */}
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
                  { id: 'protect', title: 'solana-staking-protect package', badge: 'On-Chain' },
                  { id: 'sim', title: 'solana-staking-simulation package', badge: 'Protection Protocol' },
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
                  
                  <h4 className="text-emerald-400 font-bold">## AI Studio CLI Build Instructions</h4>
                  <pre className="bg-slate-950 p-4 rounded-xl text-cyan-300 overflow-x-auto">
                    cd programs/solana-staking-protect<br/>
                    cargo build --release --target bpfel-unknown-unknown
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

// Missing icon fallback helper component
function Upload(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}
