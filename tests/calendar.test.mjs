import assert from "node:assert/strict"
import { readFileSync, readdirSync } from "node:fs"
import test from "node:test"
import ICAL from "ical.js"

for (const lang of ["de", "en"]) {
  const raw = readFileSync(
    new URL(`../dist/${lang}/calendar.ics`, import.meta.url),
    "utf8",
  )
  const calendar = new ICAL.Component(ICAL.parse(raw))
  const events = calendar.getAllSubcomponents("vevent")
  const masters = events.filter((event) => event.hasProperty("rrule"))

  test(`${lang}: valid content lines, folding and UTC timestamps`, () => {
    assert.ok(raw.endsWith("\r\n"))
    assert.doesNotMatch(raw.replaceAll("\r\n", ""), /[\r\n]/)
    for (const line of raw.split("\r\n")) {
      assert.ok(Buffer.byteLength(line) <= 75, `Overlong content line: ${line}`)
    }
    for (const line of raw
      .replace(/\r\n[ \t]/g, "")
      .split("\r\n")
      .filter(Boolean)) {
      assert.match(line, /^[A-Z0-9-]+(?:;[^:]*)?:/)
      if (/^(DTSTAMP|CREATED|LAST-MODIFIED):/.test(line)) {
        assert.match(line, /:\d{8}T\d{6}Z$/)
      }
    }
    for (const event of masters) {
      const until = event.getFirstPropertyValue("rrule").until
      if (until) assert.equal(until.zone.tzid, "UTC", "UNTIL must be UTC")
    }
  })

  test(`${lang}: embedded Berlin timezone and correct DST transitions`, () => {
    const zone = calendar
      .getAllSubcomponents("vtimezone")
      .find(
        (component) =>
          component.getFirstPropertyValue("tzid") === "Europe/Berlin",
      )
    assert.ok(zone, "Missing Europe/Berlin VTIMEZONE")
    const timezone = new ICAL.Timezone({ component: zone })
    ICAL.TimezoneService.register(timezone)
    for (const month of [1, 7]) {
      const time = ICAL.Time.fromData(
        { year: 2026, month, day: 15, hour: 19 },
        timezone,
      )
      assert.equal(time.utcOffset(), month === 1 ? 3600 : 7200)
    }
    for (const event of events) {
      const start = event.getFirstProperty("dtstart")
      if (start.getParameter("tzid")) {
        assert.equal(start.getParameter("tzid"), "Europe/Berlin")
      }
    }
  })

  test(`${lang}: stable recurring IDs, local meeting times and monthly patterns`, () => {
    assert.deepEqual(
      masters.map((event) => event.getFirstPropertyValue("uid")),
      ["regular-chaostreff", "regular-chaostreff-2026", "chaosupdate-2026"],
    )
    for (const component of masters) {
      const event = new ICAL.Event(component)
      assert.equal(event.startDate.hour, 19)
      assert.equal(event.endDate.hour, 23)
      const iterator = event.iterator()
      for (let i = 0; i < 60; i++) {
        const date = iterator.next()
        if (!date) break
        assert.equal(date.dayOfWeek(), 5, "Meetings must be on Thursday")
        assert.equal(date.hour, 19, "Meetings stay at 19:00 across DST")
        if (event.uid === "regular-chaostreff") assert.ok(date.year <= 2025)
        else {
          const ordinal = Math.ceil(date.day / 7)
          assert.equal(ordinal === 2, event.uid === "chaosupdate-2026")
        }
      }
    }
  })

  test(`${lang}: exclusions have same-UID cancelled overrides for existing subscribers`, () => {
    const cancelled = events.filter(
      (event) => event.getFirstPropertyValue("status") === "CANCELLED",
    )
    let exclusions = 0
    for (const master of masters) {
      for (const property of master.getAllProperties("exdate")) {
        for (const date of property.getValues()) {
          exclusions++
          assert.equal(date.hour, 19)
          const override = cancelled.find(
            (event) =>
              event.getFirstPropertyValue("uid") ===
                master.getFirstPropertyValue("uid") &&
              event.getFirstPropertyValue("recurrence-id").toString() ===
                date.toString(),
          )
          assert.ok(override, `Missing cancelled occurrence ${date}`)
          assert.equal(
            override.getFirstProperty("recurrence-id").getParameter("tzid"),
            "Europe/Berlin",
          )
          assert.equal(override.hasProperty("rrule"), false)
          assert.equal(
            override.getFirstPropertyValue("dtstart").toString(),
            date.toString(),
          )
          assert.ok(override.getFirstPropertyValue("sequence") > 0)
        }
      }
    }
    assert.ok(exclusions >= 10)
    assert.equal(cancelled.length, exclusions)
  })

  test(`${lang}: content events keep their wall times and inclusive all-day end dates`, () => {
    const sourceDir = new URL(`../src/content/events/${lang}/`, import.meta.url)
    for (const file of readdirSync(sourceDir).filter((file) =>
      /\.mdx?$/.test(file),
    )) {
      const source = readFileSync(new URL(file, sourceDir), "utf8")
      const id = `${lang}/${file.replace(/\.mdx?$/, "")}`
      const component = events.find(
        (event) => event.getFirstPropertyValue("uid") === id,
      )
      assert.ok(component, `Missing event ${id}`)
      const allDay = /^isAllDay: true$/m.test(source)
      for (const [field, property] of [
        ["startDate", "dtstart"],
        ["endDate", "dtend"],
      ]) {
        const value = source.match(new RegExp(`^${field}: (\\S+)`, "m"))?.[1]
        if (!value) continue
        const expected = ICAL.Time.fromDateTimeString(value)
        if (allDay) {
          expected.isDate = true
          if (field === "endDate") expected.adjust(1, 0, 0, 0)
        }
        assert.equal(
          component.getFirstPropertyValue(property).toString(),
          expected.toString(),
          `${id} ${field}`,
        )
      }
    }
  })
}
