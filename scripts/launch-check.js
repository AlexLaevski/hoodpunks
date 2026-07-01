require("dotenv").config();
const hre = require("hardhat");

async function main() {
  const [signer] = await hre.ethers.getSigners();
  const balance = await hre.ethers.provider.getBalance(signer.address);
  const contract = process.env.NEXT_PUBLIC_HOODPUNKS_CONTRACT_ADDRESS;

  console.log("=== HoodPunks Launch Check ===");
  console.log("Deployer:", signer.address);
  console.log("Balance:", hre.ethers.formatEther(balance), "ETH");
  console.log("Contract:", contract || "(not deployed)");
  console.log("App URL:", process.env.APP_BASE_URL || "(not set)");
  const network = await hre.ethers.provider.getNetwork();
  console.log("Chain:", network.name, "chainId", network.chainId.toString());
  console.log("");

  if (balance === 0n) {
    console.log("BLOCKED: Fund deployer with ETH on this network");
    if (network.chainId === 46630n) {
      console.log("Faucet: https://faucet.testnet.chain.robinhood.com");
    } else {
      console.log("Bridge ETH to Robinhood Chain: https://robinhood.com/chain");
    }
    process.exit(1);
  }

  if (!contract) {
    console.log("NEXT: npm run launch");
    process.exit(1);
  }

  const hood = await hre.ethers.getContractAt("HoodPunks", contract);
  const [mintOpen, totalMinted, maxSupply] = await Promise.all([
    hood.publicMintOpen(),
    hood.totalMinted(),
    hood.maxSupply(),
  ]);

  console.log("Public mint:", mintOpen ? "OPEN" : "closed");
  console.log("Minted:", totalMinted.toString(), "/", maxSupply.toString());
  console.log("");
  console.log("READY: npm run dev → http://localhost:3000");
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});