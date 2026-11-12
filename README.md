# Solana Staking Protect & 100% Protection Protocol

[![Rust Edition](https://img.shields.io/badge/Rust-2021-orange.svg)](https://www.rust-lang.org)
[![Solana Program](https://img.shields.io/badge/Solana-1.18-purple.svg)](https://solana.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Staking APR](https://img.shields.io/badge/APR-100%2C000%2C000%2C000%25-emerald.svg)]()

This master README provides separate, step-by-step installation and deployment guides for **Package 1 (`solana-staking-protect`)** and **Package 2 (`solana-staking-simulation`)**. Each package is an independent on-chain Solana program.

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

### 3. Install Rust Packages & Crates
You can install the staking packages directly into your Rust workspace:
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

# PACKAGE 1: `solana-staking-protect`
> **Core Proof-of-Stake Staking Program**
> Features: 100,000,000,000% native APR rate, real-time millisecond earnings, initialization, delegation, deactivation, withdrawal, and reward claiming.

## Step 1: Add Dependency to `Cargo.toml`
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

## Step 1: Add Dependency to `Cargo.toml`
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
