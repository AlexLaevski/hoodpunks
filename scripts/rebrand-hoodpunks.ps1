$root = Split-Path $PSScriptRoot -Parent
$extensions = @("*.ts", "*.tsx", "*.css", "*.sol", "*.js", "*.json", "*.svg", "*.mjs")

$replacements = @(
  @("TX PUNKS", "HOODPUNKS"),
  @("TX Punks", "HoodPunks"),
  @("TXPunksMetadata", "HoodPunksMetadata"),
  @("TXPunks", "HoodPunks"),
  @("TxPunksApp", "HoodPunksApp"),
  @("TxPunkAnalysis", "HoodPunkAnalysis"),
  @("TxPunk", "HoodPunk"),
  @("txPunksContractAddress", "hoodPunksContractAddress"),
  @("txPunksPublicClient", "hoodPunksPublicClient"),
  @("txPunksChain", "hoodPunksChain"),
  @("txPunksAbi", "hoodPunksAbi"),
  @("tx-punks:last-minted-preview", "hoodpunks:last-minted-preview"),
  @("tx-punks-app", "hood-punks-app"),
  @("tx-punks-contract", "hood-punks-contract"),
  @("tx-punks-site", "hoodpunks"),
  @("tx-punks", "hood-punks"),
  @("txpunks", "hoodpunks"),
  @("NEXT_PUBLIC_TXPUNKS", "NEXT_PUBLIC_HOODPUNKS"),
  @("Ethereum-native NFT concept where real transaction entropy mutates stable punk-inspired identities.", "Robinhood Chain-native NFT collection where on-chain entropy mutates HoodPunk identities."),
  @('"ethereum"', '"robinhood"'),
  @("network: `"ethereum`"", "network: `"robinhood`""),
  @("#8dffd5", "#00C805"),
  @("#b2ffe3", "#2ee816"),
  @("#66ffd0", "#00C805"),
  @("#d8fff0", "#d4f5d6"),
  @("#69f6db", "#00C805"),
  @("#9cf0df", "#66ff7a"),
  @("#19d39a", "#00A004"),
  @("rgba(141,255,213", "rgba(0,200,5"),
  @("rgba(16, 255, 192", "rgba(0, 200, 5"),
  @("#040506", "#0A0F0D"),
  @("#070a0d", "#111916"),
  @("#08100d", "#0f1a14"),
  @("#050607", "#0A0F0D"),
  @("#040607", "#0A0F0D"),
  @("#0b1114", "#111916"),
  @("#102127", "#1a2b20"),
  @("#7eb6ff", "#4a6b52"),
  @("#d8e9ff", "#b8c9bb"),
  @("#5ea2ff", "#2d5a35"),
  @("#071a33", "#0f1a14"),
  @("#052219", "#0a1a0f")
)

foreach ($ext in $extensions) {
  Get-ChildItem -Path $root -Recurse -Filter $ext -File |
    Where-Object { $_.FullName -notmatch "node_modules|\.next|artifacts|cache" } |
    ForEach-Object {
      $content = Get-Content $_.FullName -Raw -Encoding UTF8
      $original = $content
      foreach ($pair in $replacements) {
        $content = $content.Replace($pair[0], $pair[1])
      }
      if ($content -ne $original) {
        Set-Content -Path $_.FullName -Value $content -Encoding UTF8 -NoNewline
      }
    }
}

Write-Host "Rebrand complete."