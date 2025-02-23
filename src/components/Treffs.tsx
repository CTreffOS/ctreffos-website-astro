import { format } from "date-fns"
import { getLocale } from "../i18n/utils"
import type { Treff } from "@/chaostreff"

export const Treffs = async ({
  treffs,
  lang,
}: {
  treffs: Treff[]
  lang: string
}) => {
  if (!treffs.length) {
    return null
  }

  return (
    <div>
      <ul>
        {treffs.map((treff, index) => (
          <li key={index}>
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
        ))}
      </ul>
    </div>
  )
}
