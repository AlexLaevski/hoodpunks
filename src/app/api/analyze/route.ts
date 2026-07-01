import { type NextRequest, NextResponse } from "next/server";
import {
  createPublicClient,
  fallback,
  formatEther,
  formatGwei,
  http,
  isAddress,
  isHash,
  parseEther,
} from "viem";
import { activeRobinhoodChain } from "@/lib/chains";
import { deriveVisualArchetypeName, type HoodPunkAnalysis } from "@/lib/hood-punks";

const fallbackUrls = [
  process.env.NEXT_PUBLIC_ROBINHOOD_RPC_URL,
  activeRobinhoodChain.rpcUrls.default.http[0],
].filter((value): value is string => Boolean(value));

const publicClient = createPublicClient({
  chain: activeRobinhoodChain,
  transport: fallback(
    fallbackUrls.map((url) => http(url, { retryCount: 1, timeout: 8_000 })),
  ),
});

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function computeEntropyScore(seed: string) {
  const bytes = seed.replace(/^0x/, "");
  const counts = new Map<string, number>();
  for (const character of bytes) {
    counts.set(character, (counts.get(character) ?? 0) + 1);
  }

  const total = bytes.length || 1;
  let entropy = 0;
  for (const count of counts.values()) {
    const probability = count / total;
    entropy -= probability * Math.log2(probability);
  }

  return Math.round(clamp((entropy / 4) * 100, 0, 100));
}

function computeCongestionScore(transactionCount: number, gasUsedRatio: number, gasGwei: number) {
  const raw =
    transactionCount * 0.7 +
    gasUsedRatio * 45 +
    Math.min(gasGwei, 120) * 0.55;
  return Math.round(clamp(raw / 2, 0, 100));
}

function computeWalletSignal(nonce: number, valueEth: number) {
  const raw = Math.log10(Math.max(1, nonce + 1)) * 34 + Math.log10(Math.max(1, valueEth + 1)) * 18;
  return Math.round(clamp(raw, 0, 100));
}

function walletEraFromSignal(signal: number): HoodPunkAnalysis["walletEra"] {
  if (signal >= 70) {
    return "ancient";
  }
  if (signal >= 35) {
    return "seasoned";
  }
  return "fresh";
}

function corruptionLevelFromScores(
  status: HoodPunkAnalysis["status"],
  gasGwei: number,
  congestionScore: number,
  entropyScore: number,
) {
  if (
    status === "failed" ||
    (gasGwei >= 98 && congestionScore >= 95) ||
    (gasGwei >= 90 && congestionScore >= 92 && entropyScore >= 96)
  ) {
    return "corrupted";
  }
  if (gasGwei >= 24 || congestionScore >= 56 || entropyScore >= 66) {
    return "strained";
  }
  return "stable";
}

function mevSignalFromInputs(
  gasGwei: number,
  valueEth: number,
  congestionScore: number,
  nonce: number,
) {
  return gasGwei >= 40 && valueEth <= 0.25 && congestionScore >= 70 && nonce >= 20;
}

function buildTraits(
  analysis: Omit<HoodPunkAnalysis, "mutations" | "traits" | "title" | "archetype">,
) {
  const valueBand =
    analysis.valueEth >= 100
      ? "whale"
      : analysis.valueEth >= 10
        ? "large"
        : analysis.valueEth >= 1
          ? "mid"
          : "micro";
  const entropyBand =
    analysis.entropyScore >= 80
      ? "chaotic"
      : analysis.entropyScore >= 60
        ? "volatile"
        : analysis.entropyScore >= 35
          ? "measured"
          : "calm";
  const traits = [
    {
      label: "Gas Reactivity",
      value: `${analysis.gasGwei.toFixed(2)} gwei`,
      reason:
        analysis.gasGwei >= 35
          ? "High transaction gas injects heat scars, melting pixels, and burning eyes."
          : analysis.gasGwei <= 10
            ? "Low gas stabilizes the portrait into a cleaner, calmer face."
            : "Mid-range gas preserves the silhouette while adding measured stress.",
    },
    {
      label: "Network Congestion",
      value: `${analysis.congestionScore}/100`,
      reason:
        analysis.congestionScore >= 65
          ? "Busy blocks fragment the background with scanlines, static, and noise."
          : "Lower congestion keeps the geometry more controlled and readable.",
    },
    {
      label: "Whale Signal",
      value: analysis.whaleSignal ? `${analysis.valueEth.toFixed(3)} ETH` : "Dormant",
      reason: analysis.whaleSignal
        ? "Large value transfer unlocks gold corruption and sovereign cyber traits."
        : "Value size stays below the whale threshold, so prestige layers remain dormant.",
    },
    {
      label: "Execution Status",
      value: analysis.status,
      reason:
        analysis.status === "failed"
          ? "Failed transactions fracture the face with missing eyes and broken mouth lines."
          : analysis.status === "pending"
            ? "Pending state keeps the entity unresolved and slightly unstable."
            : "Confirmed execution locks the identity into a stable chain artifact.",
    },
    {
      label: "Wallet Era",
      value: analysis.walletEra,
      reason:
        analysis.walletEra === "ancient"
          ? "Strong activity history pushes the palette toward genesis-era monochrome."
          : analysis.walletEra === "seasoned"
            ? "Moderate historical signal keeps the portrait grounded but matured."
            : "Fresh wallets tend to preserve cleaner and less mythic aesthetics.",
    },
    {
      label: "Machine Pressure",
      value: analysis.mevSignal ? "Synthetic" : "Human-weighted",
      reason: analysis.mevSignal
        ? "High-speed conditions suggest bot-dense flow, so the eyes become more machine-like."
        : "No strong MEV pattern detected, so the portrait avoids extreme synthetic mutation.",
    },
    {
      label: "Value Band",
      value: valueBand,
      reason:
        valueBand === "whale"
          ? "Very large ETH transfer sizes bias the portrait toward prestige and rare metallic traits."
          : valueBand === "large"
            ? "Large value flow adds weight and status without necessarily triggering top rarity."
            : valueBand === "mid"
              ? "Mid-sized transfers keep the face balanced between ordinary and notable."
              : "Small transfers preserve a more understated and street-level punk feel.",
    },
    {
      label: "Entropy Band",
      value: entropyBand,
      reason:
        entropyBand === "chaotic"
          ? "Highly irregular byte distribution pushes the render toward unstable, noisy surfaces."
          : entropyBand === "volatile"
            ? "Entropy is elevated enough to bend the face into more aggressive visual variation."
            : entropyBand === "measured"
              ? "The input has enough variation to stay interesting without destroying readability."
              : "Low entropy keeps the portrait grounded and close to its default anatomy.",
    },
    {
      label: "Wallet Signal",
      value: `${analysis.walletSignal}/100`,
      reason:
        analysis.walletSignal >= 70
          ? "Strong address history makes the portrait feel established and historically anchored."
          : analysis.walletSignal >= 35
            ? "Moderate signal introduces maturity without overpowering the silhouette."
            : "Lower signal keeps the identity closer to a fresh, unburdened state.",
    },
    {
      label: "Nonce Signature",
      value: `${analysis.nonce}`,
      reason:
        analysis.nonce >= 500
          ? "Heavy nonce history suggests repeated interaction, giving the face a more lived-in identity."
          : analysis.nonce >= 50
            ? "Moderate account usage supports a more active but still readable persona."
            : "Lower nonce keeps the face less worn and more minimal.",
    },
  ];

  const mutations = [
    {
      name: analysis.gasGwei >= 35 ? "Thermal burn" : "Calm shell",
      detail:
        analysis.gasGwei >= 35
          ? "Gas pressure scorches the skin map and pushes hot overlays into the eyes."
          : "Gas stays controlled, keeping the anatomy clean and legible.",
      intensity: analysis.gasGwei >= 35 ? "high" : "low",
    },
    {
      name: analysis.congestionScore >= 65 ? "Static fracture" : "Stable frame",
      detail:
        analysis.congestionScore >= 65
          ? "Busy block conditions break the portrait into scanlines and dust noise."
          : "Block flow remains calm enough to preserve a stable composition.",
      intensity: analysis.congestionScore >= 65 ? "high" : "low",
    },
    {
      name: analysis.whaleSignal ? "Sovereign alloy" : "No crown",
      detail: analysis.whaleSignal
        ? "Whale-sized value activates gold metals and high-rarity prestige marks."
        : "Transfer size does not cross the prestige threshold.",
      intensity: analysis.whaleSignal ? "medium" : "low",
    },
    {
      name: analysis.status === "failed" ? "Render collapse" : "Chain lock",
      detail:
        analysis.status === "failed"
          ? "A failed execution corrupts eyes, mouths, and interior pixel structure."
          : "Successful confirmation keeps the identity chain-anchored.",
      intensity: analysis.status === "failed" ? "high" : "low",
    },
  ] as HoodPunkAnalysis["mutations"];

  return { traits, mutations };
}

function titleForKind(kind: HoodPunkAnalysis["kind"]) {
  if (kind === "address") {
    return "Wallet-derived entity";
  }
  if (kind === "block") {
    return "Block-born entity";
  }
  return "Transaction-born entity";
}

type AnalysisBase = Omit<HoodPunkAnalysis, "mutations" | "traits">;

async function analyzeTransaction(hash: `0x${string}`): Promise<HoodPunkAnalysis> {
  const [tx, receipt, latestBlock] = await Promise.all([
    publicClient.getTransaction({ hash }),
    publicClient.getTransactionReceipt({ hash }),
    publicClient.getBlock({ blockTag: "latest" }),
  ]);

  const [block, senderNonce] = await Promise.all([
    publicClient.getBlock({ blockNumber: tx.blockNumber ?? receipt.blockNumber }),
    publicClient.getTransactionCount({ address: tx.from, blockTag: "latest" }),
  ]);

  const gasPriceWei = tx.gasPrice ?? tx.maxFeePerGas ?? latestBlock.baseFeePerGas ?? 0n;
  const gasGwei = Number.parseFloat(formatGwei(gasPriceWei));
  const valueEth = Number.parseFloat(formatEther(tx.value));
  const gasUsedRatio =
    block.gasLimit === 0n ? 0 : Number(block.gasUsed) / Number(block.gasLimit);
  const congestionScore = computeCongestionScore(
    block.transactions.length,
    gasUsedRatio,
    gasGwei,
  );
  const entropyScore = computeEntropyScore(`${hash}${block.hash ?? ""}`);
  const walletSignal = computeWalletSignal(senderNonce, valueEth);
  const status: HoodPunkAnalysis["status"] =
    receipt.status === "success" ? "confirmed" : "failed";
  const base: AnalysisBase = {
    kind: "transaction" as const,
    query: hash,
    network: "robinhood" as const,
    rpcSource: fallbackUrls[0] ?? "public-rpc",
    seed: `${hash}${block.hash ?? ""}`,
    title: titleForKind("transaction"),
    archetype: deriveVisualArchetypeName(`${hash}${block.hash ?? ""}`),
    timestampIso: new Date(Number(block.timestamp) * 1000).toISOString(),
    blockNumber: receipt.blockNumber.toString(),
    gasGwei,
    valueEth,
    nonce: Number(tx.nonce),
    entropyScore,
    congestionScore,
    walletSignal,
    status,
    corruptionLevel: corruptionLevelFromScores(
      status,
      gasGwei,
      congestionScore,
      entropyScore,
    ),
    walletEra: walletEraFromSignal(walletSignal),
    whaleSignal: tx.value >= parseEther("50"),
    mevSignal: mevSignalFromInputs(
      gasGwei,
      valueEth,
      congestionScore,
      Number(tx.nonce),
    ),
  };

  return {
    ...base,
    ...buildTraits(base),
  };
}

async function analyzeAddress(address: `0x${string}`): Promise<HoodPunkAnalysis> {
  const [latestBlock, balance, nonce, code] = await Promise.all([
    publicClient.getBlock({ blockTag: "latest" }),
    publicClient.getBalance({ address }),
    publicClient.getTransactionCount({ address }),
    publicClient.getCode({ address }),
  ]);

  const gasGwei = Number.parseFloat(
    formatGwei(latestBlock.baseFeePerGas ?? 0n),
  );
  const valueEth = Number.parseFloat(formatEther(balance));
  const gasUsedRatio =
    latestBlock.gasLimit === 0n
      ? 0
      : Number(latestBlock.gasUsed) / Number(latestBlock.gasLimit);
  const congestionScore = computeCongestionScore(
    latestBlock.transactions.length,
    gasUsedRatio,
    gasGwei,
  );
  const entropyScore = computeEntropyScore(`${address}${latestBlock.hash ?? ""}`);
  const walletSignal = computeWalletSignal(nonce, valueEth);
  const status: HoodPunkAnalysis["status"] = "confirmed";
  const base: AnalysisBase = {
    kind: "address" as const,
    query: address,
    network: "robinhood" as const,
    rpcSource: fallbackUrls[0] ?? "public-rpc",
    seed: `${address}${latestBlock.hash ?? ""}`,
    title: code === "0x" ? "Wallet-derived entity" : "Contract-derived entity",
    archetype: deriveVisualArchetypeName(`${address}${latestBlock.hash ?? ""}`),
    timestampIso: new Date(Number(latestBlock.timestamp) * 1000).toISOString(),
    blockNumber: latestBlock.number.toString(),
    gasGwei,
    valueEth,
    nonce,
    entropyScore,
    congestionScore,
    walletSignal,
    status,
    corruptionLevel: corruptionLevelFromScores(
      status,
      gasGwei,
      congestionScore,
      entropyScore,
    ),
    walletEra: walletEraFromSignal(walletSignal),
    whaleSignal: balance >= parseEther("100"),
    mevSignal: mevSignalFromInputs(gasGwei, valueEth, congestionScore, nonce),
  };

  return {
    ...base,
    ...buildTraits(base),
  };
}

async function analyzeBlock(blockHash: `0x${string}`): Promise<HoodPunkAnalysis> {
  const [block, latestBlock] = await Promise.all([
    publicClient.getBlock({ blockHash }),
    publicClient.getBlock({ blockTag: "latest" }),
  ]);

  const gasGwei = Number.parseFloat(
    formatGwei(block.baseFeePerGas ?? latestBlock.baseFeePerGas ?? 0n),
  );
  const gasUsedRatio =
    block.gasLimit === 0n ? 0 : Number(block.gasUsed) / Number(block.gasLimit);
  const congestionScore = computeCongestionScore(
    block.transactions.length,
    gasUsedRatio,
    gasGwei,
  );
  const entropyScore = computeEntropyScore(`${block.hash ?? ""}${block.parentHash}`);
  const valueEth = block.transactions.length / 10;
  const nonce = block.transactions.length;
  const walletSignal = computeWalletSignal(nonce, valueEth);
  const status: HoodPunkAnalysis["status"] = "confirmed";
  const base: AnalysisBase = {
    kind: "block" as const,
    query: blockHash,
    network: "robinhood" as const,
    rpcSource: fallbackUrls[0] ?? "public-rpc",
    seed: `${block.hash ?? ""}${block.parentHash}`,
    title: titleForKind("block"),
    archetype: deriveVisualArchetypeName(`${block.hash ?? ""}${block.parentHash}`),
    timestampIso: new Date(Number(block.timestamp) * 1000).toISOString(),
    blockNumber: (block.number ?? 0n).toString(),
    gasGwei,
    valueEth,
    nonce,
    entropyScore,
    congestionScore,
    walletSignal,
    status,
    corruptionLevel: corruptionLevelFromScores(
      status,
      gasGwei,
      congestionScore,
      entropyScore,
    ),
    walletEra: walletEraFromSignal(walletSignal),
    whaleSignal: block.transactions.length >= 240,
    mevSignal: mevSignalFromInputs(gasGwei, valueEth, congestionScore, nonce),
  };

  return {
    ...base,
    ...buildTraits(base),
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { query?: string };
    const query = body.query?.trim();

    if (!query) {
      return NextResponse.json(
        { error: "Paste a transaction hash, wallet address, or block hash." },
        { status: 400 },
      );
    }

    let analysis: HoodPunkAnalysis;
    if (isAddress(query)) {
      analysis = await analyzeAddress(query);
    } else if (isHash(query)) {
      try {
        analysis = await analyzeTransaction(query);
      } catch {
        analysis = await analyzeBlock(query);
      }
    } else {
      return NextResponse.json(
        { error: "Input must be a valid transaction hash, block hash, or Robinhood Chain address." },
        { status: 400 },
      );
    }

    return NextResponse.json(analysis);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not reach Robinhood Chain RPC right now.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
