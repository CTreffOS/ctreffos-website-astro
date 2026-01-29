import {
  addMonths,
  isAfter,
  isEqual,
  isThursday,
  nextThursday,
} from "date-fns"
import {
  ICalEventRepeatingFreq,
  ICalWeekday,
  type ICalDateTimeValue,
  type ICalEventData,
} from "ical-generator"
import { z } from "astro:content"
import { execSync } from "child_process"
import { statSync } from "fs"
import { fileURLToPath } from "url"

type Treff = Pick<
  ICalEventData,
  | "id"
  | "created"
  | "stamp"
  | "lastModified"
  | "start"
  | "end"
  | "summary"
  | "description"
  | "location"
  | "repeating"
  | "timezone"
>

const getModifiedTime = () => {
  try {
    const filepath = fileURLToPath(import.meta.url)
    const gitresult = execSync(`git log -1 --pretty="format:%cI" "${filepath}"`)
      .toString()
      .trim()
    if (gitresult) {
      return new Date(gitresult)
    }
  } catch {
    // Ignore error and fallback to statSync
  }

  try {
    const filepath = fileURLToPath(import.meta.url)
    return statSync(filepath).mtime
  } catch {
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

// New pattern with Chaosupdate starts January 2026
const NEW_PATTERN_START = new Date(2026, 0, 1)

// Which Thursday of the month is this date? (1-5)
const getThursdayOfMonth = (date: Date): number => Math.ceil(date.getDate() / 7)

/** Returns true if the given date falls on a Chaosupdate Thursday (2nd Thursday, from 2026+). */
const isChaosupdate = (date: Date): boolean =>
  date >= NEW_PATTERN_START && getThursdayOfMonth(date) === 2

const location: Treff["location"] = {
  title: "Uni AStA Osnabrück",
  address: "Alte Münze 12, 49074 Osnabrück, Deutschland",
}

/**
 * Old weekly pattern (Dec 2024 - Dec 2025)
 * All meetings are just "Offenes Chaos" / "Open Chaos"
 */
const createOldTreffEvent = (
  summary: string,
  description: string,
): Treff => {
  const exclusions = excludeDates.filter((d) => d < NEW_PATTERN_START)

  return {
    id: "regular-chaostreff",
    created: new Date(2024, 11, 5),
    stamp: new Date(2024, 11, 5),
    lastModified,
    start: new Date(2024, 11, 5, 19),
    end: new Date(2024, 11, 5, 23),
    summary,
    description: { plain: description },
    location,
    repeating: {
      freq: ICalEventRepeatingFreq.WEEKLY,
      until: new Date(2025, 11, 31, 23, 59),
      ...(exclusions.length > 0 && {
        exclude: exclusions as ICalDateTimeValue[],
      }),
    },
    timezone: "Europe/Berlin",
  }
}

/**
 * New monthly pattern (Jan 2026+): Regular Thursdays (1st, 3rd, 4th, 5th)
 */
const createRegularTreffEvent = (
  summary: string,
  description: string,
): Treff => {
  const exclusions = excludeDates.filter(
    (date) => date >= NEW_PATTERN_START && !isChaosupdate(date),
  )

  return {
    id: "regular-chaostreff-2026",
    created: new Date(2026, 0, 1),
    stamp: new Date(2026, 0, 1),
    lastModified,
    start: new Date(2026, 0, 1, 19, 0), // Jan 1, 2026 (1st Thursday)
    end: new Date(2026, 0, 1, 23, 0),
    summary,
    description: { plain: description },
    location,
    repeating: {
      freq: ICalEventRepeatingFreq.MONTHLY,
      byDay: [ICalWeekday.TH],
      bySetPos: [1, 3, 4, 5],
      ...(exclusions.length > 0 && {
        exclude: exclusions as ICalDateTimeValue[],
      }),
    },
    timezone: "Europe/Berlin",
  }
}

/**
 * New monthly pattern (Jan 2026+): Chaosupdate (2nd Thursday only)
 */
const createChaosUpdateEvent = (
  summary: string,
  description: string,
): Treff => {
  const exclusions = excludeDates.filter(isChaosupdate)

  return {
    id: "chaosupdate-2026",
    created: new Date(2024, 11, 5),
    stamp: new Date(2024, 11, 5),
    lastModified,
    start: new Date(2026, 0, 8, 19, 0), // Jan 8, 2026 (2nd Thursday)
    end: new Date(2026, 0, 8, 23, 0),
    summary,
    description: { plain: description },
    location,
    repeating: {
      freq: ICalEventRepeatingFreq.MONTHLY,
      byDay: [ICalWeekday.TH],
      bySetPos: 2,
      ...(exclusions.length > 0 && {
        exclude: exclusions as ICalDateTimeValue[],
      }),
    },
    timezone: "Europe/Berlin",
  }
}

/**
 * All Treff events for the calendar (old + new patterns)
 */
export const createAllTreffEvents = (
  regularSummary: string,
  chaosupdateSummary: string,
  description: string,
): Treff[] => [
  createOldTreffEvent(regularSummary, description),
  createRegularTreffEvent(regularSummary, description),
  createChaosUpdateEvent(chaosupdateSummary, description),
]

interface TreffListItem {
  id: string
  summaryKey: "calendar.summary.regular" | "calendar.summary.chaosupdate"
  start: Date
  end: Date
  location: Treff["location"]
}

/** Finds the next upcoming Treff that hasn't ended yet. */
export const nextTreff = (): TreffListItem | undefined => {
  const now = new Date()
  const maxDate = addMonths(now, 3)
  let date = isThursday(now) ? now : nextThursday(now)

  while (date <= maxDate) {
    const isExcluded = excludeDates.some((exc) =>
      isEqual(
        new Date(exc.getFullYear(), exc.getMonth(), exc.getDate()),
        new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      ),
    )

    if (!isExcluded) {
      const endTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 0)

      if (isAfter(endTime, now)) {
        return {
          id: `treff-${date.toISOString().slice(0, 10)}`,
          summaryKey: isChaosupdate(date) ? "calendar.summary.chaosupdate" : "calendar.summary.regular",
          start: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 19, 0),
          end: endTime,
          location,
        }
      }
    }

    date = nextThursday(date)
  }

  return undefined
}
