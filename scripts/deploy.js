const hre = require("hardhat");

async function main() {
  const { ethers } = hre;
  const [deployer] = await ethers.getSigners();
  const metadataLibrary = await ethers.deployContract("HoodPunksMetadata");
  await metadataLibrary.waitForDeployment();
  const factory = await ethers.getContractFactory("HoodPunks", {
    libraries: {
      HoodPunksMetadata: await metadataLibrary.getAddress(),
    },
  });

  const contract = await factory.deploy(
    10000,
    deployer.address,
    "ipfs://hoodpunks/"
  );

  await contract.waitForDeployment();

  const address = await contract.getAddress();
  const network = await ethers.provider.getNetwork();
  console.log("Network:", network.name, "chainId", network.chainId.toString());
  console.log("HoodPunks deployed to:", address);
  console.log("Owner:", deployer.address);
  console.log("Mint price:", ethers.formatEther(await contract.PUBLIC_MINT_PRICE()), "ETH");
  console.log("\nAdd to .env:");
  console.log(`NEXT_PUBLIC_HOODPUNKS_CONTRACT_ADDRESS=${address}`);
  console.log(`HOODPUNKS_CONTRACT_ADDRESS=${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
