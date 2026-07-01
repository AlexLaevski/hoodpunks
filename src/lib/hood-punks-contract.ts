import {
  custom,
  createPublicClient,
  createWalletClient,
  fallback,
  formatEther,
  http,
  parseEther,
} from "viem";
import { activeRobinhoodChain } from "./chains";

export const hoodPunksAbi = [
  {
    type: "event",
    name: "Transfer",
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: true, name: "tokenId", type: "uint256" },
    ],
  },
  {
    type: "function",
    name: "PUBLIC_MINT_PRICE",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "totalMinted",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "maxSupply",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "publicMintOpen",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "eligibleMintOpen",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "publicMaxPerWallet",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "eligibleMaxPerWallet",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "publicMintedByWallet",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "eligibleMintedByWallet",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "mintedTxHashes",
    stateMutability: "view",
    inputs: [{ name: "", type: "bytes32" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "tokenSourceHash",
    stateMutability: "view",
    inputs: [{ name: "", type: "uint256" }],
    outputs: [{ name: "", type: "bytes32" }],
  },
  {
    type: "function",
    name: "tokenURI",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "string" }],
  },
  {
    type: "function",
    name: "ownerOf",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "function",
    name: "publicMint",
    stateMutability: "payable",
    inputs: [{ name: "sourceTxHash", type: "bytes32" }],
    outputs: [],
  },
] as const;

export const hoodPunksContractAddress = process.env.NEXT_PUBLIC_HOODPUNKS_CONTRACT_ADDRESS as
  | `0x${string}`
  | undefined;

export const hoodPunksChain = activeRobinhoodChain;

const publicRpcUrls = [
  process.env.NEXT_PUBLIC_ROBINHOOD_RPC_URL,
  hoodPunksChain.rpcUrls.default.http[0],
].filter((value): value is string => Boolean(value));

export const hoodPunksPublicClient = createPublicClient({
  chain: hoodPunksChain,
  transport: fallback(publicRpcUrls.map((url) => http(url, { retryCount: 1, timeout: 8_000 }))),
});

export type MintState = {
  mintPriceWei: bigint;
  mintPriceEth: string;
  totalMinted: bigint;
  maxSupply: bigint;
  publicMintOpen: boolean;
  eligibleMintOpen: boolean;
  publicMaxPerWallet: bigint;
  eligibleMaxPerWallet: bigint;
  publicMintedByWallet: bigint;
  eligibleMintedByWallet: bigint;
};

export async function readMintState(account?: `0x${string}`): Promise<MintState | null> {
  if (!hoodPunksContractAddress) {
    return null;
  }

  const [
    mintPriceWei,
    totalMinted,
    maxSupply,
    publicMintOpen,
    eligibleMintOpen,
    publicMaxPerWallet,
    eligibleMaxPerWallet,
    publicMintedByWallet,
    eligibleMintedByWallet,
  ] = await Promise.all([
    hoodPunksPublicClient.readContract({
      address: hoodPunksContractAddress,
      abi: hoodPunksAbi,
      functionName: "PUBLIC_MINT_PRICE",
    }),
    hoodPunksPublicClient.readContract({
      address: hoodPunksContractAddress,
      abi: hoodPunksAbi,
      functionName: "totalMinted",
    }),
    hoodPunksPublicClient.readContract({
      address: hoodPunksContractAddress,
      abi: hoodPunksAbi,
      functionName: "maxSupply",
    }),
    hoodPunksPublicClient.readContract({
      address: hoodPunksContractAddress,
      abi: hoodPunksAbi,
      functionName: "publicMintOpen",
    }),
    hoodPunksPublicClient.readContract({
      address: hoodPunksContractAddress,
      abi: hoodPunksAbi,
      functionName: "eligibleMintOpen",
    }),
    hoodPunksPublicClient.readContract({
      address: hoodPunksContractAddress,
      abi: hoodPunksAbi,
      functionName: "publicMaxPerWallet",
    }),
    hoodPunksPublicClient.readContract({
      address: hoodPunksContractAddress,
      abi: hoodPunksAbi,
      functionName: "eligibleMaxPerWallet",
    }),
    account
      ? hoodPunksPublicClient.readContract({
          address: hoodPunksContractAddress,
          abi: hoodPunksAbi,
          functionName: "publicMintedByWallet",
          args: [account],
        })
      : Promise.resolve(0n),
    account
      ? hoodPunksPublicClient.readContract({
          address: hoodPunksContractAddress,
          abi: hoodPunksAbi,
          functionName: "eligibleMintedByWallet",
          args: [account],
        })
      : Promise.resolve(0n),
  ]);

  return {
    mintPriceWei,
    mintPriceEth: formatEther(mintPriceWei),
    totalMinted,
    maxSupply,
    publicMintOpen,
    eligibleMintOpen,
    publicMaxPerWallet,
    eligibleMaxPerWallet,
    publicMintedByWallet,
    eligibleMintedByWallet,
  };
}

export function publicMintValue() {
  return parseEther("0.002");
}

export type InjectedProvider = {
  request(args: { method: string; params?: unknown[] }): Promise<unknown>;
  on?: (event: string, listener: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, listener: (...args: unknown[]) => void) => void;
};

export function getInjectedProvider() {
  if (typeof window === "undefined") {
    return null;
  }

  return (window as Window & { ethereum?: InjectedProvider }).ethereum ?? null;
}

export function createInjectedWalletClient(provider: InjectedProvider) {
  return createWalletClient({
    chain: hoodPunksChain,
    transport: custom(provider),
  });
}