/// <reference path="../.astro/actions.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    session: import("@repo/auth/lucia").Session | null;
    user: import("@repo/auth/lucia").User | null;
  }
}
