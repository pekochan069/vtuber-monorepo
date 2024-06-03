/// <reference types="astro/client" />

// import type { HtmxAttributes } from "typed-htmx";
// import type { D1Database, R2Bucket } from "@cloudflare/workers-types";
// import type { Runtime } from "@astrojs/cloudflare";

type HtmxAttributes = import("typed-htmx").HtmxAttributes;
declare namespace astroHTML.JSX {
  interface HTMLAttributes extends HtmxAttributes {}
}

type D1Database = import("@cloudflare/workers-types").D1Database;
type R2Bucket = import("@cloudflare/workers-types").R2Bucket;
type AppEnv = {
  DB: D1Database;
  R2: R2Bucket;
};

type Runtime = import("@astrojs/cloudflare").Runtime<AppEnv>;
declare namespace App {
  interface Locals extends Runtime {}
}
