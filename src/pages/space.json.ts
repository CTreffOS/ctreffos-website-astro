import type { APIRoute } from "astro"
import CTreffLogo from "../assets/ctreffos-logo.png"

export const GET: APIRoute = () => {
  const spaceApiData = {
    api_compatibility: ["15"],
    space: "Rabbit Hole",
    logo: CTreffLogo.src,
    url: "https://chaostreff-osnabrueck.de",
    location: {
      address: "Alte Münze 12, 49074 Osnabrück, Deutschland",
      lat: 52.2788,
      lon: 8.0432,
      timezone: "Europe/Berlin",
      country_code: "DE",
    },
    contact: {
      email: "info@chaostreff-osnabrueck.de",
      matrix: "#hub:chaostreff-osnabrueck.de",
      mastodon: "https://chaos.social/@chaostreff_osnabrueck",
    },
    feeds: {
      blog: {
        type: "rss",
        url: "https://chaostreff-osnabrueck.de/en/rss.xml",
      },
      calendar: {
        type: "ical",
        url: "https://chaostreff-osnabrueck.de/en/calendar.ics",
      },
    },
  }

  return new Response(JSON.stringify(spaceApiData, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  })
}
