import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MoonIcon } from "@/components/ui/moon";
import { SunIcon } from "@/components/ui/sun";
import { BRANDS, DEFAULT_BRAND_ID, applyBrand } from "./brand-switcher";

const DEFAULT_WALLPAPER = "/wallpapers/bolivia.jpg";

function applyWorkspaceWallpaper(value: string) {
  document.documentElement.style.setProperty(
    "--governos-wallpaper",
    value.startsWith("linear-gradient") ? value : `url(${value})`,
  );
}

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Govern OS is deliberately dark-first so the glass surfaces retain contrast.
    const stored = localStorage.getItem("theme");
    const dark = stored !== "light";
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.dataset.theme = dark ? "dark" : "light";

    // Keep the streamlined workspace on the chosen defaults until the picker is exposed again.
    const brand = BRANDS.find((item) => item.id === DEFAULT_BRAND_ID) ?? BRANDS[0];
    const wallpaper = DEFAULT_WALLPAPER;
    localStorage.setItem("admin-brand", DEFAULT_BRAND_ID);
    localStorage.setItem("admin-wallpaper", "bolivia");
    localStorage.setItem("admin-wallpaper-value", DEFAULT_WALLPAPER);
    applyBrand(brand);
    applyWorkspaceWallpaper(wallpaper);
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground" onClick={toggle} aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}>
      {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
    </Button>
  );
}
