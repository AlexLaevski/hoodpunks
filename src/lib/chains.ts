import { defineChain } from "viem";

export const robinhoodMainnet = defineChain({
  id: 4663,
  name: "Robinhood Chain",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.mainnet.chain.robinhood.com"] },
    public: { http: ["https://rpc.mainnet.chain.robinhood.com"] },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: "https://robinhoodchain.blockscout.com",
    },
  },
});

export const robinhoodTestnet = defineChain({
  id: 46630,
  name: "Robinhood Chain Testnet",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.testnet.chain.robinhood.com"] },
    public: { http: ["https://rpc.testnet.chain.robinhood.com"] },
  },
  blockExplorers: {
    default: {
      name: "Robinhood Explorer",
      url: "https://explorer.testnet.chain.robinhood.com",
    },
  },
});

/** Mainnet by default */
export const activeRobinhoodChain =
  process.env.NEXT_PUBLIC_HOODPUNKS_CHAIN === "testnet"
    ? robinhoodTestnet
    : robinhoodMainnet;

export const isRobinhoodTestnet = activeRobinhoodChain.id === 46630;

export const robinhoodExplorerBase =
  activeRobinhoodChain.blockExplorers?.default.url ??
  "https://robinhoodchain.blockscout.com";

export const robinhoodFaucetUrl = isRobinhoodTestnet
  ? "https://faucet.testnet.chain.robinhood.com"
  : null;