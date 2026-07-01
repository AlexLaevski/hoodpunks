"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { readMintState } from "@/lib/hood-punks-contract";

type MetadataAttribute = {
  trait_type: string;
  value: string | number;
};

type TokenMetadata = {
  name: string;
  description: string;
  image: string;
  external_url: string;
  attributes: MetadataAttribute[];
  properties?: {
    source_tx_hash?: string;
    archetype?: string;
    block_number?: string;
  };
};

function rarityViewerTone(tier?: string) {
  if (tier === "Legendary") {
    return {
      panel: "border-[#f0c232]/28 bg-[#2b1e06] text-[#ffe7a3]",
      label: "text-[#f0c232]",
      body: "text-[#ffe7a3]",
    };
  }
  if (tier === "Very Rare") {
    return {
      panel: "border-[#00C805]/24 bg-[#0a1a0f] text-[#d4f5d6]",
      label: "text-[#00C805]",
      body: "text-[#d4f5d6]",
    };
  }
  if (tier === "Rare") {
    return {
      panel: "border-[#2d5a35]/24 bg-[#0f1a14] text-[#b8c9bb]",
      label: "text-[#2d5a35]",
      body: "text-[#b8c9bb]",
    };
  }
  return {
    panel: "border-white/10 bg-black/25 text-white/72",
    label: "text-white/42",
    body: "text-white/72",
  };
}

export default function TokenViewerPage() {
  const [tokenId, setTokenId] = useState<string>("");
  const [metadata, setMetadata] = useState<TokenMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [totalMinted, setTotalMinted] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      const match =
        typeof window === "undefined"
          ? null
          : window.location.pathname.match(/\/token\/([^/]+)/);
      const nextTokenId = match?.[1];
      if (!active || !nextTokenId) {
        if (active && !nextTokenId) {
          setError("Token id is missing from the current URL.");
        }
        return;
      }

      setTokenId(nextTokenId);
      try {
        const [response, mintState] = await Promise.all([
          fetch(`/api/metadata/${nextTokenId}`, {
            cache: "no-store",
          }),
          readMintState(),
        ]);
        const payload = (await response.json()) as TokenMetadata | { error: string };
        if (!response.ok || "error" in payload) {
          throw new Error("error" in payload ? payload.error : "Could not load token metadata.");
        }
        if (active) {
          setMetadata(payload);
          setTotalMinted(mintState ? Number(mintState.totalMinted) : null);
        }
      } catch (caughtError) {
        if (active) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Could not load token metadata.",
          );
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, []);

  const numericTokenId = Number.parseInt(tokenId, 10);
  const hasPrevious = Number.isFinite(numericTokenId) && numericTokenId > 0;
  const hasNext =
    Number.isFinite(numericTokenId) &&
    totalMinted !== null &&
    numericTokenId < Math.max(0, totalMinted - 1);
  const highlightedTraits = (metadata?.attributes ?? []).filter((attribute) =>
    ["Rarity", "Rarity Drivers", "Identity Class", "Headwear", "Backdrop", "Special Signal"].includes(
      attribute.trait_type,
    ),
  );
  const remainingTraits = (metadata?.attributes ?? []).filter(
    (attribute) =>
      !["Rarity", "Rarity Drivers", "Identity Class", "Headwear", "Backdrop", "Special Signal"].includes(
        attribute.trait_type,
      ),
  );
  const rarityValue = metadata?.attributes.find((attribute) => attribute.trait_type === "Rarity")
    ?.value as string | undefined;
  const rarityDrivers = metadata?.attributes.find(
    (attribute) => attribute.trait_type === "Rarity Drivers",
  )?.value as string | undefined;
  const rarityTone = rarityViewerTone(rarityValue);

  return (
    <main className="min-h-screen bg-[#0A0F0D] px-5 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/#mint"
            className="inline-flex rounded-full border border-white/10 bg-white/4 px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/70 transition hover:border-[#00C805]/35 hover:text-white"
          >
            Back To Mint Console
          </Link>
          {hasPrevious ? (
            <Link
              href={`/token/${numericTokenId - 1}`}
              className="inline-flex rounded-full border border-white/10 bg-white/4 px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/70 transition hover:border-[#00C805]/35 hover:text-white"
            >
              Prev Token
            </Link>
          ) : null}
          {hasNext ? (
            <Link
              href={`/token/${numericTokenId + 1}`}
              className="inline-flex rounded-full border border-white/10 bg-white/4 px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/70 transition hover:border-[#00C805]/35 hover:text-white"
            >
              Next Token
            </Link>
          ) : null}
          {tokenId ? (
            <a
              href={`/api/metadata/${tokenId}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full border border-white/10 bg-white/4 px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/70 transition hover:border-[#00C805]/35 hover:text-white"
            >
              Open Metadata
            </a>
          ) : null}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className="rounded-[1.8rem] border border-white/10 bg-[#0f1a14] p-5">
            {metadata ? (
              <Image
                src={metadata.image}
                alt={metadata.name}
                width={640}
                height={640}
                unoptimized
                className="w-full rounded-[1.3rem] border border-white/10 bg-black/30 [image-rendering:pixelated]"
              />
            ) : (
              <div className="flex aspect-square items-center justify-center rounded-[1.3rem] border border-white/10 bg-black/30 text-white/40">
                Loading token...
              </div>
            )}
          </div>

          <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.035] p-6">
            <div className="text-[0.7rem] uppercase tracking-[0.28em] text-[#00C805]">
              Token Viewer
            </div>
            <h1 className="mt-3 text-4xl font-semibold">
              {metadata?.name ?? `HOODPUNK #${tokenId || "..."}`}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/62">
              {metadata?.description ??
                "Loading chain-linked metadata and local art preview for this minted token."}
            </p>

            {totalMinted !== null && Number.isFinite(numericTokenId) ? (
              <div className="mt-5 rounded-[1.1rem] border border-white/10 bg-black/25 px-4 py-3 text-sm leading-6 text-white/62">
                Token #{numericTokenId} inside a live collection of {totalMinted} minted HOODPUNKS.
              </div>
            ) : null}

            {metadata?.properties?.source_tx_hash ? (
              <div className="mt-5 rounded-[1.1rem] border border-white/10 bg-black/25 px-4 py-3 font-mono text-sm text-white/72">
                Source tx: {metadata.properties.source_tx_hash}
              </div>
            ) : null}

            {rarityValue ? (
              <div className={`mt-5 rounded-[1.1rem] border px-4 py-3 text-sm leading-6 ${rarityTone.panel}`}>
                <span className={`text-[0.68rem] uppercase tracking-[0.24em] ${rarityTone.label}`}>
                  Rarity
                </span>
                <div className="mt-2 text-xl font-semibold text-white">
                  {rarityValue}
                </div>
                {rarityDrivers ? (
                  <div className={`mt-2 text-sm leading-6 ${rarityTone.body}`}>
                    {rarityDrivers}
                  </div>
                ) : null}
              </div>
            ) : null}

            {highlightedTraits.length > 0 ? (
              <div className="mt-5 rounded-[1.2rem] border border-white/10 bg-black/25 p-4">
                <div className="text-[0.68rem] uppercase tracking-[0.24em] text-[#00C805]">
                  Special Traits
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {highlightedTraits.map((attribute) => (
                    <div
                      key={`${attribute.trait_type}-${attribute.value}`}
                      className="rounded-[1rem] border border-white/10 bg-white/[0.035] p-3"
                    >
                      <div className="text-[0.68rem] uppercase tracking-[0.22em] text-white/42">
                        {attribute.trait_type}
                      </div>
                      <div className="mt-2 text-base font-semibold text-white">
                        {String(attribute.value)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {error ? (
              <div className="mt-5 rounded-[1.1rem] border border-[#ff8757]/25 bg-[#ff8757]/10 px-4 py-3 text-sm leading-6 text-[#ffd5c3]">
                {error}
              </div>
            ) : null}

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {remainingTraits.map((attribute) => (
                <div
                  key={`${attribute.trait_type}-${attribute.value}`}
                  className="rounded-[1.2rem] border border-white/10 bg-black/35 p-4"
                >
                  <div className="text-[0.68rem] uppercase tracking-[0.24em] text-white/42">
                    {attribute.trait_type}
                  </div>
                  <div className="mt-2 text-lg font-semibold text-white">
                    {String(attribute.value)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
