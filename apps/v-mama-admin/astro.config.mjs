import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";

import solidJs from "@astrojs/solid-js";

// https://astro.build/config
export default defineConfig({
  integration: [tailwind()],
  output: "server",
  adapter: vercel(),
  integrations: [solidJs()]
});