// One-off HEIC -> JPEG converter for the About-me portrait.
import { promises as fs } from 'fs';
import path from 'path';
import convert from 'heic-convert';

const SRC = path.resolve('About me Photos/IMG_6339.HEIC');
const OUT = path.resolve('public/photos/about-portrait.jpg');

const inputBuffer = await fs.readFile(SRC);
const outputBuffer = await convert({
  buffer: inputBuffer,
  format: 'JPEG',
  quality: 0.86,
});

await fs.mkdir(path.dirname(OUT), { recursive: true });
await fs.writeFile(OUT, Buffer.from(outputBuffer));
console.log('wrote', OUT, '(', outputBuffer.byteLength, 'bytes )');
