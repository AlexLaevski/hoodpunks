const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const templatePath = path.join(__dirname, "cryptopunks-hoodie-template.json");

async function main() {
  const input = "C:/Users/alexl/Downloads/FOtjOt3XIAYk00L.png";
  const bbox = { left: 80, top: 40, width: 494, height: 544 };
  const resized = await sharp(input)
    .extract(bbox)
    .resize(24, 24, { kernel: "nearest" })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const grid = resized.data;
  const channels = resized.info.channels;

  const classify = (r, g, b) => {
    if (r > 150 && g > 165 && b > 175) return null;
    if (r < 30 && g < 30 && b < 30) return "outline";
    if (r > 90 && r < 110 && g > 125 && g < 140) return "hood";
    if (r > 70 && r < 95 && g > 70 && g < 95) return "shadow";
    return null;
  };

  const keepBlack = (x, y) => !(x >= 9 && x <= 16 && y >= 9 && y <= 17);
  const layers = { hood: [], shadow: [], outline: [] };
  const used = { hood: new Set(), shadow: new Set(), outline: new Set() };
  const key = (x, y) => `${x},${y}`;

  for (const name of ["hood", "shadow", "outline"]) {
    for (let y = 0; y < 24; y += 1) {
      for (let x = 0; x < 24; x += 1) {
        const i = (y * 24 + x) * channels;
        const r = grid[i];
        const g = grid[i + 1];
        const b = grid[i + 2];
        let bucket = classify(r, g, b);
        if (name === "outline") {
          bucket = r < 30 && g < 30 && b < 30 && keepBlack(x, y) ? "outline" : null;
        }
        if (bucket !== name || used[name].has(key(x, y))) continue;

        let w = 1;
        while (x + w < 24) {
          const j = (y * 24 + (x + w)) * channels;
          const rr = grid[j];
          const gg = grid[j + 1];
          const bb = grid[j + 2];
          const next =
            name === "outline"
              ? rr < 30 && gg < 30 && bb < 30 && keepBlack(x + w, y)
              : classify(rr, gg, bb) === name;
          if (!next || used[name].has(key(x + w, y))) break;
          w += 1;
        }

        let h = 1;
        outer: while (y + h < 24) {
          for (let dx = 0; dx < w; dx += 1) {
            const j = ((y + h) * 24 + (x + dx)) * channels;
            const rr = grid[j];
            const gg = grid[j + 1];
            const bb = grid[j + 2];
            const next =
              name === "outline"
                ? rr < 30 && gg < 30 && bb < 30 && keepBlack(x + dx, y + h)
                : classify(rr, gg, bb) === name;
            if (!next || used[name].has(key(x + dx, y + h))) break outer;
          }
          h += 1;
        }

        for (let dy = 0; dy < h; dy += 1) {
          for (let dx = 0; dx < w; dx += 1) {
            used[name].add(key(x + dx, y + dy));
          }
        }
        layers[name].push({ x, y, w, h });
      }
    }
  }

  fs.writeFileSync(templatePath, `${JSON.stringify(layers, null, 2)}\n`);

  const sol = [];
  for (const layer of ["shadow", "hood", "outline"]) {
    for (const rect of layers[layer]) {
      const color =
        layer === "shadow"
          ? "_hoodieShadowColor(sourceHash)"
          : layer === "hood"
            ? "_hoodieHoodColor(sourceHash)"
            : '"#000000"';
      sol.push(`            _rect(${rect.x}, ${rect.y}, ${rect.w}, ${rect.h}, ${color}),`);
    }
  }
  fs.writeFileSync(path.join(__dirname, "generated-hoodie-layer.sol.txt"), `${sol.join("\n")}\n`);
  console.log("template saved", templatePath);
  console.log("rects", layers.hood.length + layers.shadow.length + layers.outline.length);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});