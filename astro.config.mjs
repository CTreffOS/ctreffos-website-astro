// @ts-check
import { defineConfig } from "astro/config"

import react from "@astrojs/react"

import mdx from "@astrojs/mdx"

import tailwindcss from "@tailwindcss/vite"

import sitemap from "@astrojs/sitemap"
import rehypeExternalLinks from "rehype-external-links"

// https://astro.build/config
export default defineConfig({
  site: "https://chaostreff-osnabrueck.de",
  base: "",
  integrations: [react(), mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    rehypePlugins: [
      [rehypeExternalLinks, { target: "_blank", rel: "noopener noreferrer" }],
    ],
  },
})
