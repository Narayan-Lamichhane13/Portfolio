// Optimize the Microsoft Partner showcase screenshot for the 3Sharp
// experience card.
import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';

const SRC = path.resolve('scripts/_ms-partner-hero.png');
const OUT_TMP = path.resolve('public/photos/3sharp-microsoft.tmp.jpg');
const OUT = path.resolve('public/photos/3sharp-microsoft.jpg');

const inBuf = await fs.readFile(SRC);
const outBuf = await sharp(inBuf)
  .resize({ width: 1400, withoutEnlargement: true })
  .jpeg({ quality: 82, mozjpeg: true })
  .toBuffer();

await fs.writeFile(OUT_TMP, outBuf);
await fs.rm(OUT, { force: true });
await fs.rename(OUT_TMP, OUT);
console.log('saved', OUT, '(', outBuf.byteLength, 'bytes )');
