// Convert all HEICs in About me Photos to lightweight JPEGs we can preview
// and decide which is photography vs cooking.
import { promises as fs } from 'fs';
import path from 'path';
import convert from 'heic-convert';

const SRC_DIR = path.resolve('About me Photos');
const OUT_DIR = path.resolve('scripts/_preview');
await fs.mkdir(OUT_DIR, { recursive: true });

const files = await fs.readdir(SRC_DIR);
for (const f of files) {
  if (!/\.heic$/i.test(f)) continue;
  const src = path.join(SRC_DIR, f);
  const out = path.join(OUT_DIR, f.replace(/\.heic$/i, '.jpg'));
  const buf = await fs.readFile(src);
  const out_buf = await convert({ buffer: buf, format: 'JPEG', quality: 0.7 });
  await fs.writeFile(out, Buffer.from(out_buf));
  console.log('preview', out, '(', out_buf.byteLength, ')');
}
