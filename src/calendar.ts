import { getCollection } from "astro:content"
import sanitizeHtml from "sanitize-html"
import MarkdownIt from "markdown-it"
import ical, {
  ICalCalendarMethod,
  type ICalDescription,
  type ICalLocationWithTitle,
} from "ical-generator"
import { createTreffEvent } from "@/chaostreff"
import { useTranslations, getLangFromUrl } from "@/i18n/utils"
const parser = new MarkdownIt()

export const createCalendar = async (context: {
  site: URL
  routePattern: string
}) => {
  const lang = getLangFromUrl(context.routePattern)

  const t = useTranslations(lang)

  const events = (await getCollection("events"))
    .toSorted((a, b) => b.data.startDate.getTime() - a.data.startDate.getTime())
    .filter((item) => item.slug.startsWith(`${lang}/`))

  const calendar = ical({
    name: "Chaostreff Osnabrück e.V",
    timezone: "Europe/Berlin",
    method: ICalCalendarMethod.PUBLISH,
    ttl: 60 * 60,
  })

  calendar.createEvent(createTreffEvent(t("calendar.description")))

  events.forEach((event) => {
    calendar.createEvent({
      start: new Date(event.data.startDate.toISOString().replace("Z", "")),
      end: event.data.endDate
        ? new Date(event.data.endDate.toISOString().replace("Z", ""))
        : null,
      allDay: event.data.endDate ? false : true,
      summary: event.data.title,
      description: {
        plain:
          event.body?.trim().length > 0
            ? sanitizeHtml(parser.render(event.body), {
                allowedTags: [],
                allowedAttributes: {},
              })
            : "",
        html:
          event.body?.trim().length > 0
            ? sanitizeHtml(parser.render(event.body))
            : "",
      } as ICalDescription,
      location:
        event.data.locationName ||
        (event.data.locationAddress &&
          ({
            title: event.data.locationName,
            address: event.data.locationAddress,
          } as ICalLocationWithTitle)),
      url: `${import.meta.env.BASE_URL}/${lang}/about#${event.slug}`,
      timezone: "Europe/Berlin",
    })
  })

  return new Response(calendar.toString(), {
    headers: {
      "Content-Type": "text/calendar",
    },
  })
}
