import { defineCollection, z } from "astro:content"
import { glob } from "astro/loaders"

const newsCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/news" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string(),
    date: z.date(),
  }),
})

const eventsCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/events" }),
  schema: z.object({
    startDate: z.date(),
    endDate: z.date(),
    isAllDay: z.boolean().optional(),
    title: z.string(),
    speaker: z.string().optional(),
    locationName: z.string(),
    locationAddress: z.string().optional(),
    category: z.string().optional(),
  }),
})

export const collections = {
  news: newsCollection,
  events: eventsCollection,
}
