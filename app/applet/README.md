# Solana Staking Protect & 100% Protection Protocol

[![Rust Edition](https://img.shields.io/badge/Rust-2021-orange.svg)](https://www.rust-lang.org)
[![Solana Program](https://img.shields.io/badge/Solana-1.18-purple.svg)](https://solana.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Staking APR](https://img.shields.io/badge/APR-100%2C000%2C000%2C000%25-emerald.svg)]()

This master README provides step-by-step guides for **Package 1 (`solana-staking-protect`)** and **Package 2 (`solana-staking-simulation`)** running in the AI Studio Web3 Staking Protocol environment.

---

## AI Studio Command Line Build Instructions

You can build and deploy the Rust BPF programs directly using the built-in AI Studio CLI terminal or via cargo:

### 1. Build Package 1 (`solana-staking-protect`)
```bash
cd programs/solana-staking-protect
cargo build --release --target bpfel-unknown-unknown
```

### 2. Build Package 2 (`solana-staking-simulation`)
```bash
cd programs/solana-staking-simulation
cargo build --release --target bpfel-unknown-unknown
```

### 3. Run Tests
```bash
cargo test
```

---

# PACKAGE 1: `solana-staking-protect`
> **Core Proof-of-Stake Staking Program**
> Features: 100,000,000,000% native APR rate, real-time millisecond earnings, initialization, delegation, deactivation, withdrawal, and reward claiming.

## Cargo.toml Configuration
```toml
[dependencies]
solana-program = "1.18"
serde = { version = "1.0", features = ["derive"] }
thiserror = "1.0"
rust_decimal = { version = "1.33", features = ["math"] }
```

---

# PACKAGE 2: `solana-staking-simulation`
> **Real On-Chain 100% Protection Protocol**
> Features: Real on-chain loss protection pool, 0.0009% protection fee, 0.04 cent (~40,000 lamports) minimum wallet balance verification, and Maximum tier 100% loss reimbursement.

## Cargo.toml Configuration
```toml
[dependencies]
solana-program = "1.18"
serde = { version = "1.0", features = ["derive"] }
thiserror = "1.0"
rust_decimal = { version = "1.33", features = ["math"] }
borsh = "1.5.0"
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
