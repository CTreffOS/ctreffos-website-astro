import { nextTreff } from "@/chaostreff"
import { format } from "date-fns"
import { getLocale } from "../i18n/utils"
import { Card, CardHeader, CardTitle, CardDescription } from "./ui/card"
import { cn } from "@/lib/utils"

export const Treffs = async ({
  lang,
  className,
}: {
  lang: string
  className: string
}) => {
  const treff = nextTreff

  if (!treff) {
    return null
  }

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>{treff.summary}</CardTitle>
        <CardDescription>
          <div>
            <time dateTime={treff.start.toISOString()}>
              {new Date(treff.start).toLocaleString(lang, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </time>

            {treff.location && (
              <div>
                {treff.location.title} {treff.location.address && " - "}
                {treff.location.address}{" "}
              </div>
            )}
          </div>
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
