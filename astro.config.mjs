import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://hantsaniala.is-a.dev',
  base: '/',
  integrations: [tailwind(), sitemap()],
  output: 'static',
});
