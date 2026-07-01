const hre = require("hardhat");

function trimTrailingSlash(value) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

async function main() {
  const { ethers } = hre;
  const contractAddress =
    process.env.HOODPUNKS_CONTRACT_ADDRESS ||
    process.env.NEXT_PUBLIC_HOODPUNKS_CONTRACT_ADDRESS;
  const appBaseUrl =
    process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_APP_BASE_URL;

  if (!contractAddress) {
    throw new Error("HOODPUNKS_CONTRACT_ADDRESS is not set.");
  }

  if (!appBaseUrl) {
    throw new Error("APP_BASE_URL is not set.");
  }

  const baseUrl = trimTrailingSlash(appBaseUrl);
  const tokenBaseUri = `${baseUrl}/api/metadata/`;
  const contractUri = `${baseUrl}/api/collection.json`;
  const collectionImageUri =
    process.env.COLLECTION_IMAGE_URI || `${baseUrl}/og/hood-punks.png`;
  const collectionBannerUri =
    process.env.COLLECTION_BANNER_URI || `${baseUrl}/og/hood-punks-banner.png`;

  const contract = await ethers.getContractAt("HoodPunks", contractAddress);

  const onchainTx = await contract.setOnchainMetadataEnabled(true);
  await onchainTx.wait();

  const baseTx = await contract.setBaseTokenURI(tokenBaseUri);
  await baseTx.wait();

  const contractTx = await contract.setContractMetadataURI(contractUri);
  await contractTx.wait();

  const presentationTx = await contract.setCollectionPresentation(
    baseUrl,
    collectionImageUri,
    collectionBannerUri
  );
  await presentationTx.wait();

  console.log("On-chain tokenURI is enabled.");
  console.log("Token base URI set to:", tokenBaseUri);
  console.log("Contract metadata URI set to:", contractUri);
  console.log("Collection external link set to:", baseUrl);
  console.log("Collection image URI set to:", collectionImageUri);
  console.log("Collection banner URI set to:", collectionBannerUri);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
