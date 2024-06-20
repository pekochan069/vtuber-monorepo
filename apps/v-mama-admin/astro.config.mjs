import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";
import solidJs from "@astrojs/solid-js";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: vercel(),
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    solidJs(),
  ],
  security: {
    checkOrigin: true,
  },
  vite: {
    optimizeDeps: {
      exclude: ["@node-rs/argon2-wasm32-wasi"],
    },
  },
  experimental: {
    actions: true,
  },
});
