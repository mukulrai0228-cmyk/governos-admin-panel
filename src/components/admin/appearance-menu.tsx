import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "@/components/ui/check";
import { PaletteIcon } from "@/components/ui/palette";
import { SunIcon } from "@/components/ui/sun";
import { MoonIcon } from "@/components/ui/moon";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BRANDS, DEFAULT_BRAND_ID, applyBrand, gradientCss } from "./brand-switcher";

const WALLPAPER_KEY = "admin-wallpaper";
const DEFAULT_WALLPAPER = "/wallpapers/bolivia.jpg";
const WALLPAPERS = [
  { id: "mountain", label: "Mountain", value: "/wallpapers/mountain.jpg" },
  { id: "aurora", label: "Aurora", value: "linear-gradient(135deg, #162d52 0%, #55345f 46%, #ef7658 100%)" },
  { id: "bolivia", label: "Deep Space", value: "/wallpapers/bolivia.jpg" },
] as const;

const wallpaperPreview = (value: string) => value.startsWith("linear-gradient") ? value : `url(${value})`;

function setWallpaper(value: string) {
  document.documentElement.style.setProperty("--governos-wallpaper", value.startsWith("linear-gradient") ? value : `url(${value})`);
}

export function AppearanceMenu() {
  const [activeBrand, setActiveBrand] = useState(DEFAULT_BRAND_ID);
  const [wallpaper, setWallpaperId] = useState("bolivia");
  const [isDark, setIsDark] = useState(true);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const brandId = localStorage.getItem("admin-brand") ?? DEFAULT_BRAND_ID;
    const savedWallpaper = localStorage.getItem(WALLPAPER_KEY) ?? "bolivia";
    const storedTheme = localStorage.getItem("theme");
    const brand = BRANDS.find((item) => item.id === brandId) ?? BRANDS.find((item) => item.id === DEFAULT_BRAND_ID) ?? BRANDS[0];
    const builtIn = WALLPAPERS.find((item) => item.id === savedWallpaper);
    setActiveBrand(brand.id);
    setWallpaperId(builtIn ? builtIn.id : "custom");
    setIsDark(storedTheme !== "light");
    applyBrand(brand);
    setWallpaper(builtIn?.value ?? localStorage.getItem("admin-wallpaper-value") ?? DEFAULT_WALLPAPER);
  }, []);

  const chooseBrand = (brand: (typeof BRANDS)[number]) => {
    setActiveBrand(brand.id);
    applyBrand(brand);
    localStorage.setItem("admin-brand", brand.id);
  };

  const chooseWallpaper = (item: (typeof WALLPAPERS)[number]) => {
    setWallpaperId(item.id);
    setWallpaper(item.value);
    localStorage.setItem(WALLPAPER_KEY, item.id);
    localStorage.setItem("admin-wallpaper-value", item.value);
  };

  const chooseTheme = (dark: boolean) => {
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("theme", dark ? "dark" : "light");
  };

  const uploadWallpaper = (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const value = String(reader.result);
      setWallpaperId("custom");
      setWallpaper(value);
      localStorage.setItem(WALLPAPER_KEY, "custom");
      localStorage.setItem("admin-wallpaper-value", value);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground" aria-label="Appearance settings">
          <PaletteIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="governos-appearance-menu max-h-[calc(100vh-2rem)] max-w-3xl overflow-y-auto rounded-2xl p-0" aria-label="Appearance settings">
        <DialogHeader className="border-b border-border/70 px-6 py-6 text-left sm:px-8">
          <DialogTitle className="text-xl font-bold">Appearance</DialogTitle>
          <DialogDescription>Personalize the Govern OS workspace.</DialogDescription>
        </DialogHeader>
        <div className="space-y-7 px-6 py-6 sm:px-8 sm:py-8">
          <div>
            <div className="mb-3 flex items-end justify-between"><div><div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Mode</div><p className="mt-1 text-xs text-muted-foreground">Choose the workspace surface style.</p></div></div>
            <div className="grid grid-cols-2 gap-3">
              {([{ label: "Dark", value: true, Icon: MoonIcon, detail: "Midnight glass" }, { label: "Light", value: false, Icon: SunIcon, detail: "Bright glass" }] as const).map(({ label, value, Icon, detail }) => (
                <button key={label} type="button" onClick={() => chooseTheme(value)} aria-pressed={isDark === value} className={`group flex min-h-16 items-center gap-3 rounded-xl border px-4 text-left transition-all ${isDark === value ? "border-primary bg-primary/10 text-primary shadow-sm" : "border-border/70 bg-background/20 text-foreground hover:border-primary/40 hover:bg-accent/50"}`}>
                  <span className={`grid h-9 w-9 place-items-center rounded-lg ${isDark === value ? "bg-primary/15" : "bg-muted/60"}`}><Icon className="h-5 w-5" /></span><span className="min-w-0"><span className="block text-sm font-semibold">{label}</span><span className="block text-[11px] text-muted-foreground">{detail}</span></span>{isDark === value && <CheckIcon className="ml-auto h-4 w-4" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-end justify-between"><div><div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Wallpaper</div><p className="mt-1 text-xs text-muted-foreground">Set the atmosphere behind your workspace.</p></div></div>
            <div className="grid max-h-72 grid-cols-3 gap-3 overflow-y-auto pr-1">
          {WALLPAPERS.map((item) => (
            <button key={item.id} type="button" onClick={() => chooseWallpaper(item)} className={`group relative overflow-hidden rounded-xl border text-left transition-all hover:-translate-y-0.5 hover:border-primary/50 ${wallpaper === item.id ? "border-primary ring-2 ring-primary/25" : "border-border/70 bg-background/20"}`}>
              <span className="relative block h-20 bg-cover bg-center" style={{ backgroundImage: item.value.startsWith("linear-gradient") ? wallpaperPreview(item.value) : undefined }}>
                {!item.value.startsWith("linear-gradient") && <img src={item.value} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />}
                <span className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              </span>
              <span className="flex items-center justify-between px-3 py-2 text-xs font-medium">{item.label}{wallpaper === item.id && <CheckIcon className="h-3.5 w-3.5 text-primary" />}</span>
            </button>
          ))}
          {wallpaper === "custom" && <div className="overflow-hidden rounded-xl border border-primary ring-2 ring-primary/25"><span className="block h-20 bg-cover bg-center" style={{ backgroundImage: `var(--governos-wallpaper)` }} /><span className="flex items-center justify-between px-3 py-2 text-xs font-medium">Custom <CheckIcon className="h-3.5 w-3.5 text-primary" /></span></div>}
            </div>
            <input ref={fileInput} type="file" accept="image/*" className="hidden" onChange={(event) => uploadWallpaper(event.target.files?.[0])} />
            <Button type="button" variant="outline" className="mt-3 h-10 w-full rounded-xl text-xs" onClick={() => fileInput.current?.click()}>Upload custom wallpaper</Button>
          </div>

          <div className="border-t border-border/70 pt-6">
            <div className="mb-4"><div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Colour</div><p className="mt-1 text-xs text-muted-foreground">Change the accent without changing the workspace mood.</p></div>
            {(["Gradient", "Cool", "Green", "Warm", "Neutral"] as const).map((group) => (
              <div key={group} className="mb-5 last:mb-0">
                <div className="mb-2 text-xs font-semibold text-foreground">{group}</div>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
            {BRANDS.filter((item) => item.group === group).map((brand) => (
              <button key={brand.id} type="button" onClick={() => chooseBrand(brand)} aria-pressed={activeBrand === brand.id} className={`flex min-w-0 items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-xs transition-colors ${activeBrand === brand.id ? "border-primary/50 bg-primary/10" : "border-transparent hover:border-border/70 hover:bg-accent/60"}`} style={{ fontFamily: `"${brand.font}", sans-serif` }}>
                <span className="h-5 w-5 shrink-0 rounded-full border border-border/70 shadow-sm" style={{ background: gradientCss(brand) }} />
                <span className="min-w-0 flex-1 truncate">{brand.name}</span>
                {activeBrand === brand.id && <CheckIcon className="h-3.5 w-3.5 shrink-0 text-primary" />}
              </button>
            ))}
            </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
