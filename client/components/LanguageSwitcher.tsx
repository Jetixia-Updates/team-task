import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";
import { supportedLngs, type SupportedLng } from "@/i18n";

const languageNames: Record<SupportedLng, string> = {
  en: "English",
  ar: "العربية",
};

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation("language");

  const currentLng = (i18n.language?.split("-")[0] || "en") as SupportedLng;
  const effectiveLng = supportedLngs.includes(currentLng) ? currentLng : "en";

  const handleChange = (lng: SupportedLng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="gap-2" aria-label="Change language">
          <Languages className="h-4 w-4" />
          <span className="hidden sm:inline text-sm font-medium">
            {languageNames[effectiveLng]}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {supportedLngs.map((lng) => (
          <DropdownMenuItem
            key={lng}
            onClick={() => handleChange(lng)}
            className={effectiveLng === lng ? "bg-accent" : ""}
          >
            {t(lng)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
