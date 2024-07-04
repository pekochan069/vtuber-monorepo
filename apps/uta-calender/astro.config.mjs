import solidJs from "@astrojs/solid-js";
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  integrations: [solidJs(), tailwind({
    applyBaseStyles: false
  })],
  security: {
    checkOrigin: true
  },
  experimental: {
    actions: true
  },
  output: "server",
  adapter: vercel()
});