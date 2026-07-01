const chainSignals = [
  {
    title: "Gas Reactivity",
    body: "Gas drives the heat layer. Low gas keeps the face cleaner. High gas unlocks burn scars, molten edges, and hotter eyes.",
  },
  {
    title: "Network Congestion",
    body: "Congestion controls scene noise. Busy blocks add scanlines, static fracture, and atmospheric dust across the frame.",
  },
  {
    title: "Value / Whale Signal",
    body: "Large ETH value activates the prestige layer: crown logic, gold accents, sovereign alloy, and a more status-heavy backdrop.",
  },
  {
    title: "Execution Status",
    body: "Confirmed keeps the identity intact. Failed breaks mouths, eyes, and interior pixel structure.",
  },
  {
    title: "Wallet Era",
    body: "Older wallets push the portrait toward an ancient or genesis-coded feel, drier palettes, and a more historically anchored face.",
  },
  {
    title: "MEV Pressure",
    body: "If the flow looks bot-dense, the portrait leans toward synthetic eyes and machine pressure.",
  },
];

const accessoryRules = [
  {
    name: "Gold earring",
    body: "A small accessory roll. It often makes the face feel more punk even without any rarity hit.",
  },
  {
    name: "Cigarette",
    body: "A classic signal accessory. This is not a whale trait by itself, just one branch in the seed-driven style system.",
  },
  {
    name: "Visor / metal eyes",
    body: "Comes from eye and accessory branches and reads harder on more synthetic or pressure-heavy faces.",
  },
  {
    name: "Blue face streak",
    body: "The vertical blue mark does not automatically mean whale or rare. It is usually an archetype or variant accent, especially in Azure Femme or glitch-coded branches.",
  },
  {
    name: "Mouth tint / lips",
    body: "A small seed-driven cosmetic layer used to keep faces from feeling too identical under the same anatomy system.",
  },
  {
    name: "Scar / damage nick",
    body: "Can appear as a seed accessory, but it reads stronger when chain pressure is already strained or corrupted.",
  },
];

const hiddenNotes = [
  "The same tx hash always resolves to the same portrait.",
  "Not every visible detail comes from chain metrics. Some of them come from deterministic seed variations.",
  "Rare identity-class formulas are intentionally not written out here.",
  "You can understand accessories and normal visual variation without exposing the full rare system.",
];

export default function OperatorBlackbookPage() {
  return (
    <main className="min-h-screen bg-[#0A0F0D] px-5 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-[#111916]/90 p-6 shadow-[0_40px_140px_rgba(0,0,0,0.65)] sm:p-8">
        <div className="max-w-3xl">
          <div className="text-[0.72rem] uppercase tracking-[0.34em] text-[#00C805]">
            Operator Blackbook
          </div>
          <h1 className="mt-3 text-4xl font-semibold">HOODPUNKS hidden trait manual</h1>
          <p className="mt-4 text-sm leading-7 text-white/62">
            This page is intentionally hidden from the main navigation. It explains the
            normal mutation system, accessory logic, and seed variation without exposing
            the full rare identity formulas.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {hiddenNotes.map((note) => (
            <div
              key={note}
              className="rounded-[1.3rem] border border-white/10 bg-black/30 p-4 text-sm leading-6 text-white/68"
            >
              {note}
            </div>
          ))}
        </div>

        <section className="mt-10">
          <div className="text-[0.72rem] uppercase tracking-[0.34em] text-white/42">
            Chain-driven layers
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {chainSignals.map((item) => (
              <div
                key={item.title}
                className="rounded-[1.4rem] border border-white/10 bg-black/28 p-5"
              >
                <div className="text-lg font-semibold text-white">{item.title}</div>
                <p className="mt-3 text-sm leading-6 text-white/60">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="text-[0.72rem] uppercase tracking-[0.34em] text-white/42">
            Accessory and seed logic
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {accessoryRules.map((item) => (
              <div
                key={item.name}
                className="rounded-[1.4rem] border border-[#4a6b52]/16 bg-[#4a6b52]/6 p-5"
              >
                <div className="text-lg font-semibold text-white">{item.name}</div>
                <p className="mt-3 text-sm leading-6 text-white/60">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-[1.6rem] border border-[#00C805]/18 bg-[#0f1a14] p-6">
          <div className="text-[0.72rem] uppercase tracking-[0.34em] text-[#00C805]">
            About the blue mark
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/68">
            The blue vertical facial mark usually does not mean whale or hidden rare by
            itself. It is most often a seed accent from an archetype family like Azure
            Femme, Hacker Glitch, or another eye and face variant branch. In other
            words, it is part of the collection&apos;s visual language, not a standalone
            on-chain signal.
          </p>
        </section>
      </div>
    </main>
  );
}
