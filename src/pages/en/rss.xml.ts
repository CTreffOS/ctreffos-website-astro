import { createRSS } from "@/rss"

export async function GET(context: { site: URL; routePattern: string }) {
  return await createRSS(context)
}
