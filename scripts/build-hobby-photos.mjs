// Convert + compress hobby photos for the About Me + Projects sections.
//
// Inputs:
//   About me Photos/IMG_5557.HEIC  -> public/photos/cooking.jpg
//   About me Photos/IMG_5345.HEIC  -> public/photos/photography.jpg
//                                  -> public/photos/airify.jpg  (reused)
//   <muay-thai source PNG>         -> public/photos/muay-thai.jpg
//
// We aim for ~1200px on the long edge and ~250 KB JPEGs so the page stays
// snappy.
import { promises as fs } from 'fs';
import path from 'path';
import convert from 'heic-convert';
import sharp from 'sharp';

async function heicToBuffer(srcPath) {
  const buf = await fs.readFile(srcPath);
  const out = await convert({ buffer: buf, format: 'JPEG', quality: 0.9 });
  return Buffer.from(out);
}

async function compress(buf, { width = 1200, quality = 78 } = {}) {
  return sharp(buf)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .jpeg({ quality, mozjpeg: true })
    .toBuffer();
}

async function writeAtomic(target, buf) {
  const tmp = target + '.tmp';
  await fs.writeFile(tmp, buf);
  await fs.rm(target, { force: true });
  await fs.rename(tmp, target);
  console.log('wrote', target, '(', buf.byteLength, 'bytes )');
}

const PHOTOS = path.resolve('public/photos');
await fs.mkdir(PHOTOS, { recursive: true });

const cookingHeic = await heicToBuffer(
  path.resolve('About me Photos/IMG_5557.HEIC'),
);
const cookingJpg = await compress(cookingHeic, { width: 1200, quality: 80 });
await writeAtomic(path.join(PHOTOS, 'cooking.jpg'), cookingJpg);

const photoHeic = await heicToBuffer(
  path.resolve('About me Photos/IMG_5345.HEIC'),
);
const photoJpg = await compress(photoHeic, { width: 1200, quality: 80 });
await writeAtomic(path.join(PHOTOS, 'photography.jpg'), photoJpg);
// Reuse the same shot for the Airify project card.
await writeAtomic(path.join(PHOTOS, 'airify.jpg'), photoJpg);

// Muay Thai source: the user pasted this earlier in the chat; Cursor saved
// it under .cursor/projects/.../assets/. Find any png in that folder and use it.
const ASSETS = path.resolve(
  '../../.cursor/projects/c-Users-Narayan-Lamichhane-Downloads-temp-portfolio/assets',
);
try {
  const list = await fs.readdir(ASSETS);
  const png = list.find((n) => /\.png$/i.test(n));
  if (png) {
    const buf = await fs.readFile(path.join(ASSETS, png));
    const out = await compress(buf, { width: 1200, quality: 80 });
    await writeAtomic(path.join(PHOTOS, 'muay-thai.jpg'), out);
  } else {
    console.warn('no muay-thai png found in', ASSETS);
  }
} catch (e) {
  console.warn('could not read assets dir:', e.message);
}
