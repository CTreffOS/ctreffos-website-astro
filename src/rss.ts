import rss, { type RSSFeedItem } from "@astrojs/rss"
import { getCollection } from "astro:content"
import sanitizeHtml from "sanitize-html"
import MarkdownIt from "markdown-it"
import { useTranslations, getLangFromUrl } from "@/i18n/utils"
const parser = new MarkdownIt()

export const createRSS = async (context: {
  site: URL
  routePattern: string
}) => {
  const lang = getLangFromUrl(context.routePattern)

  const t = useTranslations(lang)

  const news = (await getCollection("news"))
    .toSorted((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .filter((item) => item.slug.startsWith(`${lang}/`))

  return rss({
    title: t("rss.title"),
    description: t("rss.description"),
    site: context.site,
    items: news.map(
      (item) =>
        ({
          title: item.data.title,
          author: item.data.author,
          pubDate: item.data.date,
          link: `${import.meta.env.BASE_URL}/${
            item.slug.split("/")[0] +
            "/" +
            item.collection +
            "/" +
            item.slug.split("/")[1]
          }`,
          content: sanitizeHtml(parser.render(item.body), {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
          }),
        }) as RSSFeedItem,
    ),
    customData: `<language>${lang}</language>`,
  })
}
