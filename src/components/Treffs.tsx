import { nextTreff } from "@/chaostreff"
import { format } from "date-fns"
import { getLocale } from "../i18n/utils"

export const Treffs = async ({ lang }: { lang: string }) => {
  const treff = nextTreff

  if (!treff) {
    return null
  }

  return (
    <div>
      <ul>
        {
          <li>
            <div className="font-bold">
              {format(treff.start, "Pp", {
                locale: getLocale(lang),
              })}
            </div>
            <div>
              {treff.summary}{" "}
              {treff.location.address && ` (${treff.location.address})`}
            </div>
          </li>
        }
      </ul>
    </div>
  )
}
