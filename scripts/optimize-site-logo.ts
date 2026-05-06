/**
 * Resize + compress public/MyNanganallur-logo.png for web (header, favicon, PWA).
 * Run: npx tsx scripts/optimize-site-logo.ts
 */
import { renameSync, statSync, unlinkSync } from "fs";
import sharp from "sharp";

const DEST = "public/MyNanganallur-logo.png";
const TMP = "public/MyNanganallur-logo.tmp.png";

async function main() {
  const before = statSync(DEST).size;
  const meta = await sharp(DEST).metadata();
  console.log(
    `Input: ${meta.width}×${meta.height}, ${(before / 1024).toFixed(1)} KiB`,
  );

  const base = sharp(DEST).resize(512, 512, {
    fit: "inside",
    withoutEnlargement: true,
  });

  let pngBuf = await base.clone().png({ compressionLevel: 9, effort: 10 }).toBuffer();

  try {
    const palBuf = await sharp(DEST)
      .resize(512, 512, { fit: "inside", withoutEnlargement: true })
      .png({ palette: true, compressionLevel: 9, effort: 10 })
      .toBuffer();
    if (palBuf.length < pngBuf.length * 0.9) {
      pngBuf = palBuf;
      console.log("Using palette-optimized PNG.");
    }
  } catch {
    // keep truecolor PNG
  }

  await sharp(pngBuf).toFile(TMP);
  unlinkSync(DEST);
  renameSync(TMP, DEST);

  const after = statSync(DEST).size;
  console.log(
    `Output: ${(after / 1024).toFixed(1)} KiB (${((1 - after / before) * 100).toFixed(1)}% smaller)`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
