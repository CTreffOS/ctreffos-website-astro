import { useTranslations } from "@/i18n/utils"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@radix-ui/react-navigation-menu"

export const Navigation = ({ lang }: { lang: "en" | "de" }) => {
  const t = useTranslations(lang)

  return (
    <>
      <NavigationMenu className="flex flex-col gap-4 pb-3">
        <NavigationMenuList className="flex flex-col sm:flex-row gap-x-8 gap-y-3 text-xl sm:text-base items-center justify-center flex-wrap">
          <NavigationMenuItem>
            <NavigationMenuLink
              href={`/${lang}`}
              className="hover:bg-accent transition px-4 py-2 rounded-sm"
            >
              {t("nav.home")}
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href={`/${lang}/about`}
              className="hover:bg-accent transition px-4 py-2 rounded-sm"
            >
              {t("nav.about")}
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href={`/${lang}/hackspace`}
              className="hover:bg-accent transition px-4 py-2 rounded-sm"
            >
              {t("nav.hackspace")}
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href={`/${lang}/donate`}
              className="hover:bg-accent transition px-4 py-2 rounded-sm"
            >
              {t("nav.donate")}
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuList className="flex flex-col sm:flex-row gap-x-8 gap-y-3 text-xl sm:text-base items-center justify-center flex-wrap">
          <NavigationMenuItem>
            <NavigationMenuLink
              href={`/${lang}/faq`}
              className="hover:bg-accent transition px-4 py-2 rounded-sm"
            >
              {t("nav.faq")}
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href={`/${lang}/contact`}
              className="hover:bg-accent transition px-4 py-2 rounded-sm"
            >
              {t("nav.contact")}
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <hr className="rainbow h-1 mb-4" />
    </>
  )
}
