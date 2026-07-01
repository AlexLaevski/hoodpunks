# HoodPunks

Robinhood Chain-native NFT collection. Transaction entropy mutates HoodPunk pixel portraits on a bonding-curve-style identity rail.

Forked from the TX PUNKS concept — original project remains at `tx-punks-site`.

## Networks

| Network | Chain ID | RPC |
|---------|----------|-----|
| **Mainnet** | 4663 | `https://rpc.mainnet.chain.robinhood.com` |
| Testnet | 46630 | `https://rpc.testnet.chain.robinhood.com` |

## Get a transaction hash (testnet)

1. Open [Robinhood Chain Testnet Explorer](https://explorer.testnet.chain.robinhood.com)
2. Get test ETH from [faucet](https://faucet.testnet.chain.robinhood.com)
3. Send any transaction, or browse [Transactions](https://explorer.testnet.chain.robinhood.com/txs)
4. Open a tx page → copy **Transaction hash** (`0x…`)
5. Paste into the generator on the site → **Generate HoodPunk**

## Quick Start

```bash
cp .env.example .env.local
npm install
npm run dev
```

Deploy contracts:

```bash
npm run contracts:compile
npx hardhat run scripts/deploy.js --network robinhood
```

## Branding

- **HoodPunk** — single NFT identity
- **HoodPunks** — collection name
- Colors: Robinhood green `#00C805` on dark `#0A0F0D`