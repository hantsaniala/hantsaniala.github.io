import sharp from 'sharp';
import { readdir, stat, rename, rm } from 'node:fs/promises';
import { join, extname } from 'node:path';

const ASSETS_DIR = new URL('../public/assets/', import.meta.url).pathname;

const JOBS = [
  {
    file: 'profile2.jpg',
    pipeline: (img) => img.resize(1400, 1400, { fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 85, mozjpeg: true }),
  },
  {
    file: 'profile2.png',
    pipeline: (img) => img.resize(900, 600, { fit: 'inside', withoutEnlargement: true }).png({ quality: 85, compressionLevel: 9 }),
  },
  {
    file: 'logo.png',
    pipeline: (img) => img.png({ compressionLevel: 9 }),
  },
];

const before = await stat(join(ASSETS_DIR, 'logo.png')).catch(() => null);
const sizesBefore = {};
for (const entry of await readdir(ASSETS_DIR)) {
  if (extname(entry).toLowerCase() !== '.png' && extname(entry).toLowerCase() !== '.jpg') continue;
  sizesBefore[entry] = (await stat(join(ASSETS_DIR, entry))).size;
}

for (const job of JOBS) {
  const input = join(ASSETS_DIR, job.file);
  const tmp = join(ASSETS_DIR, `.${job.file}.tmp`);
  const out = job.pipeline(sharp(input));
  const meta = await out.metadata();
  await out.toFile(tmp);
  await rm(input);
  await rename(tmp, input);
  const after = (await stat(join(ASSETS_DIR, job.file))).size;
  const beforeSize = sizesBefore[job.file] ?? 0;
  console.log(
    `${job.file}: ${(beforeSize / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB ` +
    `(${((1 - after / beforeSize) * 100).toFixed(1)}% smaller) ${meta.width}x${meta.height}`
  );
}
