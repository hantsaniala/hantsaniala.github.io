import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://hantsaniala.is-a.dev',
  base: '/',
  integrations: [tailwind()],
  output: 'static',
});
