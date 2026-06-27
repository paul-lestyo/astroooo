import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import node from '@astrojs/node';
import keystatic from '@keystatic/astro';

// https://astro.build/config
export default defineConfig({
  site: 'https://lestyo.com', // Ubah ke domain Anda saat production
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [tailwind(), react(), keystatic()],
  build: {
    assets: '_astro'
  }
});