# TS-Blockchain

> **Learn blockchain fundamentals by building one from scratch -- blocks, mining, wallets, transactions, and P2P networking in TypeScript.**

<!-- Badges: Row 1 -- Identity -->
[![Atypical-Consulting - ts-blockchain](https://img.shields.io/static/v1?label=Atypical-Consulting&message=ts-blockchain&color=blue&logo=github)](https://github.com/Atypical-Consulting/ts-blockchain)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.0-purple?logo=typescript)](https://www.typescriptlang.org/)
[![stars - ts-blockchain](https://img.shields.io/github/stars/Atypical-Consulting/ts-blockchain?style=social)](https://github.com/Atypical-Consulting/ts-blockchain)
[![forks - ts-blockchain](https://img.shields.io/github/forks/Atypical-Consulting/ts-blockchain?style=social)](https://github.com/Atypical-Consulting/ts-blockchain)

<!-- Badges: Row 2 -- Activity -->
[![GitHub tag](https://img.shields.io/github/tag/Atypical-Consulting/ts-blockchain?include_prereleases=&sort=semver&color=blue)](https://github.com/Atypical-Consulting/ts-blockchain/releases/)
[![issues - ts-blockchain](https://img.shields.io/github/issues/Atypical-Consulting/ts-blockchain)](https://github.com/Atypical-Consulting/ts-blockchain/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/Atypical-Consulting/ts-blockchain)](https://github.com/Atypical-Consulting/ts-blockchain/pulls)
[![GitHub last commit](https://img.shields.io/github/last-commit/Atypical-Consulting/ts-blockchain)](https://github.com/Atypical-Consulting/ts-blockchain/commits/master)

---

## Table of Contents

- [The Problem](#the-problem)
- [The Solution](#the-solution)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## The Problem

Understanding blockchain technology is hard without hands-on experience. Most tutorials and courses stay theoretical -- explaining hash functions, consensus, and distributed ledgers in the abstract. Without building a blockchain from scratch, concepts like proof-of-work mining, peer-to-peer chain synchronization, and transaction signing remain opaque.

## The Solution

**TS-Blockchain** is a fully functional blockchain implementation in TypeScript that you can run, modify, and extend. It includes a REST API, P2P networking over WebSockets, proof-of-work mining with adjustable difficulty, and a wallet system with elliptic-curve-signed transactions -- all designed as a learning tool.

```typescript
// Start a node, create a transaction, and mine a block
const bc = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();

const transaction = wallet.createTransaction(recipientAddress, 50, bc, tp);
const miner = new Miner(bc, tp, wallet, p2pServer);
const block = miner.mine(); // mines pending transactions into a new block
```

## Features

- [x] Blockchain core with genesis block and chain validation
- [x] Proof-of-work mining with adjustable difficulty and mine rate
- [x] Wallet system with elliptic-curve key pairs (secp256k1)
- [x] Signed transactions with input/output model
- [x] Transaction pool with duplicate detection and updates
- [x] Mining rewards (66 coins per block)
- [x] P2P networking via WebSockets for chain and transaction sync
- [x] REST API with Express for interacting with the node
- [x] Comprehensive test suite with Jest
- [ ] Swagger API documentation *(planned)*
- [ ] Data persistence *(planned)*
- [ ] Smart-contract engine *(planned)*
- [ ] Plugin system *(planned)*

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Language | TypeScript 4.0 |
| Runtime | Node.js >= 14.13 |
| HTTP Server | Express 4.17 |
| P2P Networking | ws 7.4 (WebSocket) |
| Cryptography | elliptic 6.5 (secp256k1), crypto-js 4.0 (SHA-256) |
| Identity | uuid 8.3 |
| Testing | Jest 26.6, ts-jest 26.4 |
| Linting | ESLint + Prettier |

## Getting Started

### Prerequisites

- Node.js >= 14.13
- Yarn (or npm)

### Installation

```bash
git clone https://github.com/Atypical-Consulting/ts-blockchain.git
cd ts-blockchain
yarn install
```

### Running

```bash
# Build and start the node (default port 3001)
yarn start

# Run tests with coverage
yarn test

# Start in watch mode for development
yarn build:watch
```

## Usage

### API Endpoints

```http
GET   /blocks              # Get the full blockchain
POST  /mine                # Mine a new block with arbitrary data
GET   /transactions        # List pending transactions in the pool
POST  /transact            # Create a new transaction
GET   /mine-transactions   # Mine all pending transactions into a block
GET   /public-key          # Get this node's public key
```

### Examples

**Get the blockchain:**

```bash
curl http://localhost:3001/blocks
```

**Create a transaction:**

```bash
curl -X POST http://localhost:3001/transact \
  -H "Content-Type: application/json" \
  -d '{"recipient": "04a1b2c3...", "amount": 50}'
```

**Mine pending transactions:**

```bash
curl http://localhost:3001/mine-transactions
```

**Mine a block with custom data:**

```bash
curl -X POST http://localhost:3001/mine \
  -H "Content-Type: application/json" \
  -d '{"data": "hello blockchain"}'
```

### Running Multiple Peers

Start additional nodes on different ports and connect them via WebSocket:

```bash
# Terminal 1 (default node)
yarn start

# Terminal 2 (second peer)
HTTP_PORT=3002 P2P_PORT=5002 PEERS=ws://localhost:5001 yarn start
```

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  REST API (Express)             │
│         /blocks  /mine  /transact  ...          │
└────────────────────┬────────────────────────────┘
                     │
        ┌────────────┼────────────────┐
        ▼            ▼                ▼
┌──────────┐  ┌─────────────┐  ┌───────────┐
│Blockchain│  │   Wallet    │  │Transaction│
│          │  │ (EC keys)   │  │   Pool    │
│ - chain  │  │ - sign      │  │ - pending │
│ - blocks │  │ - verify    │  │ - update  │
│ - valid. │  │ - balance   │  │ - clear   │
└────┬─────┘  └──────┬──────┘  └─────┬─────┘
     │               │               │
     └───────────┬───┘───────────────┘
                 ▼
       ┌──────────────────┐
       │  P2P Server (ws) │
       │ - sync chains    │
       │ - broadcast txns │
       │ - peer discovery │
       └──────────────────┘
```

### Project Structure

```
ts-blockchain/
├── src/
│   ├── app/
│   │   ├── index.ts              # Express server & route definitions
│   │   ├── miner.ts              # Mining logic (reward transactions)
│   │   └── p2p-server.ts         # WebSocket P2P server
│   ├── blockchain/
│   │   ├── block.ts              # Block class (hash, nonce, difficulty)
│   │   ├── block.test.ts         # Block unit tests
│   │   ├── index.ts              # Blockchain class (chain, validation)
│   │   └── index.test.ts         # Blockchain unit tests
│   ├── wallet/
│   │   ├── index.ts              # Wallet class (keys, signing, balance)
│   │   ├── index.test.ts         # Wallet unit tests
│   │   ├── transaction.ts        # Transaction class (inputs/outputs)
│   │   ├── transaction.test.ts   # Transaction unit tests
│   │   ├── transaction-pool.ts   # Transaction pool management
│   │   └── transaction-pool.test.ts
│   ├── chain-util.ts             # Crypto utilities (EC, hash, verify)
│   ├── config.ts                 # Constants (difficulty, mine rate, rewards)
│   ├── errors.ts                 # Custom error classes
│   └── dev-test.ts               # Development test script
├── .github/workflows/            # CI configuration (Qodana)
├── jest.config.js                # Jest test configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies and scripts
└── LICENSE                       # MIT License
```

## Roadmap

- [ ] Add Swagger/OpenAPI documentation
- [ ] Add data persistence (database layer)
- [ ] Build a smart-contract engine
- [ ] Implement a plugin system
- [ ] Add Docker support for easy deployment
- [ ] Improve peer discovery mechanism

> Want to contribute? Pick any roadmap item and open a PR!

## Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit using [conventional commits](https://www.conventionalcommits.org/) (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[MIT](LICENSE) (c) 2019 [Atypical Consulting](https://atypical.garry-ai.cloud)

## Acknowledgments

- [Node TypeScript Boilerplate](https://github.com/jsynowiec/node-typescript-boilerplate) for the project scaffolding
- The blockchain and cryptocurrency community for educational resources

---

Built with care by [Atypical Consulting](https://atypical.garry-ai.cloud) -- opinionated, production-grade open source.

[![Contributors](https://contrib.rocks/image?repo=Atypical-Consulting/ts-blockchain)](https://github.com/Atypical-Consulting/ts-blockchain/graphs/contributors)
