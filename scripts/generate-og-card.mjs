import sharp from 'sharp';
import { join } from 'node:path';

const ASSETS = new URL('../public/assets/', import.meta.url).pathname;
const W = 1200;
const H = 630;
const YELLOW = '#ffd200';
const DARK = '#0a0a0a';

// Right-side photo strip: 560px wide, cropped at 59% horizontal / vertical center (hero parity)
const STRIP_W = 560;
const STRIP_H = 630;
const PHOTO_SRC = join(ASSETS, 'profile2.jpg'); // 2800x2800 after optimize

const src = sharp(PHOTO_SRC);
const srcMeta = await src.metadata();
const sw = srcMeta.width;
const sh = srcMeta.height;

// Crop a STRIP_W x STRIP_H (scaled up from source) region at 59% horizontal / center vertical
const scale = STRIP_H / sh; // fit height to 630
const cropW = Math.round(STRIP_W / scale);
const cropH = sh;
const maxX = sw - cropW;
const x = Math.round(maxX * 0.59);
const y = 0;

const photo = await src
  .extract({ left: x, top: y, width: cropW, height: cropH })
  .resize(STRIP_W, STRIP_H)
  .jpeg({ quality: 85 })
  .toBuffer();

const logo = await sharp(join(ASSETS, 'logo.png')).resize(180, 180).png().toBuffer();

// Left panel text via SVG
const textSvg = Buffer.from(`<svg width="${W - STRIP_W - 80}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .name { font: 700 58px Helvetica, Arial, sans-serif; fill: ${DARK}; }
      .tag  { font: 400 28px Helvetica, Arial, sans-serif; fill: ${DARK}; }
    </style>
  </defs>
  <text x="0" y="250" class="name">Hantsaniala Eléo</text>
  <text x="2" y="306" class="tag">Freelance Go &amp; Python Developer</text>
</svg>`);

const outPath = join(ASSETS, 'og-card.jpg');
await sharp({
  create: { width: W, height: H, channels: 4, background: YELLOW },
})
  .composite([
    { input: logo, left: 56, top: 460 },
    { input: textSvg, left: 40, top: 110 },
    { input: photo, left: W - STRIP_W, top: 0 },
  ])
  .flatten({ background: YELLOW })
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(outPath);

const info = await sharp(outPath).metadata();
console.log('og-card.jpg written', info.width + 'x' + info.height);
