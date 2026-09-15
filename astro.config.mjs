// @ts-check
import { defineConfig } from "astro/config"

import react from "@astrojs/react"

import mdx from "@astrojs/mdx"

import tailwindcss from "@tailwindcss/vite"

import sitemap from "@astrojs/sitemap"
import rehypeExternalLinks from "rehype-external-links"
import { remarkModifiedTime } from "./src/remark-modified-time.mjs"
import { remarkCreatedTime } from "./src/remark-created-time.mjs"

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
    remarkPlugins: [remarkModifiedTime, remarkCreatedTime],
  },
  redirects: {
    "/index-en.html": "/en",
    "/site-notice.html": "/de/site-notice",
    "/site-notice-en.html": "/en/site-notice",
    "/privacy-policy.html": "/de/privacy-policy",
    "/privacy-policy-en.html": "/en/privacy-policy",
    "/legal-notice.html": "/de/site-notice#rechtliche-hinweise",
    "/legal-notice-en.html": "/en/site-notice#legal-notices",
    "/donate.html": "/de/donate",
    "/donate-en.html": "/en/donate",
  },
})
