import { createCalendar } from "@/calendar"

export async function GET(context: { site: URL; routePattern: string }) {
  return await createCalendar(context)
}
