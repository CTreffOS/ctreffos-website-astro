// @ts-check
import { defineConfig } from "astro/config"

import react from "@astrojs/react"

import tailwind from "@astrojs/tailwind"

import mdx from "@astrojs/mdx"

import sitemap from "@astrojs/sitemap"

// https://astro.build/config
export default defineConfig({
  site: "https://chaostreff-osnabrueck.de",
  base: "",
  integrations: [
    react(),
    tailwind({
      // Example: Disable injecting a basic `base.css` import on every page.
      // Useful if you need to define and/or import your own custom `base.css`.
      applyBaseStyles: false,
    }),
    mdx(),
    sitemap(),
  ],
})
