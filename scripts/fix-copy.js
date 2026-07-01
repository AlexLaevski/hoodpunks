const fs = require("fs");
const file = require("path").join(__dirname, "../src/components/hood-punks-app.tsx");
let c = fs.readFileSync(file, "utf8");

const pairs = [
  ["Paste a transaction hash, block hash, or Ethereum address.", "Paste a transaction hash, block hash, or Robinhood Chain address."],
  ["Ethereum RPC is unavailable right now.", "Robinhood Chain RPC is unavailable right now."],
  ["No injected Ethereum wallet found. Open the page in MetaMask or a browser wallet.", "No injected wallet found. Open the page in MetaMask or a browser wallet."],
  ["Ethereum wallet not found.", "Wallet not found."],
  ["Ethereum-native mutation collection", "Robinhood Chain-native mutation collection"],
  ["HOODPUNKS / punk silhouettes scarred by Ethereum", "HOODPUNKS / punk silhouettes scarred by Robinhood Chain"],
  ["Ethereum data mutates the face with heat, corruption, wealth", "On-chain data mutates the face with heat, corruption, wealth"],
  ["Real Ethereum RPC", "Robinhood Chain RPC"],
  ["Live TX Punk Generator", "Live HoodPunk Generator"],
  ["TX Input System", "Hood Input System"],
  ["Paste one Ethereum tx hash", "Paste one Robinhood Chain tx hash"],
  ["Generate TX Punk", "Generate HoodPunk"],
  ["hoodPunksChain.id === 11155111 ? \"Sepolia testnet\" : \"Ethereum mainnet\"", "hoodPunksChain.id === 46630 ? \"Robinhood testnet\" : \"Robinhood Chain mainnet\""],
  ["Generated TX Punk", "Generated HoodPunk"],
  ["Ethereum is alive and it leaves marks on every face", "Robinhood Chain is alive and it leaves marks on every face"],
  ["Ethereum RPC, then mapped into gas, status, entropy, and", "Robinhood Chain RPC, then mapped into gas, status, entropy, and"],
  ["If Ethereum survives, the punks survive.", "If the chain survives, the HoodPunks survive."],
  ["{ label: \"X / Twitter\", href: \"https://x.com/hoodpunks\" }", "{ label: \"X / Twitter\", href: \"https://x.com/hoodpunks\" }"],
  ["https://x.com/intent/follow?screen_name=hoodpunks", "https://x.com/intent/follow?screen_name=hoodpunks"],
  ["chainName: hoodPunksChain.id === 11155111 ? \"Sepolia\" : \"Ethereum Mainnet\"", "chainName: hoodPunksChain.name"],
  ["hoodPunksChain.id === 11155111", "hoodPunksChain.id === 46630"],
  ["11155111", "46630"],
  ["https://ethereum-sepolia-rpc.publicnode.com", "https://rpc.testnet.chain.robinhood.com"],
  ["https://ethereum-rpc.publicnode.com", "https://rpc.mainnet.chain.robinhood.com"],
  ["https://cloudflare-eth.com", "https://rpc.mainnet.chain.robinhood.com"],
  ["blockExplorerUrls: hoodPunksChain.id === 46630 ? [\"https://sepolia.etherscan.io\"] : [\"https://etherscan.io\"]", "blockExplorerUrls: [hoodPunksChain.blockExplorers.default.url]"],
];

for (const [from, to] of pairs) {
  c = c.split(from).join(to);
}

fs.writeFileSync(file, c, "utf8");
console.log("Fixed hood-punks-app copy.");