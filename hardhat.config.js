require("dotenv").config();
require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-network-helpers");
require("@nomicfoundation/hardhat-chai-matchers");

const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;
const MAINNET_RPC_URL =
  process.env.MAINNET_RPC_URL ||
  process.env.NEXT_PUBLIC_ROBINHOOD_RPC_URL ||
  "https://rpc.mainnet.chain.robinhood.com";
const TESTNET_RPC_URL =
  process.env.TESTNET_RPC_URL || "https://rpc.testnet.chain.robinhood.com";

const sharedAccounts = PRIVATE_KEY ? [PRIVATE_KEY] : [];

/** @type import("hardhat/config").HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  networks: {
    hardhat: {},
    robinhood: {
      url: MAINNET_RPC_URL,
      chainId: 4663,
      accounts: sharedAccounts,
    },
    robinhoodTestnet: {
      url: TESTNET_RPC_URL,
      chainId: 46630,
      accounts: sharedAccounts,
    },
  },
};
