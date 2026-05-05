// Crop the about-portrait JPEG to focus on Narayan (face/upper body), not
// the surrounding cityscape. Output is a 1000x1100 portrait crop landing
// his head about a third from the top.
import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';

const SRC = path.resolve('public/photos/about-portrait-source.jpg');
const OUT_TMP = path.resolve('public/photos/about-portrait.tmp.jpg');
const OUT = path.resolve('public/photos/about-portrait.jpg');

const inBuf = await fs.readFile(SRC);

const meta = await sharp(inBuf).rotate().metadata();
const W = meta.width ?? 0;
const H = meta.height ?? 0;
console.log('source', W, 'x', H);

// Crop window: ~70% of source width, centered slightly left of center
// (his head sits left of centre in the original); ~70% of source height,
// from ~30% down so we capture face + shoulders.
const cropW = Math.round(W * 0.72);
const cropH = Math.round(H * 0.72);
const left = Math.max(0, Math.round(W * 0.06));
const top = Math.max(0, Math.round(H * 0.32));

const outBuf = await sharp(inBuf)
  .rotate()
  .extract({
    left,
    top,
    width: Math.min(cropW, W - left),
    height: Math.min(cropH, H - top),
  })
  .resize({ width: 1000 })
  .jpeg({ quality: 80, mozjpeg: true })
  .toBuffer();

await fs.writeFile(OUT_TMP, outBuf);
await fs.rm(OUT, { force: true });
await fs.rename(OUT_TMP, OUT);
console.log('saved', OUT, '(', outBuf.byteLength, 'bytes )');
