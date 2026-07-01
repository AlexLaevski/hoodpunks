import { NextRequest, NextResponse } from "next/server";
import {
  buildPunkSvg,
  deriveRarityProfile,
  deriveSpecialTraits,
  deriveVisualArchetypeName,
  type HoodPunkAnalysis,
} from "@/lib/hood-punks";
import {
  hoodPunksAbi,
  hoodPunksContractAddress,
  hoodPunksPublicClient,
} from "@/lib/hood-punks-contract";

function absoluteOrigin(requestUrl: string) {
  return new URL(requestUrl).origin;
}

function buildAttributeList(analysis: HoodPunkAnalysis) {
  const rarity = deriveRarityProfile(analysis);
  const specialTraits = deriveSpecialTraits(analysis);
  return [
    { trait_type: "Archetype", value: analysis.archetype },
    { trait_type: "Rarity", value: rarity.tier },
    { trait_type: "Rarity Drivers", value: rarity.triggers.join(" / ") },
    ...(specialTraits.identityClass
      ? [{ trait_type: "Identity Class", value: specialTraits.identityClass }]
      : []),
    ...(specialTraits.headwear
      ? [{ trait_type: "Headwear", value: specialTraits.headwear }]
      : []),
    ...(specialTraits.hoodie
      ? [{ trait_type: "Hoodie", value: specialTraits.hoodie }]
      : []),
    ...(specialTraits.backdrop
      ? [{ trait_type: "Backdrop", value: specialTraits.backdrop }]
      : []),
    ...(specialTraits.specialSignal
      ? [{ trait_type: "Special Signal", value: specialTraits.specialSignal }]
      : []),
    { trait_type: "Corruption", value: analysis.corruptionLevel },
    { trait_type: "Wallet Era", value: analysis.walletEra },
    { trait_type: "Status", value: analysis.status },
    { trait_type: "Whale Signal", value: analysis.whaleSignal ? "Active" : "Dormant" },
    { trait_type: "MEV Pressure", value: analysis.mevSignal ? "Synthetic" : "Human-weighted" },
    { display_type: "number", trait_type: "Gas Gwei", value: Number(analysis.gasGwei.toFixed(2)) },
    { display_type: "number", trait_type: "Entropy Score", value: analysis.entropyScore },
    { display_type: "number", trait_type: "Congestion Score", value: analysis.congestionScore },
    { display_type: "number", trait_type: "Wallet Signal", value: analysis.walletSignal },
    ...analysis.traits.map((trait) => ({
      trait_type: trait.label,
      value: trait.value,
    })),
  ];
}

function fallbackAnalysisForToken(
  tokenId: string,
  sourceTxHash: `0x${string}`,
): HoodPunkAnalysis {
  const lastByte = Number.parseInt(sourceTxHash.slice(-2), 16) || 0;
  const gasGwei = Number(((lastByte % 18) + 4) * 1.15);
  const entropyScore = 55 + (lastByte % 45);
  const congestionScore = 28 + (lastByte % 48);
  const walletSignal = 35 + (lastByte % 60);
  const fallbackSeed = `${sourceTxHash}-token-${tokenId}`;

  return {
    kind: "transaction",
    query: sourceTxHash,
    network: "robinhood",
    rpcSource: "fallback-token-viewer",
    seed: fallbackSeed,
    title: "Minted HOODPUNK",
    archetype: deriveVisualArchetypeName(fallbackSeed),
    timestampIso: new Date().toISOString(),
    blockNumber: "0",
    gasGwei,
    valueEth: 0,
    nonce: lastByte * 3,
    entropyScore,
    congestionScore,
    walletSignal,
    status: "confirmed",
    corruptionLevel:
      congestionScore >= 72 ? "strained" : gasGwei >= 20 ? "strained" : "stable",
    walletEra: walletSignal >= 70 ? "ancient" : walletSignal >= 45 ? "seasoned" : "fresh",
    whaleSignal: false,
    mevSignal: false,
    mutations: [
      {
        name: "Viewer fallback",
        detail:
          "This local preview was reconstructed from the minted source hash while live chain analysis was unavailable.",
        intensity: "low",
      },
    ],
    traits: [
      {
        label: "Metadata Mode",
        value: "fallback preview",
        reason:
          "The token viewer could not pull a fresh analysis snapshot, so it generated a deterministic preview from the minted source hash.",
      },
      {
        label: "Source Hash",
        value: `${sourceTxHash.slice(0, 10)}...${sourceTxHash.slice(-6)}`,
        reason:
          "The minted source transaction still anchors this portrait even when the metadata viewer falls back to local reconstruction.",
      },
      {
        label: "Entropy Band",
        value: `${entropyScore}/100`,
        reason:
          "Byte distribution from the source hash still shapes the punk silhouette and mutation pressure.",
      },
      {
        label: "Congestion Proxy",
        value: `${congestionScore}/100`,
        reason:
          "A deterministic congestion proxy keeps the preview readable until full metadata analysis is available again.",
      },
    ],
  };
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<Record<string, string | string[] | undefined>> },
) {
  if (!hoodPunksContractAddress) {
    return NextResponse.json({ error: "Contract address is not configured." }, { status: 500 });
  }

  const tokenIdValue = (await context.params).tokenId;
  const tokenId = Array.isArray(tokenIdValue) ? tokenIdValue[0] : tokenIdValue;
  if (typeof tokenId !== "string" || !/^\d+$/.test(tokenId)) {
    return NextResponse.json({ error: "Invalid token id." }, { status: 400 });
  }

  const parsedTokenId = BigInt(tokenId);

  try {
    const sourceTxHash = await hoodPunksPublicClient.readContract({
      address: hoodPunksContractAddress,
      abi: hoodPunksAbi,
      functionName: "tokenSourceHash",
      args: [parsedTokenId],
    });

    if (sourceTxHash === "0x0000000000000000000000000000000000000000000000000000000000000000") {
      return NextResponse.json({ error: "Token has not been minted." }, { status: 404 });
    }

    const origin = absoluteOrigin(request.url);
    const analysisResponse = await fetch(`${origin}/api/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: sourceTxHash }),
      cache: "no-store",
    });

    const analysisPayload = (await analysisResponse.json()) as HoodPunkAnalysis | { error: string };
    const resolvedAnalysis =
      analysisResponse.ok && !("error" in analysisPayload)
        ? analysisPayload
        : fallbackAnalysisForToken(tokenId, sourceTxHash);

    const image = buildPunkSvg(resolvedAnalysis, { mode: "legacy" });
    const metadata = {
      name: `HOODPUNK #${tokenId}`,
      description:
        "A transaction-born HOODPUNK minted from a unique Robinhood Chain transaction hash. Chain activity shapes the portrait, while the punk silhouette stays collectible and readable.",
      external_url: `${origin}/token/${tokenId}`,
      image,
      background_color: "040506",
      attributes: buildAttributeList(resolvedAnalysis),
      properties: {
        source_tx_hash: sourceTxHash,
        archetype: resolvedAnalysis.archetype,
        network: resolvedAnalysis.network,
        block_number: resolvedAnalysis.blockNumber,
      },
    };

    return NextResponse.json(metadata, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Could not build token metadata.",
      },
      { status: 500 },
    );
  }
}
