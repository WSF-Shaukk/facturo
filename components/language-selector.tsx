"use client"

import { useLanguage } from "@/lib/i18n/language-context"
import type { Language } from "@/lib/i18n/translations"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { GlobeIcon } from "lucide-react"

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage()

  const languages: { code: Language; name: string }[] = [
    { code: "en", name: t.languages.en },
    { code: "fr", name: t.languages.fr },
    { code: "sw", name: t.languages.sw },
    { code: "ar", name: t.languages.ar },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-1">
          <GlobeIcon className="h-4 w-4" />
          <span className="hidden sm:inline">{languages.find((l) => l.code === language)?.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={language === lang.code ? "bg-muted" : ""}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
