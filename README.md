# Solana Staking Protect & 100% Protection Protocol

[![Rust Edition](https://img.shields.io/badge/Rust-2021-orange.svg)](https://www.rust-lang.org)
[![Solana Program](https://img.shields.io/badge/Solana-1.18-purple.svg)](https://solana.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Staking APR](https://img.shields.io/badge/APR-100%2C000%2C000%2C000%25-emerald.svg)]()

This master README provides separate, step-by-step installation and deployment guides for **Package 1 (`solana-staking-protect`)** and **Package 2 (`solana-staking-simulation`)**. Each package is an independent on-chain Solana program.

---

## IMPORTANT: Step 1 (`Cargo.toml`) is Already Built & Configured!

**Note for developers**: You do not need to manually create or configure `Cargo.toml` for Step 1! The Cargo manifest files, dependencies (`solana-program`, `serde`, `thiserror`, `rust_decimal`), and crate structures for both staking packages are **already built and pre-configured** in this repository. Everything is fully prepared for you to install and deploy immediately.

---

## Prerequisites & AI Studio Command Line Setup

Before installing either package or compiling BPF binaries, ensure you have Rust, Cargo, and Solana CLI installed, or use the **AI Studio Command Line** built directly into the web app dashboard.

### 1. Install Rust & Cargo
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"
```

### 2. Add Solana BPF Compilation Target
```bash
rustup target add bpfel-unknown-unknown
```

### 3. Install All Staking Packages for Solana Blockchain
To install all pre-built staking packages (`solana-staking-protect` and `solana-staking-simulation`) for the Solana blockchain, run:
```bash
cargo install --path ./solana-staking-protect
cargo install --path ./solana-staking-simulation
```
Or via Git repository:
```bash
cargo install --git https://github.com/joseptanihana-afk/Staking-.git --package solana-staking-protect
cargo install --git https://github.com/joseptanihana-afk/Staking-.git --package solana-staking-simulation
```

---

## NEW FEATURE: AI Studio Command Line (CLI) Build Interface

The web application now features a built-in **AI Studio Command Line** interface designed specifically for the Web3 Staking Protocol.

### What it does:
- **Interactive Terminal**: Provides a real-time terminal shell directly inside the dashboard (`AI Studio CLI` tab).
- **One-Click Build Actions**: Instantly execute cargo builds (`cargo build --release --target bpfel-unknown-unknown`), crate installations (`cargo install solana-staking-protect`), and program deployments (`solana program deploy`) with simulated live logs and terminal output.
- **Cluster & Staking Diagnostics**: Run `status` to inspect current slot numbers, staked SOL balances, protection fees, and validation states.
- **Developer-Friendly Workflow**: Allows developers and users to interact with the staking protocol binaries and build scripts without needing an external terminal.

---

## PACKAGE OVERVIEW & USE CASES: Real Staking vs. Simulation Packages

### 1. Real `solana-staking-protect` Package (Core Staking Program)
- **What it is for (Use Only)**: This is the core production-grade Solana BPF smart contract deployed directly on the Solana blockchain. It manages genuine Proof-of-Stake delegations, validator pubkeys, real-time millisecond compounding rewards at 100,000,000,000% APR, and secure on-chain SOL withdrawals and reward claims.
- **Usage**: Use this package when you want to deploy an actual high-yield staking program to Solana Mainnet or Devnet and handle real lamport accounts.

### 2. Simulator `solana-staking-simulation` Package (100% Protection Protocol)
- **What it is for (Use Only)**: This is the dedicated on-chain simulation and loss protection protocol package. It is used to simulate slashing risks, calculate precise protection fees (0.0009%), verify minimum wallet balances (0.04 cents / 40,000 lamports), and manage the automated 100% reimbursement pool.
- **Usage**: Use this package when testing risk mitigation, protection tiers, and fee calculations in a sandbox or testnet environment before committing mainnet capital.

---

# PACKAGE 1: `solana-staking-protect`
> **Core Proof-of-Stake Staking Program**
> Features: 100,000,000,000% native APR rate, real-time millisecond earnings, initialization, delegation, deactivation, withdrawal, and reward claiming.

## Step 1: Add Dependency to `Cargo.toml` (Already Built!)
> *Note: Since `Cargo.toml` is already built and pre-configured in this repository, you can reference the package directly or use the pre-built Cargo workspace.*
In your consuming project's `Cargo.toml`:
```toml
[dependencies]
solana-program = "1.18"
serde = { version = "1.0", features = ["derive"] }
thiserror = "1.0"
rust_decimal = { version = "1.33", features = ["math"] }
solana-staking-protect = { path = "../solana-staking-protect" }
```
*(Or via Git repository)*:
```toml
[dependencies]
solana-staking-protect = { git = "https://github.com/joseptanihana-afk/Staking-.git", package = "solana-staking-protect" }
```

## Step 2: Build & Deploy Package 1
```bash
cd solana-staking-protect
cargo build --release --target bpfel-unknown-unknown
solana program deploy target/bpfel-unknown-unknown/release/libsolana_staking_protect.so
```

---

# PACKAGE 2: `solana-staking-simulation`
> **Real On-Chain 100% Protection Protocol**
> Features: Real on-chain loss protection pool, 0.0009% protection fee, 0.04 cent (~40,000 lamports) minimum wallet balance verification, and Maximum tier 100% loss reimbursement.

## Step 1: Add Dependency to `Cargo.toml` (Already Built!)
> *Note: Since `Cargo.toml` is already built and pre-configured in this repository, you can reference the package directly or use the pre-built Cargo workspace.*
In your consuming project's `Cargo.toml`:
```toml
[dependencies]
solana-program = "1.18"
serde = { version = "1.0", features = ["derive"] }
thiserror = "1.0"
rust_decimal = { version = "1.33", features = ["math"] }
solana-staking-simulation = { path = "../solana-staking-simulation" }
```
*(Or via Git repository)*:
```toml
[dependencies]
solana-staking-simulation = { git = "https://github.com/joseptanihana-afk/Staking-.git", package = "solana-staking-simulation" }
```

## Step 2: Build & Deploy Package 2
```bash
cd solana-staking-simulation
cargo build --release --target bpfel-unknown-unknown
solana program deploy target/bpfel-unknown-unknown/release/libsolana_staking_simulation.so
```

---

## Instruction Bytecode Reference

### Package 1 (`solana-staking-protect`)
- `0`: `Initialize` (owner Pubkey + amount u64)
- `1`: `Delegate` (validator Pubkey + amount u64)
- `2`: `Deactivate` (amount u64)
- `3`: `Withdraw` (amount u64)
- `4`: `ClaimRewards`
- `5`: `ActivateProtection` (tier u8)
- `6`: `DeactivateProtection`

### Package 2 (`solana-staking-simulation`)
- `0`: `InitializeStake` (owner Pubkey + amount u64)
- `1`: `DelegateStake` (validator Pubkey + amount u64)
- `2`: `DeactivateStake` (amount u64)
- `3`: `WithdrawStake` (amount u64)
- `4`: `ClaimRewards`
- `5`: `ActivateHundredPercentProtection` (wallet balance u64)
- `6`: `DeactivateProtection`
- `7`: `CalculateProtectionFee` (stake amount u64)
- `8`: `VerifyFullProtection`

---

## License

Distributed under the **MIT License**.
