import {
  addDays,
  addMonths,
  eachDayOfInterval,
  isAfter,
  isBefore,
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

export interface Treff {
  start: Date
  end: Date
  summary: string
  description: ICalDescription
  location: ICalLocationWithTitle
  repeating: ICalRepeatingOptions
  timezone: string
}

export const createTreffEvent: (description: string) => Treff = (
  description,
) => ({
  start: new Date(2024, 11, 5, 19),
  end: new Date(2024, 11, 5, 23),
  summary: "Chaostreff",
  description: {
    plain: description,
  } as ICalDescription,
  location: {
    title: "Uni AStA Osnabrück",
    address: "Alte Münze 12, 49074 Osnabrück, Deutschland",
  } as ICalLocationWithTitle,
  repeating: {
    freq: ICalEventRepeatingFreq.WEEKLY,
    exclude: [new Date(2024, 11, 26, 19)] as ICalDateTimeValue[],
  },
  timezone: "Europe/Berlin",
})

const createTreffsList = () => {
  const treffEvent = createTreffEvent("")

  return (
    eachDayOfInterval({
      start: treffEvent.start,
      end: addMonths(new Date(), 3),
    })
      .filter((date) => isThursday(date))
      // todo filter exclude
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
  )
}

export const nextTreff = createTreffsList()
  .filter((treff) => isAfter(treff.start, startOfDay(new Date())))
  .toSorted((a, b) => a.start.getTime() - b.start.getTime())[0]
