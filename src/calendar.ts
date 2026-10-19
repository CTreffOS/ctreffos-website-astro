import { getCollection, render } from "astro:content"
import sanitizeHtml from "sanitize-html"
import MarkdownIt from "markdown-it"
import ical, {
  ICalCalendarMethod,
  ICalEventStatus,
  type ICalDescription,
  type ICalLocationWithTitle,
} from "ical-generator"
import { createAllTreffEvents } from "@/chaostreff"
import { useTranslations, getLangFromUrl } from "@/i18n/utils"
import { addDays, parseISO } from "date-fns"
import { TZDate, tz } from "@date-fns/tz"
import { getVtimezoneComponent } from "@touch4it/ical-timezones"
const parser = new MarkdownIt()

export const createCalendar = async (context: {
  site: URL
  routePattern: string
}) => {
  const lang = getLangFromUrl(context.routePattern)
  const getEntryPath = (item: { slug?: string; id?: string }) =>
    (item.slug ?? item.id ?? "").replace(/\.(md|mdx)$/, "")

  const t = useTranslations(lang)

  const events = (await getCollection("events"))
    .toSorted((a, b) => b.data.startDate.getTime() - a.data.startDate.getTime())
    .filter((item) => getEntryPath(item).startsWith(`${lang}/`))

  const calendar = ical({
    name: "Chaostreff Osnabrück e.V.",
    // A calendar-level zone makes ical-generator serialize UNTIL and timestamps
    // as local times. Keep those UTC, but embed the zones used by the events.
    timezone: { name: null, generator: getVtimezoneComponent },
    method: ICalCalendarMethod.PUBLISH,
    ttl: 60 * 60,
  })

  const treffEvents = createAllTreffEvents(
    t("calendar.summary.regular"),
    t("calendar.summary.chaosupdate"),
    t("calendar.description"),
  )
  for (const treffEvent of treffEvents) {
    calendar.createEvent(treffEvent)
    // Keep EXDATE for recurrence expansion, and explicitly cancel the same
    // UID/RECURRENCE-ID for subscribers that already cached the occurrence.
    for (const start of treffEvent.repeating.exclude ?? []) {
      calendar.createEvent({
        ...treffEvent,
        repeating: undefined,
        recurrenceId: start,
        start,
        end: new TZDate(
          start.getFullYear(),
          start.getMonth(),
          start.getDate(),
          23,
          0,
          "Europe/Berlin",
        ),
        status: ICalEventStatus.CANCELLED,
      })
    }
  }

  for (const event of events) {
    const eventPath = getEntryPath(event)
    const { remarkPluginFrontmatter } = await render(event)
    const body = event.body ?? ""

    let endDate = event.data.endDate
      ? parseISO(event.data.endDate.toISOString().replace("Z", ""), {
          in: tz("Europe/Berlin"),
        })
      : null

    if (endDate && event.data.isAllDay) {
      endDate = addDays(endDate, 1, { in: tz("Europe/Berlin") })
    }

    calendar.createEvent({
      id: eventPath,
      created: new Date(remarkPluginFrontmatter.created),
      stamp: new Date(remarkPluginFrontmatter.created),
      lastModified: new Date(remarkPluginFrontmatter.lastModified),
      start: parseISO(event.data.startDate.toISOString().replace("Z", ""), {
        in: tz("Europe/Berlin"),
      }),
      end: endDate,
      allDay: event.data.isAllDay,
      summary: event.data.title,
      description: {
        plain:
          body.trim().length > 0
            ? sanitizeHtml(parser.render(body), {
                allowedTags: [],
                allowedAttributes: {},
              })
            : "",
        html:
          body.trim().length > 0
            ? sanitizeHtml(parser.render(body))
            : "",
      } as ICalDescription,
      location:
        event.data.locationName ||
        (event.data.locationAddress &&
          ({
            title: event.data.locationName,
            address: event.data.locationAddress,
          } as ICalLocationWithTitle)),
      url: `${context.site.origin}/${lang}/about#${eventPath}`,
      timezone: "Europe/Berlin",
    })
  }

  return new Response(`${calendar.toString()}\r\n`, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
    },
  })
}
