const hre = require("hardhat");

async function main() {
  const { ethers } = hre;
  const contractAddress =
    process.env.HOODPUNKS_CONTRACT_ADDRESS ||
    process.env.NEXT_PUBLIC_HOODPUNKS_CONTRACT_ADDRESS;

  if (!contractAddress) {
    throw new Error("HOODPUNKS_CONTRACT_ADDRESS is not set.");
  }

  const contract = await ethers.getContractAt("HoodPunks", contractAddress);
  const tx = await contract.setPublicMintOpen(true);
  await tx.wait();

  console.log("Public mint opened for:", contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
