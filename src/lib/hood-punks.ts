import cryptoPunksHoodieTemplate from "./cryptopunks-hoodie-template.json";

export type AnalyzeKind = "transaction" | "address" | "block";

export type MutationDescriptor = {
  name: string;
  detail: string;
  intensity: "low" | "medium" | "high";
};

export type TraitExplanation = {
  label: string;
  value: string;
  reason: string;
};

export type HoodPunkAnalysis = {
  kind: AnalyzeKind;
  query: string;
  network: "robinhood";
  rpcSource: string;
  seed: string;
  title: string;
  archetype: string;
  timestampIso: string;
  blockNumber: string;
  gasGwei: number;
  valueEth: number;
  nonce: number;
  entropyScore: number;
  congestionScore: number;
  walletSignal: number;
  status: "confirmed" | "failed" | "pending";
  corruptionLevel: "stable" | "strained" | "corrupted";
  walletEra: "fresh" | "seasoned" | "ancient";
  whaleSignal: boolean;
  mevSignal: boolean;
  mutations: MutationDescriptor[];
  traits: TraitExplanation[];
};

export type PunkRenderMode = "classic" | "legacy";
export type RarityTier = "Common" | "Rare" | "Very Rare" | "Legendary";

export type RarityProfile = {
  tier: RarityTier;
  detail: string;
  triggers: string[];
};

export type SpecialTraitSet = {
  identityClass?: string;
  backdrop?: string;
  headwear?: string;
  hoodie?: string;
  specialSignal?: string;
};

type Primitive = {
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
  opacity?: number;
  rx?: number;
};

type Palette = {
  background: string;
  haze: string;
  frame: string;
  skin: string;
  shadow: string;
  hair: string;
  shirt: string;
  accent: string;
  neon: string;
  damage: string;
  metal: string;
};

type ArchetypeSpec = {
  name: string;
  mask?: Primitive[];
  hair: Primitive[];
  accessories: Primitive[];
  features: Primitive[];
  shirt: Primitive[];
};

const legacyArchetypes: ArchetypeSpec[] = [
  {
    name: "OG Default",
    mask: [
      { x: 6, y: 8, w: 1, h: 6, fill: "frame" },
      { x: 7, y: 6, w: 1, h: 12, fill: "frame" },
      { x: 8, y: 5, w: 1, h: 1, fill: "frame" },
      { x: 9, y: 4, w: 1, h: 1, fill: "frame" },
      { x: 10, y: 3, w: 6, h: 1, fill: "frame" },
      { x: 16, y: 4, w: 1, h: 1, fill: "frame" },
      { x: 17, y: 5, w: 1, h: 12, fill: "frame" },
      { x: 16, y: 17, w: 1, h: 1, fill: "frame" },
      { x: 15, y: 18, w: 1, h: 1, fill: "frame" },
      { x: 14, y: 19, w: 1, h: 1, fill: "frame" },
      { x: 10, y: 20, w: 4, h: 1, fill: "frame" },
      { x: 10, y: 21, w: 1, h: 3, fill: "frame" },
      { x: 13, y: 21, w: 1, h: 3, fill: "frame" },
      { x: 8, y: 4, w: 8, h: 16, fill: "skin" },
      { x: 7, y: 7, w: 1, h: 11, fill: "skin" },
      { x: 16, y: 5, w: 1, h: 12, fill: "skin" },
      { x: 15, y: 18, w: 1, h: 1, fill: "skin" },
      { x: 14, y: 19, w: 1, h: 1, fill: "skin" },
      { x: 11, y: 21, w: 2, h: 3, fill: "skin" },
      { x: 9, y: 8, w: 1, h: 1, fill: "#d9c29f" },
      { x: 9, y: 10, w: 1, h: 1, fill: "frame" },
      { x: 13, y: 10, w: 1, h: 1, fill: "frame" },
      { x: 12, y: 13, w: 1, h: 2, fill: "frame" },
      { x: 13, y: 16, w: 3, h: 1, fill: "#871818" },
    ],
    hair: [
      { x: 8, y: 3, w: 7, h: 1, fill: "#050505" },
      { x: 8, y: 4, w: 5, h: 2, fill: "#050505" },
      { x: 7, y: 5, w: 2, h: 2, fill: "#050505" },
    ],
    accessories: [
      { x: 7, y: 12, w: 1, h: 1, fill: "#040404" },
    ],
    features: [
      { x: 9, y: 16, w: 3, h: 1, fill: "#871818" },
    ],
    shirt: [],
  },
  {
    name: "Mohawk Ember",
    mask: [
      { x: 6, y: 8, w: 1, h: 6, fill: "frame" },
      { x: 7, y: 6, w: 1, h: 12, fill: "frame" },
      { x: 8, y: 5, w: 1, h: 1, fill: "frame" },
      { x: 9, y: 4, w: 1, h: 1, fill: "frame" },
      { x: 10, y: 3, w: 6, h: 1, fill: "frame" },
      { x: 16, y: 4, w: 1, h: 1, fill: "frame" },
      { x: 17, y: 5, w: 1, h: 12, fill: "frame" },
      { x: 16, y: 17, w: 1, h: 1, fill: "frame" },
      { x: 15, y: 18, w: 1, h: 1, fill: "frame" },
      { x: 14, y: 19, w: 1, h: 1, fill: "frame" },
      { x: 10, y: 20, w: 4, h: 1, fill: "frame" },
      { x: 10, y: 21, w: 1, h: 3, fill: "frame" },
      { x: 13, y: 21, w: 1, h: 3, fill: "frame" },
      { x: 8, y: 4, w: 8, h: 16, fill: "#bb9870" },
      { x: 7, y: 7, w: 1, h: 11, fill: "#bb9870" },
      { x: 16, y: 5, w: 1, h: 12, fill: "#bb9870" },
      { x: 15, y: 18, w: 1, h: 1, fill: "#bb9870" },
      { x: 14, y: 19, w: 1, h: 1, fill: "#bb9870" },
      { x: 11, y: 21, w: 2, h: 3, fill: "#bb9870" },
      { x: 9, y: 8, w: 1, h: 1, fill: "#d9c29f" },
      { x: 9, y: 10, w: 1, h: 1, fill: "frame" },
      { x: 13, y: 10, w: 1, h: 1, fill: "frame" },
      { x: 12, y: 13, w: 1, h: 2, fill: "frame" },
      { x: 9, y: 16, w: 3, h: 1, fill: "#cf0cd8" },
    ],
    hair: [
      { x: 7, y: 3, w: 2, h: 1, fill: "#020202" },
      { x: 8, y: 2, w: 2, h: 1, fill: "#020202" },
      { x: 9, y: 1, w: 2, h: 1, fill: "#020202" },
      { x: 10, y: 0, w: 2, h: 1, fill: "#020202" },
      { x: 12, y: 1, w: 1, h: 6, fill: "#020202" },
      { x: 10, y: 1, w: 2, h: 6, fill: "#a56e2a" },
    ],
    accessories: [
      { x: 7, y: 12, w: 1, h: 1, fill: "#040404" },
    ],
    features: [
      { x: 8, y: 7, w: 1, h: 1, fill: "#d4c0a5" },
      { x: 9, y: 16, w: 3, h: 1, fill: "#cf0cd8" },
    ],
    shirt: [],
  },
  {
    name: "Azure Femme",
    mask: [
      { x: 6, y: 8, w: 1, h: 6, fill: "frame" },
      { x: 7, y: 6, w: 1, h: 12, fill: "frame" },
      { x: 8, y: 5, w: 1, h: 1, fill: "frame" },
      { x: 9, y: 4, w: 1, h: 1, fill: "frame" },
      { x: 10, y: 4, w: 6, h: 1, fill: "frame" },
      { x: 16, y: 5, w: 1, h: 1, fill: "frame" },
      { x: 17, y: 6, w: 1, h: 11, fill: "frame" },
      { x: 16, y: 17, w: 1, h: 1, fill: "frame" },
      { x: 15, y: 18, w: 1, h: 1, fill: "frame" },
      { x: 14, y: 19, w: 1, h: 1, fill: "frame" },
      { x: 10, y: 20, w: 4, h: 1, fill: "frame" },
      { x: 10, y: 21, w: 1, h: 3, fill: "frame" },
      { x: 13, y: 21, w: 1, h: 3, fill: "frame" },
      { x: 8, y: 5, w: 8, h: 15, fill: "#e1bb8e" },
      { x: 7, y: 7, w: 1, h: 11, fill: "#e1bb8e" },
      { x: 16, y: 6, w: 1, h: 11, fill: "#e1bb8e" },
      { x: 15, y: 18, w: 1, h: 1, fill: "#e1bb8e" },
      { x: 14, y: 19, w: 1, h: 1, fill: "#e1bb8e" },
      { x: 11, y: 21, w: 2, h: 3, fill: "#e1bb8e" },
      { x: 9, y: 10, w: 1, h: 1, fill: "frame" },
      { x: 13, y: 10, w: 1, h: 1, fill: "frame" },
      { x: 12, y: 13, w: 1, h: 2, fill: "frame" },
      { x: 13, y: 16, w: 3, h: 1, fill: "#8c1717" },
    ],
    hair: [
      { x: 5, y: 4, w: 10, h: 3, fill: "#2349d9" },
      { x: 4, y: 5, w: 3, h: 1, fill: "#2349d9" },
      { x: 4, y: 6, w: 2, h: 1, fill: "#2349d9" },
      { x: 8, y: 7, w: 2, h: 5, fill: "#3460ff" },
    ],
    accessories: [
      { x: 7, y: 10, w: 1, h: 1, fill: "#030303" },
      { x: 6, y: 11, w: 1, h: 1, fill: "#f0c232" },
    ],
    features: [
      { x: 9, y: 9, w: 1, h: 3, fill: "#4a67d6" },
      { x: 13, y: 16, w: 3, h: 1, fill: "#8d1f1f" },
    ],
    shirt: [],
  },
  {
    name: "Classic Cigarette",
    mask: [
      { x: 6, y: 8, w: 1, h: 8, fill: "frame" },
      { x: 7, y: 6, w: 1, h: 14, fill: "frame" },
      { x: 8, y: 5, w: 1, h: 1, fill: "frame" },
      { x: 9, y: 4, w: 1, h: 1, fill: "frame" },
      { x: 10, y: 3, w: 6, h: 1, fill: "frame" },
      { x: 16, y: 4, w: 1, h: 1, fill: "frame" },
      { x: 17, y: 5, w: 1, h: 13, fill: "frame" },
      { x: 16, y: 18, w: 1, h: 1, fill: "frame" },
      { x: 15, y: 19, w: 1, h: 1, fill: "frame" },
      { x: 10, y: 20, w: 4, h: 1, fill: "frame" },
      { x: 10, y: 21, w: 1, h: 3, fill: "frame" },
      { x: 13, y: 21, w: 1, h: 3, fill: "frame" },
      { x: 8, y: 4, w: 8, h: 15, fill: "#b99667" },
      { x: 7, y: 7, w: 1, h: 12, fill: "#b99667" },
      { x: 16, y: 5, w: 1, h: 13, fill: "#b99667" },
      { x: 15, y: 19, w: 1, h: 1, fill: "#b99667" },
      { x: 11, y: 21, w: 2, h: 3, fill: "#b99667" },
      { x: 9, y: 8, w: 1, h: 1, fill: "#d2c09b" },
      { x: 9, y: 10, w: 1, h: 1, fill: "frame" },
      { x: 13, y: 10, w: 1, h: 1, fill: "frame" },
      { x: 12, y: 13, w: 1, h: 2, fill: "frame" },
    ],
    hair: [
      { x: 7, y: 3, w: 2, h: 1, fill: "#020202" },
      { x: 8, y: 2, w: 2, h: 1, fill: "#020202" },
      { x: 9, y: 1, w: 2, h: 1, fill: "#020202" },
      { x: 10, y: 0, w: 2, h: 1, fill: "#020202" },
      { x: 12, y: 1, w: 1, h: 6, fill: "#020202" },
      { x: 10, y: 1, w: 2, h: 6, fill: "#a56e2a" },
    ],
    accessories: [
      { x: 6, y: 11, w: 1, h: 1, fill: "#f0c232" },
      { x: 15, y: 15, w: 4, h: 1, fill: "#050505" },
      { x: 19, y: 15, w: 3, h: 1, fill: "#dadada" },
      { x: 22, y: 15, w: 1, h: 1, fill: "#ea5325" },
    ],
    features: [
      { x: 9, y: 8, w: 1, h: 1, fill: "#c9bb9e" },
    ],
    shirt: [],
  },
  {
    name: "Iron Crest",
    hair: [
      { x: 9, y: 2, w: 3, h: 1, fill: "#020202" },
      { x: 10, y: 3, w: 2, h: 5, fill: "#020202" },
      { x: 10, y: 3, w: 1, h: 5, fill: "#7f7f7f" },
    ],
    accessories: [
      { x: 7, y: 12, w: 1, h: 1, fill: "#040404" },
    ],
    features: [
      { x: 9, y: 10, w: 1, h: 1, fill: "#587f43" },
      { x: 13, y: 16, w: 3, h: 1, fill: "#8d1f1f" },
    ],
    shirt: [],
  },
  {
    name: "Terminal Addict",
    hair: [
      { x: 7, y: 4, w: 2, h: 1, fill: "#020202" },
      { x: 8, y: 3, w: 2, h: 1, fill: "#020202" },
      { x: 9, y: 2, w: 2, h: 1, fill: "#020202" },
      { x: 10, y: 1, w: 2, h: 1, fill: "#020202" },
      { x: 12, y: 2, w: 1, h: 5, fill: "#020202" },
      { x: 10, y: 2, w: 2, h: 5, fill: "#5f5f5f" },
    ],
    accessories: [
      { x: 7, y: 12, w: 1, h: 1, fill: "#040404" },
    ],
    features: [
      { x: 9, y: 16, w: 3, h: 1, fill: "#d10bd6" },
    ],
    shirt: [],
  },
  {
    name: "Hacker Glitch",
    hair: [
      { x: 6, y: 4, w: 9, h: 3, fill: "#2349d9" },
      { x: 5, y: 6, w: 3, h: 1, fill: "#2349d9" },
      { x: 7, y: 7, w: 2, h: 1, fill: "#2349d9" },
    ],
    accessories: [
      { x: 7, y: 12, w: 1, h: 1, fill: "#040404" },
      { x: 14, y: 15, w: 4, h: 1, fill: "#050505" },
      { x: 18, y: 15, w: 2, h: 1, fill: "#dadada" },
      { x: 20, y: 15, w: 1, h: 1, fill: "#ea5325" },
    ],
    features: [
      { x: 9, y: 9, w: 1, h: 3, fill: "#4a67d6" },
      { x: 13, y: 16, w: 3, h: 1, fill: "#8d1f1f" },
    ],
    shirt: [],
  },
  {
    name: "Zombie Rot",
    hair: [
      { x: 8, y: 3, w: 7, h: 1, fill: "#050505" },
      { x: 8, y: 4, w: 4, h: 2, fill: "#050505" },
    ],
    accessories: [{ x: 7, y: 12, w: 1, h: 1, fill: "#040404" }],
    features: [
      { x: 8, y: 5, w: 8, h: 14, fill: "#7fa65a" },
      { x: 7, y: 7, w: 1, h: 11, fill: "#7fa65a" },
      { x: 16, y: 5, w: 1, h: 12, fill: "#7fa65a" },
      { x: 11, y: 21, w: 2, h: 3, fill: "#7fa65a" },
      { x: 9, y: 10, w: 1, h: 1, fill: "#3b5128" },
      { x: 13, y: 10, w: 1, h: 1, fill: "#3b5128" },
      { x: 12, y: 13, w: 1, h: 2, fill: "#3b5128" },
      { x: 12, y: 16, w: 3, h: 1, fill: "#4d261f" },
    ],
    shirt: [],
  },
  {
    name: "Hooded Wraith",
    hair: [],
    accessories: [{ x: 7, y: 12, w: 1, h: 1, fill: "#040404" }],
    features: [
      { x: 9, y: 10, w: 1, h: 1, fill: "#66ff7a" },
      { x: 13, y: 10, w: 1, h: 1, fill: "#66ff7a" },
      { x: 12, y: 16, w: 3, h: 1, fill: "#6f7177" },
    ],
    shirt: [],
  },
];

/** CryptoPunk-style flesh tones */
const CRYPTO_SKIN_TONES = [
  "#c2996b",
  "#ffe0bd",
  "#8d5524",
  "#e0ac69",
  "#ffdbac",
  "#6b4c2a",
  "#a86f48",
  "#d08b5b",
];

const HOOD_GREEN = "#00C805";
const HOOD_GREEN_DARK = "#00A004";

/** CryptoPunks Hoodie — traced from user reference (FOtjOt3XIAYk00L.png) */
const HOODIE_VARIANTS = [
  { name: "Hoodie", hood: "#648596", shadow: "#555555" },
  { name: "Robinhood Hoodie", hood: HOOD_GREEN, shadow: HOOD_GREEN_DARK },
  { name: "Shadow Hoodie", hood: "#2b3137", shadow: "#15181c" },
  { name: "Royal Hoodie", hood: "#3460ff", shadow: "#2349d9" },
  { name: "Violet Hoodie", hood: "#6b2d82", shadow: "#3d1f4a" },
  { name: "Ember Hoodie", hood: "#a56e2a", shadow: "#4a3520" },
] as const;

type HoodieTemplateRect = { x: number; y: number; w: number; h: number };

function hoodieVariantFromSeed(seed: string) {
  const sanitizedSeed = seed.replace(/^0x/, "").padEnd(24, "0");
  const roll =
    Number.parseInt(sanitizedSeed.slice(20, 24), 16) ||
    Number.parseInt(sanitizedSeed.slice(0, 4), 16) ||
    0;
  return HOODIE_VARIANTS[roll % HOODIE_VARIANTS.length];
}

export function deriveHoodieName(seed: string) {
  return hoodieVariantFromSeed(seed).name;
}

function mapHoodieTemplateLayer(rects: HoodieTemplateRect[], fill: string): Primitive[] {
  return rects.map((rect) => ({ ...rect, fill }));
}

function buildHoodieLayers(seed: string) {
  const hoodie = hoodieVariantFromSeed(seed);
  const template = cryptoPunksHoodieTemplate as {
    hood: HoodieTemplateRect[];
    shadow: HoodieTemplateRect[];
    outline: HoodieTemplateRect[];
  };

  return {
    shadow: mapHoodieTemplateLayer(template.shadow, hoodie.shadow),
    hood: mapHoodieTemplateLayer(template.hood, hoodie.hood),
    outline: mapHoodieTemplateLayer(template.outline, "#000000"),
  };
}

/** Classic CryptoPunk front-face silhouette (24×24) */
const classicBaseMask: Primitive[] = [
  { x: 8, y: 4, w: 1, h: 1, fill: "frame" },
  { x: 9, y: 3, w: 1, h: 1, fill: "frame" },
  { x: 10, y: 2, w: 1, h: 1, fill: "frame" },
  { x: 11, y: 1, w: 1, h: 1, fill: "frame" },
  { x: 12, y: 2, w: 1, h: 1, fill: "frame" },
  { x: 13, y: 3, w: 1, h: 1, fill: "frame" },
  { x: 14, y: 4, w: 1, h: 1, fill: "frame" },
  { x: 9, y: 4, w: 1, h: 15, fill: "frame" },
  { x: 10, y: 3, w: 6, h: 1, fill: "frame" },
  { x: 16, y: 4, w: 1, h: 1, fill: "frame" },
  { x: 17, y: 5, w: 1, h: 11, fill: "frame" },
  { x: 16, y: 16, w: 1, h: 1, fill: "frame" },
  { x: 15, y: 17, w: 1, h: 1, fill: "frame" },
  { x: 14, y: 18, w: 1, h: 1, fill: "frame" },
  { x: 13, y: 19, w: 1, h: 1, fill: "frame" },
  { x: 11, y: 20, w: 2, h: 1, fill: "frame" },
  { x: 11, y: 21, w: 1, h: 3, fill: "frame" },
  { x: 8, y: 9, w: 1, h: 4, fill: "frame" },
  { x: 7, y: 10, w: 1, h: 2, fill: "frame" },
  { x: 10, y: 4, w: 6, h: 15, fill: "skin" },
  { x: 9, y: 5, w: 1, h: 14, fill: "skin" },
  { x: 8, y: 10, w: 1, h: 2, fill: "skin" },
  { x: 10, y: 21, w: 2, h: 3, fill: "skin" },
  { x: 10, y: 7, w: 1, h: 1, fill: "highlight" },
  { x: 11, y: 10, w: 1, h: 1, fill: "frame" },
  { x: 14, y: 10, w: 1, h: 1, fill: "frame" },
  { x: 13, y: 13, w: 1, h: 2, fill: "frame" },
];

function skinToneFromSeed(seed: string) {
  return CRYPTO_SKIN_TONES[hashToSeed(seed) % CRYPTO_SKIN_TONES.length];
}

function mapCryptoPunkPrimitives(primitives: Primitive[], skin: string): Primitive[] {
  return primitives.map((primitive) => {
    if (primitive.fill === "skin") return { ...primitive, fill: skin };
    if (primitive.fill === "frame") return { ...primitive, fill: "#000000" };
    if (primitive.fill === "highlight") return { ...primitive, fill: "#d7be99" };
    return primitive;
  });
}

const classicArchetypes: ArchetypeSpec[] = [
  {
    name: "Hood OG",
    mask: [
      ...classicBaseMask,
      { x: 12, y: 16, w: 4, h: 1, fill: "#7f1111" },
    ],
    hair: [
      { x: 11, y: 2, w: 1, h: 6, fill: HOOD_GREEN },
    ],
    accessories: [{ x: 8, y: 12, w: 1, h: 1, fill: HOOD_GREEN }],
    features: [
      { x: 11, y: 10, w: 1, h: 1, fill: HOOD_GREEN },
      { x: 14, y: 10, w: 1, h: 1, fill: HOOD_GREEN },
    ],
    shirt: [],
  },
  {
    name: "Green Beanie",
    mask: [...classicBaseMask, { x: 12, y: 16, w: 3, h: 1, fill: "#871818" }],
    hair: [
      { x: 8, y: 3, w: 8, h: 2, fill: HOOD_GREEN },
      { x: 9, y: 2, w: 6, h: 1, fill: HOOD_GREEN_DARK },
    ],
    accessories: [],
    features: [],
    shirt: [],
  },
  {
    name: "Robinhood Hoodie",
    mask: [...classicBaseMask],
    hair: [],
    accessories: [{ x: 12, y: 14, w: 1, h: 1, fill: HOOD_GREEN }],
    features: [],
    shirt: [],
  },
  {
    name: "Mohawk Ember",
    mask: [
      ...classicBaseMask,
      { x: 13, y: 16, w: 3, h: 1, fill: "#cf0cd8" },
    ],
    hair: [
      { x: 10, y: 0, w: 2, h: 1, fill: "#020202" },
      { x: 11, y: 1, w: 2, h: 1, fill: "#020202" },
      { x: 12, y: 2, w: 1, h: 6, fill: "#020202" },
      { x: 11, y: 1, w: 1, h: 6, fill: "#a56e2a" },
    ],
    accessories: [{ x: 8, y: 12, w: 1, h: 1, fill: "#040404" }],
    features: [
      { x: 10, y: 7, w: 1, h: 1, fill: "#d4c0a5" },
      { x: 12, y: 16, w: 3, h: 1, fill: "#cf0cd8" },
    ],
    shirt: [],
  },
  {
    name: "Azure Femme",
    mask: [
      ...classicBaseMask,
      { x: 13, y: 16, w: 3, h: 1, fill: "#8d1f1f" },
    ],
    hair: [
      { x: 6, y: 4, w: 10, h: 3, fill: "#2349d9" },
      { x: 5, y: 5, w: 2, h: 1, fill: "#2349d9" },
      { x: 5, y: 6, w: 1, h: 1, fill: "#2349d9" },
      { x: 11, y: 7, w: 2, h: 4, fill: "#3460ff" },
    ],
    accessories: [
      { x: 8, y: 12, w: 1, h: 1, fill: "#030303" },
      { x: 7, y: 12, w: 1, h: 1, fill: "#f0c232" },
    ],
    features: [
      { x: 11, y: 9, w: 1, h: 3, fill: "#4a67d6" },
      { x: 13, y: 16, w: 3, h: 1, fill: "#8d1f1f" },
    ],
    shirt: [],
  },
  {
    name: "Classic Cigarette",
    mask: [...classicBaseMask],
    hair: [
      { x: 10, y: 0, w: 2, h: 1, fill: "#020202" },
      { x: 11, y: 1, w: 2, h: 1, fill: "#020202" },
      { x: 12, y: 2, w: 1, h: 6, fill: "#020202" },
      { x: 11, y: 1, w: 1, h: 6, fill: "#a56e2a" },
    ],
    accessories: [
      { x: 8, y: 12, w: 1, h: 1, fill: "#f0c232" },
      { x: 15, y: 15, w: 4, h: 1, fill: "#050505" },
      { x: 19, y: 15, w: 3, h: 1, fill: "#dadada" },
      { x: 22, y: 15, w: 1, h: 1, fill: "#ea5325" },
    ],
    features: [{ x: 10, y: 7, w: 1, h: 1, fill: "#c9bb9e" }],
    shirt: [],
  },
  {
    name: "Iron Crest",
    mask: [...classicBaseMask, { x: 13, y: 16, w: 3, h: 1, fill: "#8d1f1f" }],
    hair: [
      { x: 11, y: 2, w: 2, h: 1, fill: "#020202" },
      { x: 12, y: 3, w: 1, h: 5, fill: "#020202" },
      { x: 12, y: 3, w: 1, h: 5, fill: "#7f7f7f" },
    ],
    accessories: [{ x: 8, y: 12, w: 1, h: 1, fill: "#040404" }],
    features: [
      { x: 11, y: 10, w: 1, h: 1, fill: "#587f43" },
      { x: 13, y: 16, w: 3, h: 1, fill: "#8d1f1f" },
    ],
    shirt: [],
  },
  {
    name: "Terminal Addict",
    mask: [...classicBaseMask, { x: 12, y: 16, w: 3, h: 1, fill: "#d10bd6" }],
    hair: [
      { x: 9, y: 3, w: 3, h: 1, fill: "#020202" },
      { x: 10, y: 2, w: 3, h: 1, fill: "#020202" },
      { x: 11, y: 2, w: 1, h: 5, fill: "#5f5f5f" },
      { x: 12, y: 2, w: 1, h: 5, fill: "#020202" },
    ],
    accessories: [{ x: 8, y: 12, w: 1, h: 1, fill: "#040404" }],
    features: [{ x: 12, y: 16, w: 3, h: 1, fill: "#d10bd6" }],
    shirt: [],
  },
  {
    name: "Hacker Glitch",
    mask: [...classicBaseMask, { x: 13, y: 16, w: 3, h: 1, fill: "#8d1f1f" }],
    hair: [
      { x: 6, y: 4, w: 9, h: 3, fill: "#2349d9" },
      { x: 5, y: 5, w: 2, h: 1, fill: "#2349d9" },
      { x: 7, y: 7, w: 2, h: 1, fill: "#2349d9" },
    ],
    accessories: [
      { x: 8, y: 12, w: 1, h: 1, fill: "#040404" },
      { x: 14, y: 15, w: 4, h: 1, fill: "#050505" },
      { x: 18, y: 15, w: 2, h: 1, fill: "#dadada" },
      { x: 20, y: 15, w: 1, h: 1, fill: "#ea5325" },
    ],
    features: [
      { x: 11, y: 9, w: 1, h: 3, fill: "#4a67d6" },
      { x: 13, y: 16, w: 3, h: 1, fill: "#8d1f1f" },
    ],
    shirt: [],
  },
  {
    name: "Zombie Rot",
    mask: [
      ...classicBaseMask.map((primitive) =>
        primitive.fill === "skin" ? { ...primitive, fill: "#7fa65a" } : primitive,
      ),
      { x: 13, y: 16, w: 3, h: 1, fill: "#4d261f" },
    ],
    hair: [
      { x: 8, y: 3, w: 8, h: 1, fill: "#050505" },
      { x: 8, y: 4, w: 4, h: 2, fill: "#050505" },
    ],
    accessories: [{ x: 8, y: 12, w: 1, h: 1, fill: "#040404" }],
    features: [
      { x: 10, y: 7, w: 1, h: 1, fill: "#9eb879" },
      { x: 11, y: 10, w: 1, h: 1, fill: "#314126" },
      { x: 14, y: 10, w: 1, h: 1, fill: "#314126" },
      { x: 13, y: 16, w: 3, h: 1, fill: "#4d261f" },
    ],
    shirt: [],
  },
  {
    name: "Hooded Wraith",
    mask: [...classicBaseMask, { x: 13, y: 16, w: 3, h: 1, fill: "#6f7177" }],
    hair: [],
    accessories: [{ x: 8, y: 12, w: 1, h: 1, fill: "#040404" }],
    features: [
      { x: 11, y: 10, w: 1, h: 1, fill: "#66ff7a" },
      { x: 14, y: 10, w: 1, h: 1, fill: "#66ff7a" },
      { x: 13, y: 16, w: 3, h: 1, fill: "#6f7177" },
    ],
    shirt: [],
  },
];

const warmPalette: Palette = {
  background: "#0A0F0D",
  haze: "#111916",
  frame: "#1E2B24",
  skin: "#9f8f80",
  shadow: "#4c352f",
  hair: "#dbdacb",
  shirt: "#152018",
  accent: "#00C805",
  neon: "#66ff7a",
  damage: "#f16f40",
  metal: "#8B9A8F",
};

const calmPalette: Palette = {
  background: "#0A0F0D",
  haze: "#111916",
  frame: "#1E2B24",
  skin: "#a8998f",
  shadow: "#63524a",
  hair: "#dde2dd",
  shirt: "#152018",
  accent: "#00A004",
  neon: "#00C805",
  damage: "#678298",
  metal: "#8B9A8F",
};

const ancientPalette: Palette = {
  background: "#060806",
  haze: "#0A0F0D",
  frame: "#1E2B24",
  skin: "#9d9d9d",
  shadow: "#5a5a5a",
  hair: "#dfdfdf",
  shirt: "#111916",
  accent: "#00C805",
  neon: "#d4f5d6",
  damage: "#7d7d7d",
  metal: "#8B9A8F",
};

const pendingPalette: Palette = {
  background: "#0A0F0D",
  haze: "#111916",
  frame: "#1E2B24",
  skin: "#918980",
  shadow: "#4e4641",
  hair: "#d2d8da",
  shirt: "#152018",
  accent: "#33e016",
  neon: "#00C805",
  damage: "#8da0b2",
  metal: "#8B9A8F",
};

function hashToSeed(input: string) {
  let seed = 0;
  for (let i = 0; i < input.length; i += 1) {
    seed = (seed * 31 + input.charCodeAt(i)) >>> 0;
  }
  return seed;
}

function mulberry32(seed: number) {
  return function next() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function resolvePalette(analysis: HoodPunkAnalysis) {
  if (analysis.walletEra === "ancient") {
    return ancientPalette;
  }
  if (analysis.status === "pending") {
    return pendingPalette;
  }
  if (analysis.gasGwei >= 35 || analysis.corruptionLevel === "corrupted") {
    return warmPalette;
  }
  return calmPalette;
}

function baseFace(palette: Palette): Primitive[] {
  return [
    { x: 6, y: 8, w: 1, h: 6, fill: "frame" },
    { x: 7, y: 6, w: 1, h: 12, fill: "frame" },
    { x: 8, y: 5, w: 1, h: 1, fill: "frame" },
    { x: 9, y: 4, w: 1, h: 1, fill: "frame" },
    { x: 10, y: 3, w: 6, h: 1, fill: "frame" },
    { x: 16, y: 4, w: 1, h: 1, fill: "frame" },
    { x: 17, y: 5, w: 1, h: 12, fill: "frame" },
    { x: 16, y: 17, w: 1, h: 1, fill: "frame" },
    { x: 15, y: 18, w: 1, h: 1, fill: "frame" },
    { x: 14, y: 19, w: 1, h: 1, fill: "frame" },
    { x: 10, y: 20, w: 4, h: 1, fill: "frame" },
    { x: 10, y: 21, w: 1, h: 3, fill: "frame" },
    { x: 13, y: 21, w: 1, h: 3, fill: "frame" },
    { x: 8, y: 4, w: 8, h: 16, fill: "skin" },
    { x: 7, y: 7, w: 1, h: 11, fill: "skin" },
    { x: 16, y: 5, w: 1, h: 12, fill: "skin" },
    { x: 15, y: 18, w: 1, h: 1, fill: "skin" },
    { x: 14, y: 19, w: 1, h: 1, fill: "skin" },
    { x: 11, y: 21, w: 2, h: 3, fill: "skin" },
    { x: 9, y: 7, w: 1, h: 1, fill: "shadow", opacity: 0.16 },
    { x: 9, y: 10, w: 1, h: 1, fill: "background" },
    { x: 13, y: 10, w: 1, h: 1, fill: "background" },
    { x: 12, y: 13, w: 1, h: 2, fill: "background" },
    { x: 7, y: 12, w: 1, h: 1, fill: "shadow", opacity: 0.18 },
    { x: 8, y: 17, w: 5, h: 1, fill: "shadow", opacity: 0.16 },
    { x: 7, y: 18, w: 3, h: 1, fill: "frame" },
  ].map((primitive) => ({
    ...primitive,
    fill: palette[primitive.fill as keyof Palette],
  }));
}

function mapPrimitiveFill(primitives: Primitive[], palette: Palette) {
  return primitives.map((primitive) => ({
    ...primitive,
    fill:
      primitive.fill in palette
        ? palette[primitive.fill as keyof Palette]
        : primitive.fill,
  }));
}

function buildMutationLayers(
  analysis: HoodPunkAnalysis,
  palette: Palette,
  rng: () => number,
  mode: PunkRenderMode,
) {
  const layers: Primitive[] = [];
  const severeHeat = analysis.gasGwei >= 60;
  const highHeat = analysis.gasGwei >= 35;

  if (highHeat) {
    for (let index = 0; index < (severeHeat ? 11 : 7); index += 1) {
      layers.push({
        x: 6 + index,
        y: 15 - (index % 4),
        w: 1,
        h: severeHeat ? 4 + (index % 2) : 3 + (index % 2),
        fill: palette.damage,
        opacity: severeHeat ? 0.75 : 0.58,
      });
    }
    layers.push({ x: 8, y: 5, w: 8, h: 1, fill: "#ffb36b", opacity: severeHeat ? 0.4 : 0.22 });
    layers.push({ x: 7, y: 6, w: 1, h: 10, fill: palette.damage, opacity: severeHeat ? 0.45 : 0.26 });
    layers.push({ x: 16, y: 5, w: 1, h: 12, fill: palette.damage, opacity: severeHeat ? 0.42 : 0.24 });
    layers.push({ x: 9, y: 9, w: 1, h: 1, fill: "#ffd36a", opacity: 0.95 });
    layers.push({ x: 13, y: 9, w: 1, h: 1, fill: "#ffd36a", opacity: 0.95 });
    layers.push({ x: 10, y: 8, w: 1, h: 1, fill: "#ff7a3d", opacity: 0.88 });
    layers.push({ x: 14, y: 8, w: 1, h: 1, fill: "#ff7a3d", opacity: 0.88 });
    layers.push({ x: 11, y: 16, w: 4, h: 1, fill: "#8f140f", opacity: 0.92 });
    layers.push({ x: 15, y: 15, w: 2, h: 1, fill: "#ff6d37", opacity: 0.88 });
    layers.push({ x: 10, y: 20, w: 4, h: 2, fill: "#5c4e48", opacity: severeHeat ? 0.9 : 0.72 });
    layers.push({ x: 11, y: 21, w: 2, h: 2, fill: "#ff7a3d", opacity: severeHeat ? 0.5 : 0.24 });

    if (severeHeat) {
      layers.push({ x: 4, y: 4, w: 16, h: 1, fill: "#ff8a4a", opacity: 0.16 });
      layers.push({ x: 3, y: 18, w: 18, h: 1, fill: "#ff8a4a", opacity: 0.12 });
      layers.push({ x: 18, y: 7, w: 1, h: 8, fill: "#ffb36b", opacity: 0.16 });
      layers.push({ x: 6, y: 17, w: 3, h: 1, fill: "#1f1b1a", opacity: 0.9 });
      layers.push({ x: 13, y: 18, w: 3, h: 1, fill: "#1f1b1a", opacity: 0.9 });
    }
  } else if (analysis.gasGwei <= 10) {
    layers.push({ x: 8, y: 5, w: 8, h: 1, fill: palette.neon, opacity: 0.16 });
    layers.push({ x: 8, y: 19, w: 7, h: 1, fill: palette.neon, opacity: 0.08 });
  }

  if (analysis.congestionScore >= 65) {
    const scatterCount = mode === "classic" ? 4 : 20;
    for (let index = 0; index < scatterCount; index += 1) {
      layers.push({
        x: Math.floor(rng() * 24),
        y: Math.floor(rng() * 24),
        w: 1,
        h: 1,
        fill: index % 3 === 0 ? palette.neon : palette.frame,
        opacity: 0.45,
      });
    }
    layers.push({ x: 3, y: 8, w: 18, h: 1, fill: palette.neon, opacity: 0.18 });
    layers.push({ x: 2, y: 14, w: 20, h: 1, fill: palette.neon, opacity: 0.18 });
  }

  if (analysis.whaleSignal) {
    layers.push({ x: 4, y: 5, w: 1, h: 14, fill: "#6a4f18", opacity: 0.18 });
    layers.push({ x: 19, y: 5, w: 1, h: 14, fill: "#6a4f18", opacity: 0.18 });
    layers.push({ x: 6, y: 4, w: 13, h: 1, fill: "#5e4514", opacity: 0.18 });
    layers.push({ x: 7, y: 19, w: 11, h: 1, fill: "#5e4514", opacity: 0.14 });
    layers.push({ x: 8, y: 3, w: 8, h: 1, fill: "#e4b84b" });
    layers.push({ x: 9, y: 2, w: 1, h: 1, fill: "#f5da7a" });
    layers.push({ x: 11, y: 2, w: 1, h: 1, fill: "#f5da7a" });
    layers.push({ x: 12, y: 1, w: 1, h: 2, fill: "#f5da7a" });
    layers.push({ x: 13, y: 2, w: 1, h: 1, fill: "#f5da7a" });
    layers.push({ x: 15, y: 2, w: 1, h: 1, fill: "#f5da7a" });
    layers.push({ x: 7, y: 12, w: 1, h: 1, fill: "#f0c232" });
    layers.push({ x: 10, y: 7, w: 1, h: 1, fill: "#ffe07a", opacity: 0.95 });
    layers.push({ x: 14, y: 10, w: 1, h: 1, fill: "#ffe07a", opacity: 0.95 });
    layers.push({ x: 16, y: 15, w: 2, h: 1, fill: "#f0c232", opacity: 0.92 });
    layers.push({ x: 10, y: 20, w: 4, h: 1, fill: "#7b5a1b", opacity: 0.82 });
    layers.push({ x: 11, y: 21, w: 2, h: 2, fill: "#d8b14a", opacity: 0.55 });
  }

  if (analysis.status === "failed") {
    layers.push({ x: 9, y: 8, w: 2, h: 1, fill: palette.frame });
    layers.push({ x: 8, y: 18, w: 4, h: 1, fill: palette.damage });
    layers.push({ x: 12, y: 12, w: 1, h: 2, fill: palette.damage });
    for (let index = 0; index < 5; index += 1) {
      layers.push({
        x: 10 + index,
        y: 7 + (index % 2),
        w: 1,
        h: 1,
        fill: palette.damage,
      });
    }
  }

  if (analysis.walletEra === "ancient") {
    layers.push({ x: 5, y: 6, w: 14, h: 1, fill: palette.neon, opacity: 0.22 });
    layers.push({ x: 6, y: 18, w: 12, h: 1, fill: palette.neon, opacity: 0.1 });
  }

  if (analysis.mevSignal) {
    layers.push({ x: 9, y: 7, w: 3, h: 3, fill: palette.metal, opacity: 0.7 });
    layers.push({ x: 13, y: 8, w: 3, h: 3, fill: palette.metal, opacity: 0.7 });
    layers.push({ x: 12, y: 6, w: 1, h: 9, fill: palette.neon, opacity: 0.18 });
  }

  const traitRoll = Math.floor(rng() * 100);

  if (traitRoll < 16) {
    layers.push({ x: 6, y: 11, w: 1, h: 1, fill: "#efc23a" });
  } else if (traitRoll < 30) {
    layers.push({ x: 15, y: 15, w: 4, h: 1, fill: "#050505" });
    layers.push({ x: 19, y: 15, w: 3, h: 1, fill: "#dadada" });
    layers.push({ x: 22, y: 15, w: 1, h: 1, fill: "#ea5325" });
  } else if (traitRoll < 44) {
    layers.push({ x: 8, y: 9, w: 3, h: 2, fill: palette.metal, opacity: 0.92 });
    layers.push({ x: 13, y: 9, w: 3, h: 2, fill: palette.metal, opacity: 0.92 });
    layers.push({ x: 11, y: 9, w: 2, h: 1, fill: "#050505" });
  } else if (traitRoll < 56) {
    layers.push({ x: 9, y: 8, w: 2, h: 1, fill: "#48d6b2" });
    layers.push({ x: 13, y: 9, w: 2, h: 1, fill: "#48d6b2" });
    layers.push({ x: 11, y: 9, w: 2, h: 1, fill: "#050505" });
  } else if (traitRoll < 68) {
    layers.push({ x: 10, y: 16, w: 2, h: 1, fill: "#cf0cd8" });
  } else if (traitRoll < 78) {
    layers.push({ x: 8, y: 13, w: 2, h: 1, fill: palette.damage, opacity: 0.7 });
    layers.push({ x: 11, y: 17, w: 1, h: 1, fill: palette.damage, opacity: 0.7 });
  } else if (traitRoll < 88) {
    layers.push({ x: 8, y: 9, w: 1, h: 3, fill: "#4a67d6" });
  } else {
    layers.push({ x: 15, y: 8, w: 1, h: 2, fill: palette.metal });
    layers.push({ x: 15, y: 10, w: 1, h: 1, fill: palette.neon, opacity: 0.5 });
  }

  return layers;
}

function buildVariantLayers(
  analysis: HoodPunkAnalysis,
  palette: Palette,
  mode: PunkRenderMode,
) {
  const layers: Primitive[] = [];
  const sanitizedSeed = analysis.seed.replace(/^0x/, "").padEnd(24, "0");
  const pick = (index: number) =>
    Number.parseInt(sanitizedSeed.slice(index * 2, index * 2 + 2), 16) || 0;

  const hairVariant = pick(0) % 5;
  const eyeVariant = pick(1) % 5;
  const mouthVariant = pick(2) % 4;
  const accessoryVariant = pick(3) % 7;
  const neckVariant = pick(4) % 4;
  const backdropVariant = pick(5) % 5;
  const rareVariant = (((pick(6) << 8) | pick(7)) >>> 0) % 173;
  const rareAccessoryVariant = (((pick(8) << 8) | pick(9)) >>> 0) % 211;

  if (hairVariant === 0) {
    layers.push({ x: 6, y: 4, w: 2, h: 1, fill: palette.hair, opacity: 0.7 });
  } else if (hairVariant === 1) {
    layers.push({ x: 14, y: 4, w: 2, h: 1, fill: palette.hair, opacity: 0.75 });
  } else if (hairVariant === 2) {
    layers.push({ x: 10, y: 1, w: 1, h: 2, fill: palette.neon, opacity: 0.7 });
    layers.push({ x: 12, y: 1, w: 1, h: 2, fill: palette.neon, opacity: 0.7 });
  } else if (hairVariant === 3) {
    layers.push({ x: 5, y: 6, w: 2, h: 1, fill: palette.accent, opacity: 0.8 });
  } else {
    layers.push({ x: 15, y: 6, w: 2, h: 1, fill: palette.accent, opacity: 0.8 });
  }

  if (eyeVariant === 0) {
    layers.push({ x: 9, y: 10, w: 1, h: 1, fill: palette.neon });
    layers.push({ x: 13, y: 10, w: 1, h: 1, fill: palette.neon });
  } else if (eyeVariant === 1) {
    layers.push({ x: 8, y: 9, w: 3, h: 2, fill: palette.metal, opacity: 0.82 });
    layers.push({ x: 13, y: 9, w: 3, h: 2, fill: palette.metal, opacity: 0.82 });
  } else if (eyeVariant === 2) {
    layers.push({ x: 9, y: 9, w: 1, h: 2, fill: palette.damage, opacity: 0.85 });
    layers.push({ x: 13, y: 9, w: 1, h: 2, fill: palette.damage, opacity: 0.85 });
  } else if (eyeVariant === 3) {
    layers.push({ x: 8, y: 10, w: 2, h: 1, fill: palette.frame, opacity: 0.92 });
    layers.push({ x: 13, y: 10, w: 2, h: 1, fill: palette.frame, opacity: 0.92 });
  } else {
    layers.push({ x: 9, y: 9, w: 1, h: 3, fill: "#4a67d6", opacity: 0.9 });
  }

  if (mouthVariant === 0) {
    layers.push({ x: 10, y: 16, w: 3, h: 1, fill: "#871818" });
  } else if (mouthVariant === 1) {
    layers.push({ x: 10, y: 16, w: 2, h: 1, fill: "#cf0cd8" });
  } else if (mouthVariant === 2) {
    layers.push({ x: 11, y: 16, w: 4, h: 1, fill: palette.frame });
  } else {
    layers.push({ x: 12, y: 15, w: 1, h: 2, fill: palette.damage, opacity: 0.85 });
  }

  if (accessoryVariant === 0) {
    layers.push({ x: 7, y: 12, w: 1, h: 1, fill: "#f0c232" });
  } else if (accessoryVariant === 1) {
    layers.push({ x: 14, y: 15, w: 4, h: 1, fill: "#050505" });
    layers.push({ x: 18, y: 15, w: 2, h: 1, fill: "#dadada" });
    layers.push({ x: 20, y: 15, w: 1, h: 1, fill: "#ea5325" });
  } else if (accessoryVariant === 2) {
    layers.push({ x: 15, y: 8, w: 1, h: 2, fill: palette.metal });
    layers.push({ x: 15, y: 10, w: 1, h: 1, fill: palette.neon, opacity: 0.6 });
  } else if (accessoryVariant === 3) {
    layers.push({ x: 7, y: 8, w: 1, h: 6, fill: palette.frame, opacity: 0.7 });
  } else if (accessoryVariant === 4) {
    layers.push({ x: 8, y: 13, w: 2, h: 1, fill: palette.damage, opacity: 0.78 });
    layers.push({ x: 11, y: 17, w: 1, h: 1, fill: palette.damage, opacity: 0.78 });
  } else if (accessoryVariant === 5) {
    layers.push({ x: 8, y: 9, w: 8, h: 1, fill: palette.neon, opacity: 0.22 });
  } else {
    layers.push({ x: 6, y: 11, w: 1, h: 1, fill: "#efc23a" });
    layers.push({ x: 15, y: 11, w: 1, h: 1, fill: "#efc23a" });
  }

  if (rareAccessoryVariant === 0) {
    layers.push({ x: 8, y: 3, w: 8, h: 2, fill: HOOD_GREEN });
    layers.push({ x: 9, y: 2, w: 6, h: 1, fill: HOOD_GREEN_DARK });
  } else if (rareAccessoryVariant === 1) {
    layers.push({ x: 9, y: 1, w: 6, h: 1, fill: "#111111" });
    layers.push({ x: 10, y: 0, w: 4, h: 1, fill: "#111111" });
  } else if (rareAccessoryVariant === 2) {
    layers.push({ x: 8, y: 3, w: 8, h: 2, fill: "#4f565e" });
    layers.push({ x: 9, y: 2, w: 6, h: 1, fill: "#98a4af" });
  }

  if (neckVariant === 0) {
    layers.push({ x: 10, y: 21, w: 4, h: 1, fill: palette.shirt, opacity: 0.85 });
  } else if (neckVariant === 1) {
    layers.push({ x: 10, y: 21, w: 4, h: 1, fill: palette.metal, opacity: 0.65 });
  } else if (neckVariant === 2) {
    layers.push({ x: 11, y: 20, w: 2, h: 1, fill: palette.accent, opacity: 0.55 });
  } else {
    layers.push({ x: 9, y: 21, w: 6, h: 1, fill: palette.frame, opacity: 0.35 });
  }

  if (backdropVariant === 0) {
    layers.push({ x: 3, y: 6, w: 18, h: 1, fill: palette.neon, opacity: 0.12 });
  } else if (backdropVariant === 1) {
    layers.push({ x: 2, y: 17, w: 20, h: 1, fill: palette.neon, opacity: 0.12 });
  } else if (backdropVariant === 2) {
    layers.push({ x: 4, y: 4, w: 1, h: 1, fill: palette.neon, opacity: 0.45 });
    layers.push({ x: 19, y: 19, w: 1, h: 1, fill: palette.neon, opacity: 0.45 });
  } else if (backdropVariant === 3 && mode === "classic") {
    layers.push({ x: 20, y: 8, w: 1, h: 8, fill: palette.frame, opacity: 0.28 });
  } else {
    layers.push({ x: 3, y: 3, w: 18, h: 18, fill: palette.frame, opacity: 0.05 });
  }

  if (analysis.whaleSignal) {
    layers.push({ x: 2, y: 4, w: 2, h: 16, fill: "#705219", opacity: 0.1 });
    layers.push({ x: 20, y: 4, w: 2, h: 16, fill: "#705219", opacity: 0.1 });
    layers.push({ x: 5, y: 3, w: 14, h: 1, fill: "#c8a347", opacity: 0.12 });
    layers.push({ x: 5, y: 20, w: 14, h: 1, fill: "#c8a347", opacity: 0.08 });
    layers.push({ x: 18, y: 6, w: 2, h: 2, fill: "#f0c232", opacity: 0.18 });
    layers.push({ x: 18, y: 16, w: 2, h: 2, fill: "#f0c232", opacity: 0.14 });
  }

  if (rareVariant === 0) {
    layers.push({ x: 2, y: 2, w: 20, h: 20, fill: palette.neon, opacity: 0.06 });
    layers.push({ x: 4, y: 4, w: 16, h: 16, fill: "#6f4cff", opacity: 0.06 });
  } else if (rareVariant === 1) {
    layers.push({ x: 0, y: 12, w: 24, h: 1, fill: "#f0c232", opacity: 0.14 });
    layers.push({ x: 12, y: 0, w: 1, h: 24, fill: "#f0c232", opacity: 0.12 });
  } else if (rareVariant === 2) {
    layers.push({ x: 2, y: 2, w: 6, h: 6, fill: "#ff8757", opacity: 0.09 });
    layers.push({ x: 16, y: 16, w: 6, h: 6, fill: "#00C805", opacity: 0.08 });
  } else if (rareVariant === 3) {
    layers.push({ x: 5, y: 5, w: 14, h: 14, fill: palette.metal, opacity: 0.06 });
    layers.push({ x: 7, y: 7, w: 10, h: 10, fill: palette.frame, opacity: 0.18 });
  }

  return layers;
}

function renderSvg(primitives: Primitive[]) {
  const body = primitives
    .map(
      ({ x, y, w, h, fill, opacity, rx }) =>
        `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"${
          opacity !== undefined ? ` opacity="${opacity}"` : ""
        }${rx !== undefined ? ` rx="${rx}"` : ""} />`,
    )
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">${body}</svg>`;
}

function archetypesForMode(mode: PunkRenderMode) {
  return mode === "legacy" ? legacyArchetypes : classicArchetypes;
}

function raritySeedFlags(seed: string) {
  const sanitizedSeed = seed.replace(/^0x/, "").padEnd(24, "0");
  const rareRoll = (Number.parseInt(sanitizedSeed.slice(0, 4), 16) || 0) % 1000;
  const pick = (index: number) => {
    const start = index * 2;
    return Number.parseInt(sanitizedSeed.slice(start, start + 2), 16) || 0;
  };
  const rareVariant = (((pick(6) << 8) | pick(7)) >>> 0) % 173;
  const rareAccessoryVariant = (((pick(8) << 8) | pick(9)) >>> 0) % 211;

  return {
    rareArchetype:
      rareRoll < 9 ? "Zombie Rot" : rareRoll < 18 ? "Hooded Wraith" : null,
    rareBackdrop:
      rareVariant === 0
        ? "Void bloom"
        : rareVariant === 1
          ? "Crosshair flare"
          : rareVariant === 2
            ? "Thermal bloom"
            : rareVariant === 3
              ? "Alloy vault"
              : null,
    rareAccessory:
      rareAccessoryVariant === 0
        ? "Beanie relic"
        : rareAccessoryVariant === 1
          ? "Top-hat relic"
          : rareAccessoryVariant === 2
            ? "Pilot relic"
            : null,
  };
}

export function deriveSpecialTraits(analysis: HoodPunkAnalysis): SpecialTraitSet {
  const flags = raritySeedFlags(analysis.seed);
  const specialTraits: SpecialTraitSet = {};

  if (flags.rareArchetype) {
    specialTraits.identityClass = flags.rareArchetype;
  }

  if (flags.rareBackdrop) {
    specialTraits.backdrop = flags.rareBackdrop;
  }

  if (flags.rareAccessory) {
    specialTraits.headwear = flags.rareAccessory;
  }

  specialTraits.hoodie = deriveHoodieName(analysis.seed);

  if (analysis.whaleSignal) {
    specialTraits.specialSignal = "Whale Prestige";
  } else if (analysis.mevSignal) {
    specialTraits.specialSignal = "Machine Pressure";
  } else if (analysis.status === "failed") {
    specialTraits.specialSignal = "Render Collapse";
  }

  return specialTraits;
}

export function deriveRarityProfile(analysis: HoodPunkAnalysis): RarityProfile {
  const flags = raritySeedFlags(analysis.seed);
  const triggers: string[] = [];

  if (flags.rareArchetype) {
    triggers.push(flags.rareArchetype);
  }
  if (flags.rareBackdrop) {
    triggers.push(flags.rareBackdrop);
  }
  if (flags.rareAccessory) {
    triggers.push(flags.rareAccessory);
  }
  if (analysis.whaleSignal) {
    triggers.push("Whale prestige");
  }

  const hasRareArchetype = Boolean(flags.rareArchetype);
  const hasRareBackdrop = Boolean(flags.rareBackdrop);
  const hasRareAccessory = Boolean(flags.rareAccessory);

  if (hasRareArchetype && (hasRareBackdrop || hasRareAccessory)) {
    return {
      tier: "Legendary",
      detail:
        "Rare archetype logic stacked with an extra rare signal. These are the pieces you stop and stare at.",
      triggers,
    };
  }

  if (hasRareArchetype || (hasRareBackdrop && hasRareAccessory)) {
    return {
      tier: "Very Rare",
      detail:
        "This mint hit one of the low-probability branches that change the identity class, not just the surface effects.",
      triggers,
    };
  }

  if (hasRareBackdrop || hasRareAccessory || analysis.whaleSignal) {
    return {
      tier: "Rare",
      detail:
        "The portrait stayed inside the common anatomy pool but still unlocked a low-frequency backdrop, relic accessory, or prestige signal.",
      triggers,
    };
  }

  return {
    tier: "Common",
    detail:
      "Most HOODPUNKS live here: stable punk anatomy first, chain mutations second, no extra low-probability rarity branch triggered.",
    triggers: ["Base mutation lattice"],
  };
}

function selectArchetypeSpec(mode: PunkRenderMode, analysis: HoodPunkAnalysis) {
  const archetypes = archetypesForMode(mode);
  const commonPool = archetypes.slice(0, 7);
  const rarePool = archetypes.slice(7);
  const fallbackArchetype = archetypes[0];
  const sanitizedSeed = analysis.seed.replace(/^0x/, "").padEnd(8, "0");
  const rareRoll = (Number.parseInt(sanitizedSeed.slice(0, 4), 16) || 0) % 1000;
  const commonRoll = (Number.parseInt(sanitizedSeed.slice(4, 8), 16) || 0) % commonPool.length;

  if (rareRoll < 9 && rarePool[0]) {
    return rarePool[0];
  }
  if (rareRoll < 18 && rarePool[1]) {
    return rarePool[1];
  }

  return commonPool[commonRoll] ?? fallbackArchetype;
}

export function deriveVisualArchetypeName(
  seed: string,
  mode: PunkRenderMode = "classic",
) {
  const archetypes = archetypesForMode(mode);
  const commonPool = archetypes.slice(0, 7);
  const rarePool = archetypes.slice(7);
  const fallbackArchetype = archetypes[0];
  const sanitizedSeed = seed.replace(/^0x/, "").padEnd(8, "0");
  const rareRoll = (Number.parseInt(sanitizedSeed.slice(0, 4), 16) || 0) % 1000;
  const commonRoll = (Number.parseInt(sanitizedSeed.slice(4, 8), 16) || 0) % commonPool.length;

  if (rareRoll < 9 && rarePool[0]) {
    return rarePool[0].name;
  }
  if (rareRoll < 18 && rarePool[1]) {
    return rarePool[1].name;
  }

  return (commonPool[commonRoll] ?? fallbackArchetype).name;
}

export function buildPunkSvg(
  analysis: HoodPunkAnalysis,
  options?: { mode?: PunkRenderMode },
) {
  const mode = options?.mode ?? "classic";
  const seed = hashToSeed(analysis.seed);
  const rng = mulberry32(seed);
  const palette = resolvePalette(analysis);
  const archetype = selectArchetypeSpec(mode, analysis);
  const skin = skinToneFromSeed(analysis.seed);
  const hoodie = buildHoodieLayers(analysis.seed);
  const maskLayer = archetype.mask
    ? mode === "classic"
      ? mapCryptoPunkPrimitives(archetype.mask, skin)
      : mapPrimitiveFill(archetype.mask, palette)
    : baseFace(palette);
  const primitives = [
    { x: 0, y: 0, w: 24, h: 24, fill: palette.background },
    ...(mode === "classic"
      ? []
      : [{ x: 2, y: 2, w: 20, h: 20, fill: palette.haze, opacity: 0.35 }]),
    ...maskLayer,
    ...mapPrimitiveFill(archetype.hair, palette),
    ...mapPrimitiveFill(archetype.accessories, palette),
    ...mapPrimitiveFill(archetype.features, palette),
    ...hoodie.shadow,
    ...hoodie.hood,
    ...hoodie.outline,
    ...buildVariantLayers(analysis, palette, mode),
    ...buildMutationLayers(analysis, palette, rng, mode),
  ];

  return `data:image/svg+xml;utf8,${encodeURIComponent(renderSvg(primitives))}`;
}

export function buildSpecimenGallery(mode: PunkRenderMode = "classic") {
  const specimens: HoodPunkAnalysis[] = [
    {
      kind: "address",
      query: "Calm Identity Specimen",
      network: "robinhood",
      rpcSource: "specimen",
      seed: "calm-default-specimen",
      title: "Calm default shell",
      archetype: "Hood OG",
      timestampIso: new Date().toISOString(),
      blockNumber: "0",
      gasGwei: 6.2,
      valueEth: 0.4,
      nonce: 18,
      entropyScore: 42,
      congestionScore: 24,
      walletSignal: 28,
      status: "confirmed",
      corruptionLevel: "stable",
      walletEra: "fresh",
      whaleSignal: false,
      mevSignal: false,
      mutations: [
        {
          name: "Calm shell",
          detail: "Low gas and low congestion keep the portrait readable and close to its base punk anatomy.",
          intensity: "low",
        },
        {
          name: "Quiet block",
          detail: "Low congestion keeps the frame steady instead of fragmenting it with static noise.",
          intensity: "low",
        },
        {
          name: "No crown",
          detail: "Transfer size stays modest, so prestige metals and whale marks remain inactive.",
          intensity: "low",
        },
      ],
      traits: [
        {
          label: "Gas Reactivity",
          value: "6.2 gwei",
          reason: "Quiet chain conditions keep the face cleaner and more default-punk in character.",
        },
        {
          label: "Network Congestion",
          value: "24/100",
          reason: "The block is calm enough to avoid scanline fracture and dust-noise overlays.",
        },
        {
          label: "Execution Status",
          value: "confirmed",
          reason: "Confirmed execution locks the identity cleanly instead of leaving it unresolved or damaged.",
        },
        {
          label: "Wallet Era",
          value: "fresh",
          reason: "Lower historical weight keeps the portrait nearer to a simpler default shell.",
        },
        {
          label: "Entropy Band",
          value: "calm",
          reason: "The input is controlled enough to preserve readable anatomy over chaos.",
        },
        {
          label: "Value Band",
          value: "micro",
          reason: "The amount transferred does not push the portrait into prestige or whale-coded territory.",
        },
      ],
    },
    {
      kind: "transaction",
      query: "Whale Specimen",
      network: "robinhood",
      rpcSource: "specimen",
      seed: "whale-specimen",
      title: "Sovereign femme",
      archetype: "Azure Femme",
      timestampIso: new Date().toISOString(),
      blockNumber: "0",
      gasGwei: 24,
      valueEth: 144,
      nonce: 9,
      entropyScore: 61,
      congestionScore: 51,
      walletSignal: 49,
      status: "confirmed",
      corruptionLevel: "strained",
      walletEra: "seasoned",
      whaleSignal: true,
      mevSignal: false,
      mutations: [
        { name: "Gold corruption", detail: "Large transfer unlocks sovereign signal layers.", intensity: "medium" },
      ],
      traits: [
        {
          label: "Whale Signal",
          value: "144 ETH",
          reason: "Large value transfer triggers elite metallic traits.",
        },
        {
          label: "Gas Reactivity",
          value: "24 gwei",
          reason: "Moderate gas keeps some pressure on the face without fully burning it.",
        },
        {
          label: "Wallet Era",
          value: "seasoned",
          reason: "Activity history adds maturity and a more deliberate silhouette.",
        },
        {
          label: "Entropy Band",
          value: "volatile",
          reason: "There is enough signal variation to add movement without collapsing readability.",
        },
      ],
    },
    {
      kind: "transaction",
      query: "Failed Specimen",
      network: "robinhood",
      rpcSource: "specimen",
      seed: "failed-specimen",
      title: "Reverted smoker",
      archetype: "Classic Cigarette",
      timestampIso: new Date().toISOString(),
      blockNumber: "0",
      gasGwei: 19,
      valueEth: 0.08,
      nonce: 311,
      entropyScore: 73,
      congestionScore: 66,
      walletSignal: 75,
      status: "failed",
      corruptionLevel: "corrupted",
      walletEra: "ancient",
      whaleSignal: false,
      mevSignal: false,
      mutations: [
        { name: "Broken mouth", detail: "Failure scars the render pipeline.", intensity: "high" },
      ],
      traits: [
        {
          label: "Failed Transaction",
          value: "Reverted",
          reason: "Failed calls fracture eyes, mouths, and pixel stability.",
        },
        {
          label: "Network Congestion",
          value: "66/100",
          reason: "Busy conditions amplify scanlines and glitch pressure around the face.",
        },
        {
          label: "Wallet Era",
          value: "ancient",
          reason: "Heavy account history adds age and fossil-like grayscale weight.",
        },
        {
          label: "Nonce Signature",
          value: "311",
          reason: "A long interaction trail makes the portrait feel more worn and lived-in.",
        },
      ],
    },
  ];

  return specimens.map((specimen) => ({
    ...specimen,
    image: buildPunkSvg(specimen, { mode }),
  }));
}
