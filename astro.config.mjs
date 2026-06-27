import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: 'https://paulus-lestyo.my.id',
  output: 'static',
  adapter: cloudflare({
    imageService: "compile",
  }),
  integrations: [tailwind(), react(), keystatic()],
  build: {
    assets: '_astro'
  }
});