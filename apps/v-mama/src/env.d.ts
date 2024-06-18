/// <reference path="../.astro/actions.d.ts" />
/// <reference types="astro/client" />

type HtmxAttributes = import("typed-htmx").HtmxAttributes;
declare namespace astroHTML.JSX {
  interface HTMLAttributes extends HtmxAttributes {}
}

type R2Bucket = import("@cloudflare/workers-types").R2Bucket;
type AppEnv = {
  R2: R2Bucket;
};

type Runtime = import("@astrojs/cloudflare").Runtime<AppEnv>;
declare namespace App {
  interface Locals extends Runtime {}
}
