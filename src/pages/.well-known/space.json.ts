import type { APIRoute } from "astro";
import CTreffLogo from "../../assets/ctreffos-logo.png";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Max-Age": "86400",
};

export const OPTIONS: APIRoute = () => {
  // Preflight response (no body required)
  return new Response(null, { status: 204, headers: corsHeaders });
};

export const GET: APIRoute = () => {
  const spaceApiData = {
    api_compatibility: ["14", "15"],
    space: "Rabbithole",
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
      mastodon: "@chaostreff_osnabrueck@chaos.social",
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
  };

  return new Response(JSON.stringify(spaceApiData, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders,
    },
  });
};
