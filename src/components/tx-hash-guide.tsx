import {
  isRobinhoodTestnet,
  robinhoodExplorerBase,
  robinhoodFaucetUrl,
  activeRobinhoodChain,
} from "@/lib/chains";

function buildSteps() {
  const steps = [
    {
      title: "Open the explorer",
      body: `Browse live transactions on ${activeRobinhoodChain.name}.`,
      link: robinhoodExplorerBase,
      linkLabel: robinhoodExplorerBase.replace("https://", ""),
    },
  ];

  if (isRobinhoodTestnet && robinhoodFaucetUrl) {
    steps.push({
      title: "Get test ETH",
      body: "Connect your wallet on the faucet and request testnet ETH for gas.",
      link: robinhoodFaucetUrl,
      linkLabel: "faucet.testnet.chain.robinhood.com",
    });
  } else {
    steps.push({
      title: "Fund your wallet",
      body: "Make sure your wallet has real ETH on Robinhood Chain mainnet for gas and minting (0.002 ETH per mint).",
      link: "https://robinhood.com/chain",
      linkLabel: "robinhood.com/chain",
    });
  }

  steps.push(
    {
      title: "Find or create a transaction",
      body: "Send any transaction from your wallet, or open Transactions and pick a recent tx in the explorer.",
      link: `${robinhoodExplorerBase}/txs`,
      linkLabel: "View transactions",
    },
    {
      title: "Copy the hash",
      body: "On the transaction page, copy the full Transaction hash (starts with 0x, 66 characters).",
      link: null,
      linkLabel: null,
    },
    {
      title: "Generate your HoodPunk",
      body: "Paste the hash below and click Generate HoodPunk. Each unique tx hash can mint one NFT.",
      link: null,
      linkLabel: null,
    },
  );

  return steps;
}

export function TxHashGuide() {
  const steps = buildSteps();

  return (
    <details className="group mt-4 rounded-[1.5rem] border border-[#00C805]/20 bg-[#00C805]/5 p-4 sm:p-5">
      <summary className="cursor-pointer list-none text-sm font-medium text-white/80 marker:content-none [&::-webkit-details-marker]:hidden">
        <span className="text-[#00C805]">How to get a tx hash</span>
        <span className="ml-2 text-white/40 group-open:hidden">— tap to expand</span>
      </summary>
      <div className="mt-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm leading-6 text-white/70">
            HoodPunks reads real {activeRobinhoodChain.name} transactions. You need a{" "}
            <span className="font-mono text-[#d4f5d6]">0x…</span> hash from the explorer.
          </p>
          <a
            href={robinhoodExplorerBase}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-[#00C805]/40 bg-[#00C805]/10 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#00C805] transition hover:bg-[#00C805]/20"
          >
            Open Explorer
          </a>
        </div>

        <ol className="mt-5 space-y-4">
          {steps.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#00C805]/30 bg-[#0A0F0D] text-xs font-semibold text-[#00C805]">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-white">{step.title}</div>
                <p className="mt-1 text-sm leading-6 text-white/58">{step.body}</p>
                {step.link && step.linkLabel ? (
                  <a
                    href={step.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm text-[#00C805] underline-offset-2 hover:underline"
                  >
                    {step.linkLabel} →
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-5 rounded-xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-xs leading-6 text-white/45">
          Example format:{" "}
          <span className="text-[#d4f5d6]">
            0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890ab
          </span>
        </div>
      </div>
    </details>
  );
}