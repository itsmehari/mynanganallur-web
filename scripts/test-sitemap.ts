/** Quick check: sitemap URL counts from production DB. */
import { config } from "dotenv";
config({ path: ".env.production.local" });
config({ path: ".env.local" });

import sitemap from "../src/app/sitemap";

async function main() {
  const entries = await sitemap();
  console.log("total URLs:", entries.length);
  const byPrefix = new Map<string, number>();
  for (const e of entries) {
    const path = new URL(e.url).pathname.split("/").filter(Boolean)[0] ?? "home";
    byPrefix.set(path, (byPrefix.get(path) ?? 0) + 1);
  }
  for (const [k, v] of [...byPrefix.entries()].sort()) {
    console.log(`  ${k}: ${v}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
