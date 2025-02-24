import { defineCollection, z } from "astro:content"

const newsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string(),
    date: z.date(),
  }),
})

const eventsCollection = defineCollection({
  schema: z.object({
    startDate: z
      .date()
      .or(z.string().datetime({ local: true }).pipe(z.coerce.date())),
    endDate: z
      .date()
      .or(z.string().datetime({ local: true }).pipe(z.coerce.date()))
      .optional(),
    title: z.string(),
    speaker: z.string().optional(),
    locationName: z.string().optional(),
    locationAddress: z.string().optional(),
  }),
})

export const collections = {
  news: newsCollection,
  events: eventsCollection,
}
