import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import test from "node:test"

const site = "https://chaostreff-osnabrueck.de"
const outputDir = new URL("../dist/", import.meta.url)

function readSitemap(name) {
  const file = new URL(name, outputDir)
  assert.ok(existsSync(file), `Expected generated sitemap file ${name}`)
  return readFileSync(file, "utf8")
}

function locationsFrom(xml) {
  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>/)
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
}

test("sitemap index points to the generated URL sitemap", () => {
  const index = readSitemap("sitemap-index.xml")
  assert.match(
    index,
    /<sitemapindex\b[^>]*xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/,
  )
  assert.deepEqual(locationsFrom(index), [`${site}/sitemap-0.xml`])
})

test("URL sitemap contains canonical site pages and no redirect aliases", () => {
  const sitemap = readSitemap("sitemap-0.xml")
  assert.match(
    sitemap,
    /<urlset\b[^>]*xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/,
  )
  const urls = locationsFrom(sitemap)
  assert.ok(
    urls.length > 30,
    `Expected substantial site coverage, got ${urls.length} URLs`,
  )
  assert.equal(new Set(urls).size, urls.length, "Sitemap URLs must be unique")

  for (const url of urls) {
    assert.ok(url.startsWith(`${site}/`), `Unexpected sitemap host: ${url}`)
    const path = decodeURIComponent(new URL(url).pathname)
    const pageFile = new URL(
      `../dist${path}${path.endsWith("/") ? "index.html" : ""}`,
      import.meta.url,
    )
    assert.ok(existsSync(pageFile), `Sitemap URL has no generated page: ${url}`)
  }

  for (const expected of ["/", "/de/", "/en/", "/de/news/", "/en/news/"]) {
    assert.ok(
      urls.includes(`${site}${expected}`),
      `Missing expected sitemap URL: ${expected}`,
    )
  }

  for (const alias of ["/diday-www/", "/donate.html/", "/index-en.html/"]) {
    assert.ok(
      !urls.includes(`${site}${alias}`),
      `Redirect alias should not be indexed: ${alias}`,
    )
  }
})
