import {
  addMonths,
  eachDayOfInterval,
  isAfter,
  isEqual,
  isThursday,
  startOfDay,
} from "date-fns"
import {
  ICalEventRepeatingFreq,
  type ICalDateTimeValue,
  type ICalDescription,
  type ICalLocationWithTitle,
  type ICalRepeatingOptions,
} from "ical-generator"
import { z } from "astro:content"
import { execSync } from "child_process"
import { statSync } from "fs"
import { fileURLToPath } from "url"

export interface Treff {
  id: string
  created: Date
  stamp: Date
  lastModified: Date
  start: Date
  end: Date
  summary: string
  description: ICalDescription
  location: ICalLocationWithTitle
  repeating: ICalRepeatingOptions
  timezone: string
}

const getModifiedTime = () => {
  try {
    const filepath = fileURLToPath(import.meta.url)
    const gitresult = execSync(`git log -1 --pretty="format:%cI" "${filepath}"`)
      .toString()
      .trim()
    if (gitresult) {
      return new Date(gitresult)
    }
  } catch (e) {
    // Ignore error and fallback to statSync
  }

  try {
    const filepath = fileURLToPath(import.meta.url)
    return statSync(filepath).mtime
  } catch (e) {
    return new Date()
  }
}

const lastModified = getModifiedTime()

const noTreffDates = [
  "2024-12-26T19:00:00",
  "2025-03-20T19:00:00",
  "2025-08-07T19:00:00",
  "2025-09-18T19:00:00",
  "2025-12-11T19:00:00",
  "2025-12-25T19:00:00",
  "2026-01-01T19:00:00",
]
const excludeDates = noTreffDates.map(
  (string) => new Date(z.string().datetime({ local: true }).parse(string)),
)

export const createTreffEvent: (description: string) => Treff = (
  description,
) => ({
  id: "regular-chaostreff",
  created: new Date(2024, 11, 5),
  stamp: new Date(2024, 11, 5),
  lastModified,
  start: new Date(2024, 11, 5, 19),
  end: new Date(2024, 11, 5, 23),
  summary: "Offenes Chaos",
  description: {
    plain: description,
  } as ICalDescription,
  location: {
    title: "Uni AStA Osnabrück",
    address: "Alte Münze 12, 49074 Osnabrück, Deutschland",
  } as ICalLocationWithTitle,
  repeating: {
    freq: ICalEventRepeatingFreq.WEEKLY,
    exclude: [...excludeDates] as ICalDateTimeValue[],
  },
  timezone: "Europe/Berlin",
})

const createTreffsList = () => {
  const treffEvent = createTreffEvent("")

  return eachDayOfInterval({
    start: treffEvent.start,
    end: addMonths(new Date(), 3),
  })
    .filter((date) => isThursday(date))
    .filter(
      (date) =>
        !excludeDates.find((a) =>
          isEqual(
            a,
            new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate(),
              treffEvent.start.getHours(),
              treffEvent.start.getMinutes(),
            ),
          ),
        ),
    )
    .map((date) => {
      return {
        ...treffEvent,
        start: new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          treffEvent.start.getHours(),
          treffEvent.start.getMinutes(),
        ),
        end: new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          treffEvent.end.getHours(),
          treffEvent.end.getMinutes(),
        ),
      }
    })
}

export const nextTreff = createTreffsList()
  .filter((treff) => isAfter(treff.end, new Date()))
  .toSorted((a, b) => a.start.getTime() - b.start.getTime())[0]
