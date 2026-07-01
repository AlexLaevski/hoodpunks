"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { decodeEventLog, isHash } from "viem";
import {
  buildPunkSvg,
  buildSpecimenGallery,
  deriveRarityProfile,
  type MutationDescriptor,
  type RarityTier,
  type TraitExplanation,
  type HoodPunkAnalysis,
} from "@/lib/hood-punks";
import {
  createInjectedWalletClient,
  getInjectedProvider,
  publicMintValue,
  readMintState,
  hoodPunksAbi,
  hoodPunksChain,
  hoodPunksContractAddress,
  hoodPunksPublicClient,
  type MintState,
} from "@/lib/hood-punks-contract";
import { robinhoodExplorerBase } from "@/lib/chains";
import { TxHashGuide } from "@/components/tx-hash-guide";

const cinematicSteps = [
  "Reading entropy...",
  "Parsing transaction...",
  "Extracting gas signatures...",
  "Rendering identity...",
  "Stabilizing entity...",
];

const mutationSections = [
  {
    key: "positive",
    label: "Positive",
    accent: "border-[#00C805]/20 bg-[#00C805]/8 text-[#d4f5d6]",
    badge: "text-[#00C805]",
  },
  {
    key: "neutral",
    label: "Neutral",
    accent: "border-[#4a6b52]/20 bg-[#4a6b52]/8 text-[#b8c9bb]",
    badge: "text-[#4a6b52]",
  },
  {
    key: "damage",
    label: "Damage",
    accent: "border-[#ff8757]/24 bg-[#ff8757]/8 text-[#ffd5c3]",
    badge: "text-[#ff8757]",
  },
] as const;

const traitColumns = [
  {
    title: "Gas Reactivity",
    body: "High gas mints ignite the portrait with thermal scars, molten pixels, and heated eyes. Low gas keeps the silhouette cleaner and calmer.",
  },
  {
    title: "Network Congestion",
    body: "Busy blocks fracture the frame with scanlines, static, and fragmentation. Quiet blocks preserve geometry and reduce noise.",
  },
  {
    title: "Whale Signal",
    body: "Large value movement activates crown logic, gold alloys, and prestige cybernetics without breaking readability.",
  },
  {
    title: "Failed Transactions",
    body: "Reverted execution becomes visual damage: broken mouths, dead eyes, and corrupted facial structure.",
  },
  {
    title: "Ancient Wallets",
    body: "Older activity signals push the portrait toward genesis palettes, monochrome treatments, and fossil aesthetics.",
  },
  {
    title: "MEV Pressure",
    body: "Machine-dense flow generates synthetic eyes, rigid symmetry, and hyper-distorted mechanical stress.",
  },
];

const navItems = [
  { label: "Generator", href: "#generator" },
  { label: "Mint", href: "#mint" },
  { label: "Trait Logic", href: "#traits" },
  { label: "Lore", href: "#lore" },
  { label: "Roadmap", href: "#roadmap" },
];

const socialLinks = [
  { label: "X / Twitter", href: "https://x.com/hoodpunks" },
  { label: "Follow Intent", href: "https://x.com/intent/follow?screen_name=hoodpunks" },
];

type MintedTokenPreview = {
  tokenId: number;
  sourceTxHash: `0x${string}`;
  image: string;
  title: string;
  rarity?: string;
  rarityDrivers?: string;
  metadataUrl: string;
  viewUrl: string;
  explorerUrl: string;
  mintedAtIso: string;
};

type MintedCollectionToken = MintedTokenPreview & {
  archetype?: string;
  corruption?: string;
};
type MintedCollectionMode = "all" | "mine";

const mintedPreviewStorageKey = "hoodpunks:last-minted-preview";
type MintSourceAvailability = "idle" | "checking" | "available" | "used";

const corruptionMeta: Record<
  HoodPunkAnalysis["corruptionLevel"],
  {
    tone: string;
    detail: string;
  }
> = {
  stable: {
    tone: "border-[#00C805]/25 bg-[#00C805]/8",
    detail:
      "Chain conditions stay calm, so the anatomy remains clean while only light signal layers show through.",
  },
  strained: {
    tone: "border-[#4a6b52]/25 bg-[#4a6b52]/10",
    detail:
      "The portrait is under pressure, but it still reads clearly while congestion, heat, and entropy start to scar the surface.",
  },
  corrupted: {
    tone: "border-[#ff8757]/30 bg-[#ff8757]/10",
    detail:
      "Execution stress is strong enough to push visible damage into the face, but the silhouette still holds together as a collectible punk.",
  },
};

const rarityTone: Record<
  RarityTier,
  { pill: string; panel: string; text: string }
> = {
  Common: {
    pill: "border-white/14 bg-white/[0.045] text-white/78",
    panel: "border-white/10 bg-white/[0.035]",
    text: "text-white/65",
  },
  Rare: {
    pill: "border-[#2d5a35]/45 bg-[#0f1a14] text-[#b9d6ff]",
    panel: "border-[#2d5a35]/24 bg-[#2d5a35]/10",
    text: "text-[#b8c9bb]",
  },
  "Very Rare": {
    pill: "border-[#00C805]/48 bg-[#0a1a0f] text-[#b8ffee]",
    panel: "border-[#00C805]/24 bg-[#00C805]/10",
    text: "text-[#d4f5d6]",
  },
  Legendary: {
    pill: "border-[#f0c232]/58 bg-[#2b1e06] text-[#ffe07a]",
    panel: "border-[#f0c232]/28 bg-[#f0c232]/10",
    text: "text-[#ffe7a3]",
  },
};

function rarityToneForLabel(label?: string) {
  if (label === "Legendary") {
    return rarityTone.Legendary;
  }
  if (label === "Very Rare") {
    return rarityTone["Very Rare"];
  }
  if (label === "Rare") {
    return rarityTone.Rare;
  }
  return rarityTone.Common;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function Metric({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/4 p-4">
      <div className="text-[0.68rem] uppercase tracking-[0.32em] text-white/45">
        {label}
      </div>
      <div
        className={`mt-2 text-xl font-semibold tracking-[0.04em] ${
          accent ? "text-[#00C805]" : "text-white"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function TraitCard({ trait }: { trait: TraitExplanation }) {
  return (
    <div className="rounded-[1.4rem] border border-white/10 bg-black/40 p-5 backdrop-blur-sm">
      <div className="text-[0.7rem] uppercase tracking-[0.28em] text-[#00C805]">
        {trait.label}
      </div>
      <div className="mt-3 text-lg font-semibold text-white">{trait.value}</div>
      <p className="mt-2 text-sm leading-6 text-white/66">{trait.reason}</p>
    </div>
  );
}

function MutationPill({ mutation }: { mutation: MutationDescriptor }) {
  const tone =
    mutation.intensity === "high"
      ? "border-[#ff8757]/40 bg-[#ff8757]/10 text-[#ffd0ba]"
      : mutation.intensity === "medium"
        ? "border-[#00C805]/30 bg-[#00C805]/10 text-[#d4f5d6]"
        : "border-[#4a6b52]/25 bg-[#4a6b52]/10 text-[#b8c9bb]";

  return (
    <div className={`rounded-[1.2rem] border px-4 py-3 text-sm leading-6 ${tone}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium">{mutation.name}</span>
        <span className="rounded-full border border-white/10 bg-black/30 px-2 py-0.5 text-[0.62rem] uppercase tracking-[0.22em] text-white/70">
          ACTIVE
        </span>
      </div>
      <div className="mt-1 text-white/45">{" / "}</div>
      <span>{mutation.detail}</span>
    </div>
  );
}

function classifyMutation(mutation: MutationDescriptor) {
  const needle = `${mutation.name} ${mutation.detail}`.toLowerCase();

  if (
    needle.includes("burn") ||
    needle.includes("fracture") ||
    needle.includes("corrupt") ||
    needle.includes("broken") ||
    needle.includes("static") ||
    needle.includes("damage") ||
    needle.includes("dead") ||
    needle.includes("failed") ||
    needle.includes("scar")
  ) {
    return "damage";
  }

  if (
    needle.includes("calm") ||
    needle.includes("quiet") ||
    needle.includes("chain lock") ||
    needle.includes("no crown") ||
    needle.includes("shell") ||
    needle.includes("stable") ||
    needle.includes("clean")
  ) {
    return "positive";
  }

  return "neutral";
}

function formatWalletError(caughtError: unknown) {
  if (caughtError instanceof Error && caughtError.message) {
    return caughtError.message;
  }

  if (
    typeof caughtError === "object" &&
    caughtError !== null &&
    "message" in caughtError &&
    typeof (caughtError as { message?: unknown }).message === "string"
  ) {
    return (caughtError as { message: string }).message;
  }

  if (
    typeof caughtError === "object" &&
    caughtError !== null &&
    "shortMessage" in caughtError &&
    typeof (caughtError as { shortMessage?: unknown }).shortMessage === "string"
  ) {
    return (caughtError as { shortMessage: string }).shortMessage;
  }

  return "Mint transaction failed.";
}

export function HoodPunksApp() {
  const router = useRouter();
  const specimens = buildSpecimenGallery("legacy");
  const [query, setQuery] = useState("");
  const [analysis, setAnalysis] = useState<HoodPunkAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState<`0x${string}` | null>(null);
  const [mintSourceTx, setMintSourceTx] = useState("");
  const [mintState, setMintState] = useState<MintState | null>(null);
  const [mintError, setMintError] = useState<string | null>(null);
  const [mintMessage, setMintMessage] = useState<string | null>(null);
  const [isMintLoading, setIsMintLoading] = useState(false);
  const [isWalletBusy, setIsWalletBusy] = useState(false);
  const [isRefreshingMintState, setIsRefreshingMintState] = useState(false);
  const [mintedPreview, setMintedPreview] = useState<MintedTokenPreview | null>(null);
  const [mintSourceAvailability, setMintSourceAvailability] =
    useState<MintSourceAvailability>("idle");
  const [mintedCollection, setMintedCollection] = useState<MintedCollectionToken[]>([]);
  const [isCollectionLoading, setIsCollectionLoading] = useState(false);
  const [mintedCollectionMode, setMintedCollectionMode] =
    useState<MintedCollectionMode>("all");
  const [headerTapCount, setHeaderTapCount] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    const interval = window.setInterval(() => {
      setLoadingStep((step) => (step + 1) % cinematicSteps.length);
    }, 850);

    return () => window.clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    if (headerTapCount >= 10) {
      router.push("/operator-blackbook");
      setHeaderTapCount(0);
    }
  }, [headerTapCount, router]);

  useEffect(() => {
    let active = true;

    async function hydrateMintState() {
      try {
        const nextState = await readMintState(walletAddress ?? undefined);
        if (active) {
          setMintState(nextState);
        }
      } catch (caughtError) {
        if (active) {
          setMintError(
            caughtError instanceof Error
              ? caughtError.message
              : "Could not load contract state.",
          );
        }
      }
    }

    hydrateMintState();

    return () => {
      active = false;
    };
  }, [walletAddress]);

  useEffect(() => {
    const provider = getInjectedProvider();
    if (!provider) {
      return;
    }
    const injectedProvider = provider;

    let active = true;

    async function hydrateConnectedAccounts() {
      try {
        const accounts = await injectedProvider.request({ method: "eth_accounts" });
        const nextAccount =
          Array.isArray(accounts) && typeof accounts[0] === "string"
            ? (accounts[0] as `0x${string}`)
            : null;
        if (active) {
          setWalletAddress(nextAccount);
        }
      } catch {
        // Ignore silent wallet hydration failures on load.
      }
    }

    void hydrateConnectedAccounts();

    if (!injectedProvider.on) {
      return () => {
        active = false;
      };
    }

    const handleAccountsChanged = (accounts: unknown) => {
      const nextAccount = Array.isArray(accounts) && typeof accounts[0] === "string"
        ? (accounts[0] as `0x${string}`)
        : null;
      setWalletAddress(nextAccount);
    };

    injectedProvider.on("accountsChanged", handleAccountsChanged);

    return () => {
      active = false;
      injectedProvider.removeListener?.("accountsChanged", handleAccountsChanged);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const savedPreview = window.localStorage.getItem(mintedPreviewStorageKey);
    if (!savedPreview) {
      window.localStorage.removeItem(mintedPreviewStorageKey);
      return;
    }

    try {
      setMintedPreview((currentPreview) => {
        if (currentPreview) {
          return currentPreview;
        }

        return JSON.parse(savedPreview) as MintedTokenPreview;
      });
    } catch {
      window.localStorage.removeItem(mintedPreviewStorageKey);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!mintedPreview) {
      window.localStorage.removeItem(mintedPreviewStorageKey);
      return;
    }

    window.localStorage.setItem(mintedPreviewStorageKey, JSON.stringify(mintedPreview));
  }, [mintedPreview]);

  const image = analysis ? buildPunkSvg(analysis, { mode: "legacy" }) : specimens[0].image;
  const currentCorruptionLevel =
    analysis?.corruptionLevel ?? specimens[0].corruptionLevel;
  const currentCorruptionMeta = corruptionMeta[currentCorruptionLevel];
  const currentRarity = deriveRarityProfile(analysis ?? specimens[0]);
  const currentRarityTone = rarityTone[currentRarity.tier];
  const hasRareHit =
    currentRarity.tier === "Very Rare" || currentRarity.tier === "Legendary";
  const rareHitCopy =
    currentRarity.tier === "Legendary"
      ? "Legendary hit. This tx opened a stacked rarity branch."
      : "Rare hit. This tx unlocked a low-frequency identity branch.";

  async function generate(nextQuery?: string) {
    const finalQuery = (nextQuery ?? query).trim();
    if (!finalQuery) {
      setError("Paste a transaction hash, block hash, or Robinhood Chain address.");
      return;
    }

    setError(null);
    setLoadingStep(0);
    setIsLoading(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: finalQuery }),
      });
      const payload = (await response.json()) as HoodPunkAnalysis | { error: string };
      if (!response.ok || "error" in payload) {
        throw new Error("error" in payload ? payload.error : "Generation failed.");
      }
      setAnalysis(payload);
    } catch (caughtError) {
      setAnalysis(null);
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Robinhood Chain RPC is unavailable right now.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  const currentTraits = [
    ...(analysis?.traits ?? specimens[0].traits),
    {
      label: "Rarity",
      value: currentRarity.tier,
      reason: `${currentRarity.detail} Triggered by: ${currentRarity.triggers.join(", ")}.`,
    },
  ];
  const currentMutations = analysis?.mutations ?? specimens[0].mutations;
  const publicMintsLeft = mintState
    ? Math.max(0, Number(mintState.publicMaxPerWallet - mintState.publicMintedByWallet))
    : 10;
  const latestWalletMint =
    mintedCollectionMode === "mine" && mintedCollection.length > 0 ? mintedCollection[0] : null;
  const normalizedMintSource = mintSourceTx.trim();
  const mintSourceIsValid = isHash(normalizedMintSource);
  const mintDisabledReason = !hoodPunksContractAddress
    ? "Set NEXT_PUBLIC_HOODPUNKS_CONTRACT_ADDRESS after deploy."
    : !mintSourceIsValid
      ? "Mint requires one Robinhood Chain transaction hash. Wallets and blocks stay analysis-only."
    : mintSourceAvailability === "used"
      ? "This tx hash already produced a HOODPUNK. Try a fresh transaction hash."
    : mintSourceAvailability === "checking"
      ? "Checking whether this transaction hash is still mintable..."
    : !mintState
      ? "Loading contract state..."
        : !mintState.publicMintOpen
          ? "Public mint is closed on contract."
          : publicMintsLeft === 0
            ? "This wallet already reached the public mint limit."
            : null;

  useEffect(() => {
    if (!hoodPunksContractAddress || !mintSourceIsValid) {
      setMintSourceAvailability("idle");
      return;
    }

    const contractAddress = hoodPunksContractAddress;
    let active = true;
    setMintSourceAvailability("checking");

    const timeoutId = window.setTimeout(async () => {
      try {
        const alreadyUsed = await hoodPunksPublicClient.readContract({
          address: contractAddress,
          abi: hoodPunksAbi,
          functionName: "mintedTxHashes",
          args: [normalizedMintSource as `0x${string}`],
        });

        if (active) {
          setMintSourceAvailability(alreadyUsed ? "used" : "available");
        }
      } catch {
        if (active) {
          setMintSourceAvailability("idle");
        }
      }
    }, 250);

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
    };
  }, [mintSourceIsValid, normalizedMintSource]);

  async function buildMintedPreview(
    tokenId: number,
    sourceTxHash: `0x${string}`,
  ): Promise<MintedTokenPreview> {
    const mintedAnalysis =
      analysis?.kind === "transaction" && analysis.query === sourceTxHash
        ? analysis
        : await (async () => {
            const response = await fetch("/api/analyze", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ query: sourceTxHash }),
            });
            const payload = (await response.json()) as HoodPunkAnalysis | { error: string };
            if (!response.ok || "error" in payload) {
              throw new Error("Could not derive NFT preview from transaction hash.");
            }
            return payload;
          })();

    const baseOrigin = typeof window === "undefined" ? "" : window.location.origin;

    return {
      tokenId,
      sourceTxHash,
      image: buildPunkSvg(mintedAnalysis, { mode: "legacy" }),
      title: `HOODPUNK #${tokenId}`,
      rarity: deriveRarityProfile(mintedAnalysis).tier,
      rarityDrivers: deriveRarityProfile(mintedAnalysis).triggers.join(" / "),
      metadataUrl: `${baseOrigin}/api/metadata/${tokenId}`,
      viewUrl: `${baseOrigin}/token/${tokenId}`,
      explorerUrl: `${robinhoodExplorerBase}/token/${hoodPunksContractAddress}?a=${tokenId}`,
      mintedAtIso: new Date().toISOString(),
    };
  }

  async function hydratePreviewFromTokenId(tokenId: number): Promise<MintedTokenPreview | null> {
    if (!hoodPunksContractAddress || typeof window === "undefined") {
      return null;
    }

    const metadataResponse = await fetch(`/api/metadata/${tokenId}`, {
      cache: "no-store",
    });
    const metadataPayload = (await metadataResponse.json()) as
      | {
          name: string;
          image: string;
          properties?: { source_tx_hash?: string };
        }
      | { error: string };

    if (
      !metadataResponse.ok ||
      "error" in metadataPayload ||
      !metadataPayload.properties?.source_tx_hash
    ) {
      return null;
    }

    return {
      tokenId,
      sourceTxHash: metadataPayload.properties.source_tx_hash as `0x${string}`,
      image: metadataPayload.image,
      title: metadataPayload.name,
      rarity:
        (metadataPayload as { attributes?: Array<{ trait_type: string; value: string | number }> })
          .attributes?.find((attribute) => attribute.trait_type === "Rarity")?.value as
          | string
          | undefined,
      rarityDrivers:
        (metadataPayload as { attributes?: Array<{ trait_type: string; value: string | number }> })
          .attributes?.find((attribute) => attribute.trait_type === "Rarity Drivers")
          ?.value as string | undefined,
      metadataUrl: `${window.location.origin}/api/metadata/${tokenId}`,
      viewUrl: `${window.location.origin}/token/${tokenId}`,
      explorerUrl: `${robinhoodExplorerBase}/token/${hoodPunksContractAddress}?a=${tokenId}`,
      mintedAtIso: new Date().toISOString(),
    };
  }

  useEffect(() => {
    let active = true;

    async function loadMintedCollection() {
      const mintedCount = Number(mintState?.totalMinted ?? 0n);
      if (!mintState || mintedCount <= 0) {
        if (active) {
          setMintedCollection([]);
        }
        return;
      }

      setIsCollectionLoading(true);
      try {
        let latestTokenIds: number[] = [];
        if (mintedCollectionMode === "mine") {
          if (!walletAddress || !hoodPunksContractAddress) {
            if (active) {
              setMintedCollection([]);
            }
            return;
          }
          const contractAddress = hoodPunksContractAddress;

          const tokenIds = Array.from({ length: mintedCount }, (_, index) => index).reverse();
          const ownershipChecks = await Promise.all(
            tokenIds.map(async (tokenId) => {
              try {
                const owner = await hoodPunksPublicClient.readContract({
                  address: contractAddress,
                  abi: hoodPunksAbi,
                  functionName: "ownerOf",
                  args: [BigInt(tokenId)],
                });
                return owner.toLowerCase() === walletAddress.toLowerCase() ? tokenId : null;
              } catch {
                return null;
              }
            }),
          );

          latestTokenIds = ownershipChecks
            .flatMap((tokenId) => (tokenId === null ? [] : [tokenId]));
        } else {
          latestTokenIds = Array.from(
            { length: Math.min(mintedCount, 8) },
            (_, index) => mintedCount - 1 - index,
          );
        }

        if (latestTokenIds.length === 0) {
          if (active) {
            setMintedCollection([]);
          }
          return;
        }

        const previews = await Promise.all(
          latestTokenIds.map(async (tokenId) => {
            const response = await fetch(`/api/metadata/${tokenId}`, {
              cache: "no-store",
            });
            const payload = (await response.json()) as
              | {
                  name: string;
                  image: string;
                  properties?: { source_tx_hash?: string };
                  attributes?: Array<{ trait_type: string; value: string | number }>;
                }
              | { error: string };

            if (!response.ok || "error" in payload || !payload.properties?.source_tx_hash) {
              return null;
            }

            const archetype = payload.attributes?.find(
              (attribute) => attribute.trait_type === "Archetype",
            )?.value;
            const corruption = payload.attributes?.find(
              (attribute) => attribute.trait_type === "Corruption",
            )?.value;
            const rarity = payload.attributes?.find(
              (attribute) => attribute.trait_type === "Rarity",
            )?.value;
            const rarityDrivers = payload.attributes?.find(
              (attribute) => attribute.trait_type === "Rarity Drivers",
            )?.value;

            return {
              tokenId,
              sourceTxHash: payload.properties.source_tx_hash as `0x${string}`,
              image: payload.image,
              title: payload.name,
              metadataUrl: `${window.location.origin}/api/metadata/${tokenId}`,
              viewUrl: `${window.location.origin}/token/${tokenId}`,
              explorerUrl: `${robinhoodExplorerBase}/token/${hoodPunksContractAddress ?? ""}?a=${tokenId}`,
              mintedAtIso: new Date().toISOString(),
              archetype: typeof archetype === "string" ? archetype : undefined,
              corruption: typeof corruption === "string" ? corruption : undefined,
              rarity: typeof rarity === "string" ? rarity : undefined,
              rarityDrivers: typeof rarityDrivers === "string" ? rarityDrivers : undefined,
            } satisfies MintedCollectionToken;
          }),
        );

        if (active) {
          const readyPreviews: MintedCollectionToken[] = previews.flatMap((preview) =>
            preview ? [preview] : [],
          );
          setMintedCollection(readyPreviews);
        }
      } catch {
        if (active) {
          setMintedCollection([]);
        }
      } finally {
        if (active) {
          setIsCollectionLoading(false);
        }
      }
    }

    void loadMintedCollection();

    return () => {
      active = false;
    };
  }, [mintState?.totalMinted, mintedPreview, mintedCollectionMode, walletAddress]);

  useEffect(() => {
    if (mintedPreview || !walletAddress || !hoodPunksContractAddress) {
      return;
    }
    const contractAddress = hoodPunksContractAddress;
    const connectedWallet = walletAddress;

    let active = true;

    async function recoverLatestMintedPreview() {
      try {
        const mintedCount = Number(mintState?.totalMinted ?? 0n);
        if (mintedCount <= 0) {
          return;
        }

        let latestTokenId: number | null = null;
        for (let tokenId = mintedCount - 1; tokenId >= 0; tokenId -= 1) {
          try {
            const owner = await hoodPunksPublicClient.readContract({
              address: contractAddress,
              abi: hoodPunksAbi,
              functionName: "ownerOf",
              args: [BigInt(tokenId)],
            });
            if (owner.toLowerCase() === connectedWallet.toLowerCase()) {
              latestTokenId = tokenId;
              break;
            }
          } catch {
            // Skip nonexistent or temporarily unreadable token ids.
          }
        }

        if (!active || latestTokenId === null || !Number.isFinite(latestTokenId)) {
          return;
        }

        const preview = await hydratePreviewFromTokenId(latestTokenId);
        if (active && preview) {
          setMintedPreview(preview);
        }
      } catch {
        // Keep the panel quiet if recovery fails; the collection rail still shows chain data.
      }
    }

    void recoverLatestMintedPreview();

    return () => {
      active = false;
    };
  }, [walletAddress, mintedPreview, mintState?.totalMinted]);

  async function refreshMintState(nextWallet?: `0x${string}` | null) {
    setIsRefreshingMintState(true);
    setMintError(null);
    try {
      const nextState = await readMintState(nextWallet ?? walletAddress ?? undefined);
      setMintState(nextState);
      setMintMessage("Contract state refreshed.");
    } catch (caughtError) {
      setMintError(formatWalletError(caughtError));
    } finally {
      setIsRefreshingMintState(false);
    }
  }

  async function connectWallet() {
    const provider = getInjectedProvider();
    if (!provider) {
      setMintError("No injected wallet found. Open the page in MetaMask or a browser wallet.");
      return;
    }

    setIsWalletBusy(true);
    setMintError(null);
    try {
      const accounts = await provider.request({ method: "eth_requestAccounts" });
      const nextWallet = Array.isArray(accounts) && typeof accounts[0] === "string"
        ? (accounts[0] as `0x${string}`)
        : null;
      setWalletAddress(nextWallet);
      await refreshMintState(nextWallet);
    } catch (caughtError) {
      setMintError(
        caughtError instanceof Error ? caughtError.message : "Wallet connection failed.",
      );
    } finally {
      setIsWalletBusy(false);
    }
  }

  async function ensureTargetChain() {
    const provider = getInjectedProvider();
    if (!provider) {
      throw new Error("Wallet not found.");
    }

    const chainId = await provider.request({ method: "eth_chainId" });
    const targetChainId = `0x${hoodPunksChain.id.toString(16)}`;
    if (chainId !== targetChainId) {
      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: targetChainId }],
        });
      } catch (caughtError) {
        const message =
          caughtError instanceof Error
            ? caughtError.message
            : typeof caughtError === "object" &&
                caughtError !== null &&
                "message" in caughtError &&
                typeof (caughtError as { message?: unknown }).message === "string"
              ? (caughtError as { message: string }).message
              : "";

        const code =
          typeof caughtError === "object" &&
          caughtError !== null &&
          "code" in caughtError &&
          typeof (caughtError as { code?: unknown }).code === "number"
            ? (caughtError as { code: number }).code
            : null;

        const needsAddChain =
          code === 4902 || message.includes("Unrecognized chain ID");

        if (!needsAddChain) {
          throw caughtError;
        }

        await provider.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: targetChainId,
              chainName: hoodPunksChain.name,
              nativeCurrency: {
                name: "Ether",
                symbol: "ETH",
                decimals: 18,
              },
              rpcUrls: [
                process.env.NEXT_PUBLIC_ROBINHOOD_RPC_URL ??
                  hoodPunksChain.rpcUrls.default.http[0],
              ],
              blockExplorerUrls: [
                hoodPunksChain.blockExplorers?.default.url ??
                  "https://robinhoodchain.blockscout.com",
              ],
            },
          ],
        });
      }
    }

    return provider;
  }

  async function handlePublicMint() {
    if (!walletAddress) {
      setMintError("Connect your wallet first.");
      return;
    }
    if (!hoodPunksContractAddress) {
      setMintError("Contract address is not configured yet.");
      return;
    }

    const contractAddress = hoodPunksContractAddress;

    setIsMintLoading(true);
    setMintError(null);
    setMintMessage(
      hoodPunksChain.id === 46630
        ? "Preparing Robinhood testnet mint..."
        : "Preparing Robinhood mainnet mint...",
    );

    try {
      const provider = await ensureTargetChain();
      const walletClient = createInjectedWalletClient(provider);
      const [account] = await walletClient.getAddresses();
      const sourceTxHash = normalizedMintSource as `0x${string}`;
      const alreadyUsed = await hoodPunksPublicClient.readContract({
        address: contractAddress,
        abi: hoodPunksAbi,
        functionName: "mintedTxHashes",
        args: [sourceTxHash],
      });
      if (alreadyUsed) {
        throw new Error("This tx hash already produced a HOODPUNK. Try a fresh transaction hash.");
      }

      const value = publicMintValue();
      const { request } = await hoodPunksPublicClient.simulateContract({
        address: contractAddress,
        abi: hoodPunksAbi,
        functionName: "publicMint",
        args: [sourceTxHash],
        account,
        value,
      });

      setMintMessage("Waiting for wallet confirmation...");
      const hash = await walletClient.writeContract(request);
      setMintMessage("Transaction sent. Waiting for confirmation...");
      const receipt = await hoodPunksPublicClient.waitForTransactionReceipt({ hash });
      const transferLog = receipt.logs.find(
        (log) =>
          log.address.toLowerCase() === contractAddress.toLowerCase() &&
          log.topics[0] ===
            "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55aebdcbf9d4b",
      );

      let mintedTokenId: number | null = null;
      if (transferLog) {
        const decoded = decodeEventLog({
          abi: hoodPunksAbi,
          data: transferLog.data,
          topics: transferLog.topics,
          eventName: "Transfer",
        });
        mintedTokenId = Number(decoded.args.tokenId);
      }

      await refreshMintState(account);
      if (mintedTokenId !== null) {
        setMintedPreview(await buildMintedPreview(mintedTokenId, sourceTxHash));
      }
      setMintMessage(`Mint confirmed for ${sourceTxHash.slice(0, 10)}...`);
    } catch (caughtError) {
      setMintError(formatWalletError(caughtError));
      setMintMessage(null);
    } finally {
      setIsMintLoading(false);
    }
  }

  function handleHeaderUnlock() {
    setHeaderTapCount((currentCount) => currentCount + 1);
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0A0F0D] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(0,200,5,0.12),_transparent_30%),radial-gradient(circle_at_80%_15%,_rgba(0,160,4,0.08),_transparent_24%)] opacity-80" />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pb-16 pt-4 sm:px-6 md:gap-14 lg:gap-16 lg:px-8">
        <section className="rounded-[1.5rem] border border-white/10 bg-[#111916]/90 px-4 py-5 sm:rounded-[2rem] sm:px-6 sm:py-6 lg:px-8">
          <div className="flex flex-col gap-4 border-b border-white/8 pb-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleHeaderUnlock}
                className="rounded-full border border-[#00C805]/20 bg-[#00C805]/10 px-4 py-2 text-[0.68rem] uppercase tracking-[0.28em] text-[#00C805] transition hover:border-[#00C805]/40 hover:bg-[#00C805]/14"
              >
                HOODPUNKS
              </button>
              <div className="hidden text-sm text-white/38 lg:block">
                Robinhood Chain-native mutation collection
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="rounded-full border border-white/10 bg-white/4 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/70 transition hover:border-[#00C805]/35 hover:text-white"
                >
                  {item.label}
                </a>
              ))}
              <a
                href={socialLinks[0].href}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-[#00C805]/35 bg-[#111916] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#00C805] transition hover:border-[#00C805] hover:bg-[#1a2b20] hover:text-white"
              >
                Follow on X
              </a>
              {mintedPreview ? (
                <a
                  href={mintedPreview.viewUrl}
                  className="rounded-full border border-[#4a6b52]/35 bg-[#4a6b52]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#b8c9bb] transition hover:border-[#4a6b52]/55 hover:bg-[#4a6b52]/16 hover:text-white"
                >
                  View Minted NFT
                </a>
              ) : null}
              <button
                type="button"
                onClick={() => void connectWallet()}
                disabled={isWalletBusy}
                className="rounded-full border border-[#00C805] bg-[#00C805] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.24em] text-black shadow-[0_0_24px_rgba(0,200,5,0.2)] transition hover:bg-[#2ee816] disabled:cursor-not-allowed disabled:opacity-60 lg:hidden"
              >
                {walletAddress
                  ? `Wallet ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
                  : isWalletBusy
                    ? "Connecting..."
                    : "Connect Wallet"}
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0 max-w-3xl">
              <div className="text-[0.68rem] uppercase tracking-[0.28em] text-[#00C805] sm:tracking-[0.36em]">
                HOODPUNKS / CryptoPunk DNA · Robinhood Chain
              </div>
              <h1 className="mt-4 break-words text-3xl font-bold leading-[1.08] tracking-tight sm:text-4xl lg:text-5xl xl:text-6xl">
                Transaction entropy becomes identity.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/68 sm:text-base">
                Classic 24×24 CryptoPunk silhouettes — green mohawks, beanies, hoodies —
                then Robinhood Chain data mutates each face with heat, gas scars,
                and wealth signals while keeping that iconic PFP readability.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#generator"
                  className="rounded-full bg-[#00C805] px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-black transition hover:bg-[#2ee816]"
                >
                  Open Generator
                </a>
                <a
                  href="#mint"
                  className="rounded-full border border-[#4a6b52]/25 bg-[#4a6b52]/10 px-6 py-3 text-sm uppercase tracking-[0.22em] text-[#b8c9bb] transition hover:border-[#4a6b52]/40 hover:bg-[#4a6b52]/14 hover:text-white"
                >
                  View Mint Terms
                </a>
                <a
                  href="#traits"
                  className="rounded-full border border-white/10 bg-white/4 px-6 py-3 text-sm uppercase tracking-[0.22em] text-white/72 transition hover:border-[#00C805]/35 hover:text-white"
                >
                  Read Trait Bible
                </a>
              </div>
            </div>
            <div className="grid w-full gap-3 sm:grid-cols-3 lg:max-w-md lg:shrink-0">
              <Metric label="Runtime" value="Robinhood Chain RPC" accent />
              <Metric label="Rendering" value="Procedural SVG" />
              <Metric label="Direction" value="Fully on-chain" />
            </div>
          </div>
          <div
            id="mint"
            className="mt-8 grid gap-4 border-t border-white/8 pt-6 md:grid-cols-2 xl:grid-cols-4"
          >
            <div className="rounded-[1.5rem] border border-[#00C805]/20 bg-[#00C805]/8 p-5">
              <div className="text-[0.68rem] uppercase tracking-[0.28em] text-[#00C805]">
                Public Mint
              </div>
              <div className="mt-3 text-3xl font-semibold text-white">0.002 ETH</div>
              <p className="mt-2 text-sm leading-6 text-white/62">
                Fixed mint price for the public phase.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/4 p-5">
              <div className="text-[0.68rem] uppercase tracking-[0.28em] text-white/45">
                Wallet Limit
              </div>
              <div className="mt-3 text-3xl font-semibold text-white">10 max</div>
              <p className="mt-2 text-sm leading-6 text-white/62">
                Maximum 10 HOODPUNKS per wallet in the public mint.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/4 p-5">
              <div className="text-[0.68rem] uppercase tracking-[0.28em] text-white/45">
                Collection Progress
              </div>
              <div className="mt-3 text-3xl font-semibold text-white">
                {mintState
                  ? `${mintState.totalMinted.toString()} / ${mintState.maxSupply.toString()}`
                  : "Loading"}
              </div>
              <p className="mt-2 text-sm leading-6 text-white/62">
                Live on-chain mint count pulled directly from the deployed contract.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/4 p-5">
              <div className="text-[0.68rem] uppercase tracking-[0.28em] text-white/45">
                Mint Flow
              </div>
              <div className="mt-3 text-3xl font-semibold text-white">Generate to mint</div>
              <p className="mt-2 text-sm leading-6 text-white/62">
                Paste a transaction hash, generate the portrait, and mint it immediately if the result deserves a token.
              </p>
            </div>
          </div>
        </section>

        <section
          id="generator"
          className="grid gap-8"
        >
          <div className="rounded-[2rem] border border-white/10 bg-[#111916]/88 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-[0.72rem] uppercase tracking-[0.34em] text-white/42">
                  Live HoodPunk Generator
                </div>
                <h2 className="mt-3 text-3xl font-semibold">
                  A chain-born portrait with stable anatomy
                </h2>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2">
                <div className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.24em] ${currentRarityTone.pill}`}>
                  {currentRarity.tier}
                </div>
                <div className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/55">
                  {analysis?.archetype ?? specimens[0].archetype}
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-6">
              <div className="grid gap-6 2xl:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
                <div className="grid min-w-0 gap-5">
                  <div
                    id="mint-current"
                    className="rounded-[1.7rem] border border-white/10 bg-black/35 p-5"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-[0.72rem] uppercase tracking-[0.34em] text-white/42">
                          Hood Input System
                        </div>
                        <h3 className="mt-3 text-xl font-semibold sm:text-2xl lg:text-3xl">
                          Generate a HOODPUNK from live Robinhood Chain data
                        </h3>
                      </div>
                      <div className="hidden rounded-full border border-[#00C805]/20 bg-[#00C805]/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-[#00C805] sm:block">
                        Real RPC
                      </div>
                    </div>

                    <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/50 p-4 sm:p-5">
                      <label
                        htmlFor="query"
                        className="text-[0.68rem] uppercase tracking-[0.32em] text-white/38"
                      >
                        Transaction hash
                      </label>
                      <TxHashGuide />
                      <input
                        id="query"
                        value={query}
                        onChange={(event) => {
                          const nextValue = event.target.value;
                          setQuery(nextValue);
                          setMintSourceTx(isHash(nextValue.trim()) ? nextValue.trim() : "");
                        }}
                        placeholder="Paste one Robinhood Chain tx hash"
                        className="mt-3 h-14 w-full rounded-[1.2rem] border border-white/10 bg-[#0A0F0D] px-4 font-mono text-sm leading-6 text-white outline-none transition placeholder:text-white/20 focus:border-[#00C805]/50"
                      />
                      <div className="mt-4 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => generate()}
                          disabled={isLoading}
                          className="rounded-full bg-[#00C805] px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-black transition hover:bg-[#2ee816] disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {isLoading ? "Rendering..." : "Generate HoodPunk"}
                        </button>
                        <button
                          type="button"
                          onClick={() => void handlePublicMint()}
                          disabled={isMintLoading || Boolean(mintDisabledReason)}
                          className="rounded-full border border-[#4a6b52]/35 bg-[#4a6b52]/16 px-8 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-[#b8c9bb] transition hover:border-[#4a6b52]/55 hover:bg-[#4a6b52]/22 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isMintLoading ? "Minting..." : "Mint This Tx"}
                        </button>
                      </div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <Metric
                          label="Minted"
                          value={
                            mintState
                              ? `${mintState.totalMinted.toString()} / ${mintState.maxSupply.toString()}`
                              : "Loading"
                          }
                          accent
                        />
                        <Metric
                          label="Public Phase"
                          value={mintState?.publicMintOpen ? "Open" : "Closed"}
                          accent={mintState?.publicMintOpen ?? false}
                        />
                        <Metric
                          label="Wallet"
                          value={
                            mintState
                              ? `${mintState.publicMintedByWallet.toString()} / ${mintState.publicMaxPerWallet.toString()}`
                              : "--"
                          }
                        />
                        <Metric
                          label="Price"
                          value={
                            mintState
                              ? `${Number(mintState.mintPriceEth).toFixed(3)} ETH`
                              : "0.002 ETH"
                          }
                        />
                      </div>
                      {mintSourceIsValid ? (
                        <div
                          className={`mt-4 rounded-[1.2rem] px-4 py-3 text-sm leading-6 ${
                            mintSourceAvailability === "used"
                              ? "border border-[#ff8757]/25 bg-[#ff8757]/10 text-[#ffd5c3]"
                              : mintSourceAvailability === "available"
                                ? "border border-[#00C805]/20 bg-[#00C805]/8 text-[#d4f5d6]"
                                : "border border-[#4a6b52]/20 bg-[#4a6b52]/8 text-[#b8c9bb]"
                          }`}
                        >
                          {mintSourceAvailability === "used"
                            ? "This tx hash already produced a HOODPUNK. Generate with a fresh transaction hash if you want to mint."
                            : mintSourceAvailability === "available"
                              ? "This transaction hash is still mintable. Generate the portrait, then mint it right from this panel."
                              : "Checking whether this transaction hash is still available for mint..."}
                        </div>
                      ) : null}
                      <div className="mt-4 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => void refreshMintState()}
                          disabled={isRefreshingMintState}
                          className="rounded-full border border-white/10 bg-white/4 px-5 py-3 text-sm uppercase tracking-[0.22em] text-white/70 transition hover:border-[#00C805]/35 hover:text-white"
                        >
                          {isRefreshingMintState ? "Refreshing..." : "Refresh Contract"}
                        </button>
                        <div className="rounded-full border border-white/10 bg-white/4 px-4 py-3 text-xs uppercase tracking-[0.2em] text-white/58">
                          {hoodPunksChain.id === 46630 ? "Robinhood testnet" : "Robinhood Chain mainnet"}
                        </div>
                      </div>
                      <div className="mt-4 rounded-[1.2rem] border border-[#4a6b52]/20 bg-[#4a6b52]/8 p-4 text-sm leading-6 text-white/68">
                        HOODPUNKS now resolve from transaction hashes only. The app still reads
                        sender wallet history and full block context behind the scenes, but the
                        collection is anchored to one source transaction per punk.
                      </div>
                      <div className="mt-4 rounded-[1rem] border border-[#00C805]/20 bg-[#00C805]/8 px-4 py-3 text-sm leading-6 text-[#d4f5d6]">
                        {hoodPunksChain.id === 46630 ? (
                          <>
                            Testnet: MetaMask chain ID{" "}
                            <span className="font-mono">46630</span>. Get ETH from{" "}
                            <a href="https://faucet.testnet.chain.robinhood.com" target="_blank" rel="noopener noreferrer" className="text-[#00C805] underline-offset-2 hover:underline">faucet</a>.
                          </>
                        ) : (
                          <>
                            Mainnet: MetaMask → Robinhood Chain (chain ID{" "}
                            <span className="font-mono">4663</span>). Need real ETH for gas + 0.002 ETH mint. Explorer:{" "}
                            <a href="https://robinhoodchain.blockscout.com" target="_blank" rel="noopener noreferrer" className="text-[#00C805] underline-offset-2 hover:underline">Blockscout</a>.
                          </>
                        )}
                      </div>
                      {mintDisabledReason ? (
                        <div className="mt-4 rounded-[1rem] border border-[#4a6b52]/20 bg-[#4a6b52]/8 px-4 py-3 text-sm leading-6 text-[#b8c9bb]">
                          {mintDisabledReason}
                        </div>
                      ) : null}
                      {mintMessage ? (
                        <div className="mt-4 rounded-[1rem] border border-[#00C805]/25 bg-[#00C805]/10 px-4 py-3 text-sm leading-6 text-[#d4f5d6]">
                          {mintMessage}
                        </div>
                      ) : null}
                      {mintError ? (
                        <div className="mt-4 rounded-[1rem] border border-[#ff8757]/25 bg-[#ff8757]/10 px-4 py-3 text-sm leading-6 text-[#ffd5c3]">
                          {mintError}
                        </div>
                      ) : null}
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={isLoading ? "loading" : analysis?.seed ?? "idle"}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="mt-6 rounded-[1.5rem] border border-white/10 bg-[#0A0F0D] p-5"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-[0.72rem] uppercase tracking-[0.34em] text-white/42">
                            Live Blockchain Analysis
                          </div>
                          <div className="text-xs uppercase tracking-[0.2em] text-[#00C805]">
                            {analysis?.rpcSource ?? "Awaiting input"}
                          </div>
                        </div>

                        {isLoading ? (
                          <div className="mt-6">
                            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                              <motion.div
                                className="h-full rounded-full bg-[#00C805]"
                                initial={{ width: "0%" }}
                                animate={{ width: `${((loadingStep + 1) / cinematicSteps.length) * 100}%` }}
                                transition={{ duration: 0.6 }}
                              />
                            </div>
                            <div className="mt-4 text-lg text-white/90">
                              {cinematicSteps[loadingStep]}
                            </div>
                            <p className="mt-2 text-sm text-white/52">
                              Pulling live entropy, base fee pressure, execution status, and
                              block conditions from Robinhood Chain.
                            </p>
                          </div>
                        ) : analysis ? (
                          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
                            <Metric label="Source Type" value="transaction" />
                            <Metric label="Gas Fee" value={`${analysis.gasGwei.toFixed(2)} gwei`} accent />
                            <Metric label="Wallet Era" value={analysis.walletEra} />
                            <Metric label="Entropy" value={`${analysis.entropyScore}/100`} />
                            <Metric label="Congestion" value={`${analysis.congestionScore}/100`} />
                            <Metric label="Status" value={analysis.status} />
                            <Metric label="Block" value={analysis.blockNumber.toString()} />
                            <Metric label="Nonce" value={analysis.nonce.toString()} />
                            <Metric label="Value" value={`${analysis.valueEth.toFixed(4)} ETH`} />
                            <Metric
                              label="Mint Source"
                              value={
                                mintSourceIsValid
                                  ? `${normalizedMintSource.slice(0, 10)}...${normalizedMintSource.slice(-8)}`
                                  : "Awaiting tx"
                              }
                            />
                          </div>
                        ) : (
                          <div className="mt-6 text-sm leading-6 text-white/56">
                            Paste one live Robinhood Chain transaction hash to inspect gas fee,
                            entropy score, congestion level, tx status, sender history, and the
                            mutation logic that forms the portrait.
                          </div>
                        )}

                        {error ? (
                          <div className="mt-5 rounded-2xl border border-[#ff8757]/25 bg-[#ff8757]/10 px-4 py-3 text-sm text-[#ffd5c3]">
                            {error}
                          </div>
                        ) : null}
                      </motion.div>
                    </AnimatePresence>
                  </div>

              </div>

                <div className="grid min-w-0 gap-5 2xl:sticky 2xl:top-4 2xl:self-start">
                  <div className="grid gap-5 xl:grid-cols-1">
                    <div className="relative min-w-0 rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_50%_0%,rgba(0,200,5,0.14),transparent_55%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0))] p-4 sm:rounded-[1.8rem]">
                {hasRareHit ? (
                  <>
                    <motion.div
                      className={`pointer-events-none absolute inset-0 rounded-[1.8rem] ${
                        currentRarity.tier === "Legendary"
                          ? "bg-[radial-gradient(circle_at_50%_20%,rgba(240,194,50,0.18),transparent_56%)]"
                          : "bg-[radial-gradient(circle_at_50%_20%,rgba(0,200,5,0.15),transparent_56%)]"
                      }`}
                      animate={{ opacity: [0.45, 0.9, 0.45] }}
                      transition={{ duration: 1.9, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    />
                    <motion.div
                      className={`pointer-events-none absolute inset-[10px] rounded-[1.45rem] border ${
                        currentRarity.tier === "Legendary"
                          ? "border-[#f0c232]/35"
                          : "border-[#00C805]/28"
                      }`}
                      animate={{ opacity: [0.3, 0.9, 0.3], scale: [0.995, 1.01, 0.995] }}
                      transition={{ duration: 2.1, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    />
                  </>
                ) : null}
                <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:100%_8px] opacity-20" />
                <motion.div
                  key={analysis?.seed ?? "specimen"}
                  className="relative z-10 mx-auto block aspect-square w-full max-w-[280px] sm:max-w-[320px]"
                  initial={{ opacity: 0, scale: 0.92, filter: "blur(6px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                >
                  <Image
                    src={image}
                    alt="Generated HoodPunk"
                    width={240}
                    height={240}
                    unoptimized
                    className="aspect-square w-full rounded-[1.2rem] border border-white/10 bg-[#0A0F0D] p-2 [image-rendering:pixelated]"
                  />
                </motion.div>
                <div
                  className={`relative z-10 mt-4 rounded-[1.2rem] border p-4 ${currentCorruptionMeta.tone}`}
                >
                  <div className="text-[0.68rem] uppercase tracking-[0.28em] text-white/40">
                    Entity Status
                  </div>
                  <div className="mt-2 text-2xl font-semibold capitalize text-white">
                    {currentCorruptionLevel}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/56">
                    {currentCorruptionMeta.detail}
                  </p>
                  <div className="mt-3 text-xs uppercase tracking-[0.2em] text-white/34">
                    Chain pressure, not mint status
                  </div>
                </div>
                <div className={`relative z-10 mt-4 rounded-[1.2rem] border p-4 ${currentRarityTone.panel}`}>
                  <div className="text-[0.68rem] uppercase tracking-[0.28em] text-white/40">
                    Rarity
                  </div>
                  <div className="mt-2 text-2xl font-semibold text-white">
                    {currentRarity.tier}
                  </div>
                  <p className={`mt-2 text-sm leading-6 ${currentRarityTone.text}`}>
                    {currentRarity.detail}
                  </p>
                  <div className="mt-3 text-xs uppercase tracking-[0.2em] text-white/34">
                    {currentRarity.triggers.join(" / ")}
                  </div>
                </div>
                {hasRareHit ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`relative mt-4 rounded-[1.2rem] border px-4 py-3 ${
                      currentRarity.tier === "Legendary"
                        ? "border-[#f0c232]/28 bg-[#f0c232]/10 text-[#ffe7a3]"
                        : "border-[#00C805]/24 bg-[#00C805]/10 text-[#d4f5d6]"
                    }`}
                  >
                    <div className="text-[0.68rem] uppercase tracking-[0.28em]">
                      Rare Hit
                    </div>
                    <div className="mt-2 text-sm leading-6">
                      {rareHitCopy}
                    </div>
                  </motion.div>
                ) : null}
                    </div>

                    <div className="min-w-0">
                      <div className="rounded-[1.5rem] border border-white/10 bg-black/35 p-5">
                        <div className="text-[0.68rem] uppercase tracking-[0.28em] text-[#00C805]">
                          Mutation Summary
                        </div>
                        <h3 className="mt-3 max-w-2xl text-2xl font-semibold leading-tight sm:text-[2rem]">
                          {analysis?.title ?? specimens[0].title}
                        </h3>
                        <p className="mt-3 text-sm leading-6 text-white/58">
                          {analysis
                            ? `Derived from ${analysis.kind} input on ${formatDate(
                                analysis.timestampIso,
                              )}.`
                            : "Specimen card showing how the mutation engine treats different chain conditions."}
                        </p>
                        <div className="mt-4 grid gap-4 2xl:grid-cols-1">
                          {mutationSections.map((section) => {
                            const sectionMutations = currentMutations.filter(
                              (mutation) => classifyMutation(mutation) === section.key,
                            );

                            if (sectionMutations.length === 0) {
                              return null;
                            }

                            return (
                              <div
                                key={section.key}
                                className={`rounded-[1.3rem] border px-4 py-4 ${section.accent}`}
                              >
                                <div className="flex items-center justify-between gap-3">
                                  <div className={`text-[0.68rem] uppercase tracking-[0.28em] ${section.badge}`}>
                                    {section.label}
                                  </div>
                                  <div className="text-[0.62rem] uppercase tracking-[0.24em] text-white/38">
                                    {sectionMutations.length} active
                                  </div>
                                </div>
                                <div className="mt-3 grid gap-3">
                                  {sectionMutations.map((mutation) => (
                                    <MutationPill
                                      key={`${mutation.name}-${mutation.detail}`}
                                      mutation={mutation}
                                    />
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.035] p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <div className="text-[0.68rem] uppercase tracking-[0.28em] text-[#00C805]">
                      Minted Collection
                    </div>
                    <div className="mt-3 text-2xl font-semibold text-white">
                      {mintState?.totalMinted
                        ? `${mintState.totalMinted.toString()} HOODPUNKS already chain-linked`
                        : "No minted punks yet"}
                    </div>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
                      Latest mints land here so you can browse the collection without digging
                      through tx history by hand.
                    </p>
                    {mintedCollectionMode === "mine" && walletAddress ? (
                      <div className="mt-3 flex flex-wrap gap-3">
                        <div className="rounded-full border border-white/10 bg-black/25 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/65">
                          You minted: {mintedCollection.length}
                        </div>
                        {latestWalletMint ? (
                          <a
                            href={latestWalletMint.viewUrl}
                            className="rounded-full border border-[#00C805]/25 bg-[#00C805]/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#d4f5d6] transition hover:border-[#00C805]/45 hover:text-white"
                          >
                            Open latest minted
                          </a>
                        ) : null}
                      </div>
                    ) : null}
                    <div className="mt-3 text-xs uppercase tracking-[0.2em] text-white/42">
                      {mintedCollectionMode === "all"
                        ? `Showing latest ${Math.min(Number(mintState?.totalMinted ?? 0n), 8)} mints`
                        : walletAddress
                          ? `Showing all ${mintedCollection.length} mints received by this wallet`
                          : "Connect wallet to see only your mints"}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="inline-flex rounded-full border border-white/10 bg-black/25 p-1">
                      <button
                        type="button"
                        onClick={() => setMintedCollectionMode("all")}
                        className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.2em] transition ${
                          mintedCollectionMode === "all"
                            ? "bg-[#00C805] text-black"
                            : "text-white/55 hover:text-white"
                        }`}
                      >
                        All Minted
                      </button>
                      <button
                        type="button"
                        onClick={() => setMintedCollectionMode("mine")}
                        className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.2em] transition ${
                          mintedCollectionMode === "mine"
                            ? "bg-[#00C805] text-black"
                            : "text-white/55 hover:text-white"
                        }`}
                      >
                        My Wallet
                      </button>
                    </div>
                    <div className="rounded-full border border-white/10 bg-black/25 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/55">
                      {hoodPunksChain.id === 46630 ? "Robinhood testnet" : "Robinhood mainnet"}
                    </div>
                  </div>
                </div>

                {isCollectionLoading ? (
                  <div className="mt-5 rounded-[1.2rem] border border-white/10 bg-black/25 px-4 py-4 text-sm leading-6 text-white/55">
                    Loading the latest minted punks from live contract state...
                  </div>
                ) : mintedCollection.length > 0 ? (
                  <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {mintedCollection.map((token) => (
                      <div
                        key={token.tokenId}
                        className={`relative rounded-[1.35rem] border p-4 ${
                          token.rarity === "Legendary"
                            ? "border-[#f0c232]/26 bg-[#120f05]"
                            : token.rarity === "Rare"
                              ? "border-[#4a6b52]/18 bg-[#081019]"
                              : token.rarity === "Very Rare"
                                ? "border-[#00C805]/20 bg-[#0f1a14]"
                                : "border-white/10 bg-black/35"
                        }`}
                      >
                        {token.rarity === "Legendary" ? (
                          <>
                            <motion.div
                              className="pointer-events-none absolute inset-0 rounded-[1.35rem] bg-[radial-gradient(circle_at_50%_22%,rgba(240,194,50,0.16),transparent_58%)]"
                              animate={{ opacity: [0.35, 0.95, 0.35] }}
                              transition={{
                                duration: 1.9,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut",
                              }}
                            />
                            <motion.div
                              className="pointer-events-none absolute inset-[8px] rounded-[1.1rem] border border-[#f0c232]/30"
                              animate={{ opacity: [0.25, 0.85, 0.25], scale: [0.992, 1.01, 0.992] }}
                              transition={{
                                duration: 2.05,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut",
                              }}
                            />
                          </>
                        ) : token.rarity === "Very Rare" ? (
                          <motion.div
                            className="pointer-events-none absolute inset-[8px] rounded-[1.1rem] border border-[#00C805]/24"
                            animate={{ opacity: [0.2, 0.55, 0.2] }}
                            transition={{
                              duration: 2.2,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "easeInOut",
                            }}
                          />
                        ) : null}
                        <a href={token.viewUrl} className="block">
                          <Image
                            src={token.image}
                            alt={token.title}
                            width={200}
                            height={200}
                            unoptimized
                            className="mx-auto aspect-square w-full max-w-[180px] rounded-[1rem] border border-white/10 bg-black/60 p-3 [image-rendering:pixelated]"
                          />
                        </a>
                        <div className="mt-4 text-[0.68rem] uppercase tracking-[0.24em] text-white/42">
                          {token.archetype ?? "HOODPUNK"}
                        </div>
                        <div className="mt-2 text-lg font-semibold text-white">
                          {token.title}
                        </div>
                        {token.rarity ? (
                          <div
                            className={`mt-2 inline-flex rounded-full border px-3 py-1 text-[0.68rem] uppercase tracking-[0.22em] ${
                              rarityToneForLabel(token.rarity).pill
                            }`}
                          >
                            {token.rarity}
                          </div>
                        ) : null}
                        <div className="mt-2 text-sm leading-6 text-white/55">
                          {token.corruption
                            ? `Corruption: ${token.corruption}`
                            : `Source: ${token.sourceTxHash.slice(0, 10)}...`}
                        </div>
                        {token.rarityDrivers ? (
                          <div className="mt-2 text-xs leading-5 text-white/45">
                            {token.rarityDrivers}
                          </div>
                        ) : null}
                        <div className="mt-4 flex flex-wrap gap-2">
                          <a
                            href={token.viewUrl}
                            className="rounded-full bg-[#00C805] px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-black transition hover:bg-[#2ee816]"
                          >
                            View
                          </a>
                          <a
                            href={token.metadataUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-full border border-white/10 bg-white/4 px-4 py-2 text-[0.68rem] uppercase tracking-[0.22em] text-white/70 transition hover:border-[#00C805]/35 hover:text-white"
                          >
                            Metadata
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-5 rounded-[1.2rem] border border-white/10 bg-black/25 px-4 py-4 text-sm leading-6 text-white/48">
                    {mintedCollectionMode === "mine"
                      ? walletAddress
                        ? "No mints found for this wallet yet. Mint from a transaction hash and your wallet rail will populate automatically."
                        : "Connect a wallet to view only your minted HOODPUNKS."
                      : "Mint the first HOODPUNK from a transaction hash and the collection rail will start filling itself automatically."}
                  </div>
                )}
              </div>
              <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                {currentTraits.map((trait) => (
                  <TraitCard key={`${trait.label}-${trait.value}`} trait={trait} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="traits"
          className="grid gap-6"
        >
          <div className="rounded-[2rem] border border-[#00C805]/16 bg-[#0f1a14] p-6 sm:p-8">
            <div className="max-w-4xl">
              <div className="text-[0.72rem] uppercase tracking-[0.34em] text-[#00C805]">
                Rarity Logic
              </div>
              <h2 className="mt-3 text-3xl font-semibold">
                Rare HOODPUNKS come from deterministic low-probability seed branches
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/62">
                Rarity is not random on every refresh. The same source transaction always resolves
                to the same rarity. Common pieces stay inside the base mutation lattice. Rare
                pieces unlock backdrop branches, relic accessories, whale prestige, or one of the
                special identity classes like Zombie Rot and Hooded Wraith.
              </p>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[1.4rem] border border-white/10 bg-black/25 p-4">
                <div className="text-[0.68rem] uppercase tracking-[0.24em] text-white/42">
                  Common
                </div>
                <p className="mt-2 text-sm leading-6 text-white/62">
                  Base punk anatomy plus normal chain pressure. No low-frequency rarity branch hit.
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-[#4a6b52]/20 bg-[#4a6b52]/8 p-4">
                <div className="text-[0.68rem] uppercase tracking-[0.24em] text-[#b8c9bb]">
                  Rare
                </div>
                <p className="mt-2 text-sm leading-6 text-[#b8c9bb]">
                  Rare backdrop, relic accessory, or whale prestige activated.
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-[#00C805]/20 bg-[#00C805]/8 p-4">
                <div className="text-[0.68rem] uppercase tracking-[0.24em] text-[#d4f5d6]">
                  Very Rare
                </div>
                <p className="mt-2 text-sm leading-6 text-[#d4f5d6]">
                  Zombie Rot, Hooded Wraith, or a double-signal rarity stack.
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-[#f0c232]/24 bg-[#f0c232]/10 p-4">
                <div className="text-[0.68rem] uppercase tracking-[0.24em] text-[#ffe7a3]">
                  Legendary
                </div>
                <p className="mt-2 text-sm leading-6 text-[#ffe7a3]">
                  A rare identity class layered with another rare branch. These are the freak
                  artifacts.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="text-[0.72rem] uppercase tracking-[0.34em] text-[#00C805]">
                Trait Bible
              </div>
              <h2 className="mt-3 text-3xl font-semibold">
                Every visible mutation needs a chain-native reason
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/62">
                The collection only works if the site explains the causality cleanly.
                The point is not random weirdness. The point is that gas, failed
                calls, congestion, and wallet history leave understandable marks on
                a stable punk face.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-black/30 px-5 py-4 text-sm leading-6 text-white/58">
              Original punk-inspired archetypes first.
              <br />
              Mutations second.
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {traitColumns.map((item) => (
            <div
              key={item.title}
              className="rounded-[1.7rem] border border-white/10 bg-white/[0.035] p-6"
            >
              <div className="text-[0.72rem] uppercase tracking-[0.32em] text-[#00C805]">
                Trait Logic
              </div>
              <h3 className="mt-4 text-2xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/62">{item.body}</p>
            </div>
          ))}
          </div>
        </section>

        <section
          id="lore"
          className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]"
        >
          <div className="rounded-[2rem] border border-white/10 bg-[#111916]/88 p-6 sm:p-8">
            <div className="text-[0.72rem] uppercase tracking-[0.34em] text-white/42">
              Live Punk Gallery
            </div>
            <h2 className="mt-3 text-3xl font-semibold">
              Curated mutation studies, not malformed blobs
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/60">
              Every specimen starts from a stable, punk-inspired archetype and only
              mutates the expressive layer: eyes, overlays, burns, accessories, and
              glitch damage.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {specimens.map((specimen) => (
                <div
                  key={specimen.seed}
                  className="rounded-[1.5rem] border border-white/10 bg-black/35 p-4"
                >
                  <Image
                    src={specimen.image}
                    alt={specimen.title}
                    width={160}
                    height={160}
                    unoptimized
                    className="mx-auto aspect-square w-full max-w-[160px] rounded-xl border border-white/10 bg-black/65 p-3 [image-rendering:pixelated]"
                  />
                  <div className="mt-4 text-sm uppercase tracking-[0.22em] text-white/42">
                    {specimen.archetype}
                  </div>
                  <div className="mt-2 text-lg font-semibold text-white">
                    {specimen.title}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/55">
                    {specimen.traits[0]?.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 sm:p-8">
              <div className="text-[0.72rem] uppercase tracking-[0.34em] text-white/42">
                Collection Lore
              </div>
              <h2 className="mt-3 text-3xl font-semibold">
                Robinhood Chain is alive and it leaves marks on every face
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/62">
                HOODPUNKS imagines the chain as a living pressure system. Every
                transaction carries heat, delay, wealth, age, and execution risk.
                Those forces do not create random monsters. They scar a familiar
                portrait language until the network itself becomes the DNA.
              </p>
              <div className="mt-5 rounded-[1.4rem] border border-white/10 bg-black/30 p-5 text-sm leading-7 text-white/58">
                The visual target is simple: if somebody glances at the face, it
                should still read like a collectible punk portrait first, and only
                then reveal the corruption.
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 sm:p-8">
              <div className="text-[0.72rem] uppercase tracking-[0.34em] text-white/42">
                Collection Instruction
              </div>
              <h2 className="mt-3 text-3xl font-semibold">
                A cleaner brief for how the collection should be built
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <Metric label="Mint Price" value="0.002 ETH" accent />
                <Metric label="Wallet Limit" value="10 max" />
                <Metric label="Phase Two" value="Eligible list" />
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.4rem] border border-white/10 bg-black/30 p-5">
                  <div className="text-lg font-semibold text-white">
                    Start from punk archetypes
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/58">
                    Curated male, female, hacker, cyborg, zombie, trader, and miner
                    silhouettes should anchor the collection before any mutation is
                    applied.
                  </p>
                </div>
                <div className="rounded-[1.4rem] border border-white/10 bg-black/30 p-5">
                  <div className="text-lg font-semibold text-white">
                    Mutate only the expressive layer
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/58">
                    Eyes, accessories, burns, glitches, damage, prestige metals, and
                    overlays can move. Stable anatomy and portrait framing should not.
                  </p>
                </div>
                <div className="rounded-[1.4rem] border border-white/10 bg-black/30 p-5">
                  <div className="text-lg font-semibold text-white">
                    Real chain data in
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/58">
                    Tx hash, block hash, or wallet address is resolved against live
                    Robinhood Chain RPC, then mapped into gas, status, entropy, and
                    congestion signals.
                  </p>
                </div>
                <div className="rounded-[1.4rem] border border-white/10 bg-black/30 p-5">
                  <div className="text-lg font-semibold text-white">
                    Fully on-chain direction
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/58">
                    The generator is already structured around deterministic SVG logic
                    so metadata and rendering can move toward on-chain permanence.
                  </p>
                </div>
                <div className="rounded-[1.4rem] border border-white/10 bg-black/30 p-5">
                  <div className="text-lg font-semibold text-white">
                    Public mint
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/58">
                    Base mint is set to 0.002 ETH with a maximum of 10 HOODPUNKS per
                    wallet during the public phase.
                  </p>
                </div>
                <div className="rounded-[1.4rem] border border-white/10 bg-black/30 p-5">
                  <div className="text-lg font-semibold text-white">
                    Eligible phase next
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/58">
                    A separate eligible mint phase can be layered in later without
                    changing the collection story or on-chain trait engine.
                  </p>
                </div>
              </div>
            </div>

            <div
              id="roadmap"
              className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 sm:p-8"
            >
              <div className="text-[0.72rem] uppercase tracking-[0.34em] text-white/42">
                Roadmap
              </div>
              <div className="mt-4 grid gap-4">
                {[
                  "Refine the SVG archetype system into a larger trait lattice.",
                  "Add wallet connect, mint flow, and chain-specific collection mechanics.",
                  "Move metadata and rendering logic toward fully on-chain persistence.",
                  "Expand the gallery into a browsable archive of chain-born identities.",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-start gap-4 rounded-[1.4rem] border border-white/10 bg-black/30 p-5"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#00C805]/25 bg-[#00C805]/10 text-sm font-semibold text-[#00C805]">
                      0{index + 1}
                    </div>
                    <p className="text-sm leading-6 text-white/62">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <footer className="rounded-[2rem] border border-white/10 bg-black/35 px-6 py-8 text-sm text-white/52 sm:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-[0.72rem] uppercase tracking-[0.34em] text-[#00C805]">
                HOODPUNKS
              </div>
              <p className="mt-2 max-w-2xl leading-6">
                Fully on-chain SVG direction, deterministic mutation logic, and a
                front-end built to explain why every trait exists.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/10 bg-white/4 px-4 py-2 text-[0.68rem] uppercase tracking-[0.24em] text-white/58 transition hover:border-[#00C805]/35 hover:text-white"
                >
                  {item.label}
                </a>
              ))}
              <div className="text-[0.7rem] uppercase tracking-[0.26em] text-white/34">
                If the chain survives, the HoodPunks survive.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
