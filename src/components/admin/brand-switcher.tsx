import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PaletteIcon } from "@/components/ui/palette";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Brand = {
  id: string;
  name: string;
  primary: string;
  accent: string;
  font: string;
  tone: "warm" | "cool";
  group: "Cool" | "Green" | "Warm" | "Gradient" | "Neutral";
  primaryForeground?: string;
  stops?: string[]; // gradient themes: 3+ stops used for --gradient-brand & swatch
};

export const BRANDS: Brand[] = [
  // Cool — blues & purples
  { id: "ocean",     name: "Ocean Blue",     primary: "#2563EB", accent: "#60A5FA", font: "Inter", tone: "cool", group: "Cool" },
  { id: "sapphire",  name: "Deep Sapphire",  primary: "#1D4ED8", accent: "#6366F1", font: "Inter", tone: "cool", group: "Cool" },
  { id: "azure",     name: "Azure Sky",      primary: "#0EA5E9", accent: "#7DD3FC", font: "Inter", tone: "cool", group: "Cool" },
  { id: "royal",     name: "Royal Purple",   primary: "#7C3AED", accent: "#C084FC", font: "Inter", tone: "cool", group: "Cool" },
  { id: "plum",      name: "Plum Velvet",    primary: "#6D28D9", accent: "#A855F7", font: "Inter", tone: "cool", group: "Cool" },
  { id: "indigo",    name: "Midnight Indigo",primary: "#4F46E5", accent: "#818CF8", font: "Inter", tone: "cool", group: "Cool" },
  { id: "cobalt",    name: "Cobalt",          primary: "#1E40AF", accent: "#60A5FA", font: "Inter", tone: "cool", group: "Cool" },
  { id: "electric",  name: "Electric Blue",   primary: "#1D4ED8", accent: "#38BDF8", font: "Inter", tone: "cool", group: "Cool" },
  { id: "cerulean",  name: "Cerulean",         primary: "#0284C7", accent: "#67E8F9", font: "Inter", tone: "cool", group: "Cool" },
  { id: "denim",     name: "Denim",            primary: "#1E3A8A", accent: "#93C5FD", font: "Inter", tone: "cool", group: "Cool" },
  { id: "periwinkle",name: "Periwinkle",       primary: "#6366F1", accent: "#A5B4FC", font: "Inter", tone: "cool", group: "Cool" },
  { id: "lavender",  name: "Lavender",         primary: "#8B5CF6", accent: "#DDD6FE", font: "Inter", tone: "cool", group: "Cool" },
  { id: "violet",    name: "Violet",           primary: "#5B21B6", accent: "#C4B5FD", font: "Inter", tone: "cool", group: "Cool" },
  { id: "fuchsia",   name: "Fuchsia",          primary: "#A21CAF", accent: "#F0ABFC", font: "Inter", tone: "cool", group: "Cool" },
  { id: "magenta",   name: "Magenta",          primary: "#BE185D", accent: "#F9A8D4", font: "Inter", tone: "cool", group: "Cool" },
  { id: "berry",     name: "Berry",            primary: "#9D174D", accent: "#FB7185", font: "Inter", tone: "cool", group: "Cool" },

  // Green
  { id: "emerald",   name: "Emerald",        primary: "#059669", accent: "#34D399", font: "Inter", tone: "cool", group: "Green" },
  { id: "forest",    name: "Forest Pine",    primary: "#166534", accent: "#4ADE80", font: "Inter", tone: "cool", group: "Green" },
  { id: "teal",      name: "Deep Teal",      primary: "#0D9488", accent: "#5EEAD4", font: "Inter", tone: "cool", group: "Green" },
  { id: "moss",      name: "Moss Green",     primary: "#4D7C0F", accent: "#A3E635", font: "Inter", tone: "cool", group: "Green" },
  { id: "mint",      name: "Fresh Mint",     primary: "#10B981", accent: "#6EE7B7", font: "Inter", tone: "cool", group: "Green" },
  { id: "sage",      name: "Sage",           primary: "#3F6212", accent: "#84CC16", font: "Inter", tone: "cool", group: "Green" },
  { id: "lime",      name: "Lime",            primary: "#65A30D", accent: "#D9F99D", font: "Inter", tone: "cool", group: "Green" },
  { id: "olive",     name: "Olive",           primary: "#3F6212", accent: "#BEF264", font: "Inter", tone: "cool", group: "Green" },
  { id: "fern",      name: "Fern",            primary: "#15803D", accent: "#86EFAC", font: "Inter", tone: "cool", group: "Green" },
  { id: "pine",      name: "Pine",            primary: "#14532D", accent: "#4ADE80", font: "Inter", tone: "cool", group: "Green" },
  { id: "jade",      name: "Jade",            primary: "#047857", accent: "#6EE7B7", font: "Inter", tone: "cool", group: "Green" },
  { id: "aqua",      name: "Aqua",            primary: "#0F766E", accent: "#99F6E4", font: "Inter", tone: "cool", group: "Green" },
  { id: "seafoam",   name: "Seafoam",         primary: "#0D9488", accent: "#99F6E4", font: "Inter", tone: "cool", group: "Green" },
  { id: "basil",     name: "Basil",           primary: "#166534", accent: "#BBF7D0", font: "Inter", tone: "cool", group: "Green" },

  // Warm — reds, oranges & golds
  { id: "coral",     name: "Coral",           primary: "#E11D48", accent: "#FDA4AF", font: "Inter", tone: "warm", group: "Warm" },
  { id: "rose",      name: "Rose",            primary: "#E11D48", accent: "#FECDD3", font: "Inter", tone: "warm", group: "Warm" },
  { id: "crimson",   name: "Crimson",         primary: "#B91C1C", accent: "#FCA5A5", font: "Inter", tone: "warm", group: "Warm" },
  { id: "ruby",      name: "Ruby",            primary: "#991B1B", accent: "#F87171", font: "Inter", tone: "warm", group: "Warm" },
  { id: "orange",    name: "Burnt Orange",    primary: "#C2410C", accent: "#FDBA74", font: "Inter", tone: "warm", group: "Warm" },
  { id: "amber",     name: "Amber",           primary: "#B45309", accent: "#FCD34D", font: "Inter", tone: "warm", group: "Warm" },
  { id: "gold",      name: "Gold",            primary: "#A16207", accent: "#FDE68A", font: "Inter", tone: "warm", group: "Warm" },
  { id: "terracotta",name: "Terracotta",      primary: "#9A3412", accent: "#FDBA74", font: "Inter", tone: "warm", group: "Warm" },

  // Gradient
  { id: "aurora",    name: "Aurora",         primary: "#6366F1", accent: "#06B6D4", font: "Inter", tone: "cool", group: "Gradient",
    stops: ["#4F46E5", "#7C3AED", "#06B6D4"] },
  { id: "orchid",    name: "Orchid Bloom",   primary: "#C026D3", accent: "#F0ABFC", font: "Inter", tone: "cool", group: "Gradient",
    stops: ["#7C3AED", "#C026D3", "#F0ABFC"] },
  { id: "lagoon",    name: "Tropical Lagoon",primary: "#0D9488", accent: "#5EEAD4", font: "Inter", tone: "cool", group: "Gradient",
    stops: ["#0F766E", "#0D9488", "#5EEAD4"] },
  { id: "meadow",    name: "Meadow",         primary: "#16A34A", accent: "#BEF264", font: "Inter", tone: "cool", group: "Gradient",
    stops: ["#065F46", "#16A34A", "#BEF264"] },
  { id: "deep-ocean",name: "Deep Ocean",     primary: "#0369A1", accent: "#22D3EE", font: "Inter", tone: "cool", group: "Gradient",
    stops: ["#0F172A", "#0369A1", "#22D3EE"] },
  { id: "sunset",    name: "Sunset",          primary: "#EA580C", accent: "#FBBF24", font: "Inter", tone: "warm", group: "Gradient",
    stops: ["#9F1239", "#EA580C", "#FBBF24"] },
  { id: "firefly",   name: "Firefly",         primary: "#65A30D", accent: "#FACC15", font: "Inter", tone: "warm", group: "Gradient",
    stops: ["#14532D", "#65A30D", "#FACC15"] },
  { id: "rosewater", name: "Rosewater",       primary: "#DB2777", accent: "#FDBA74", font: "Inter", tone: "warm", group: "Gradient",
    stops: ["#831843", "#DB2777", "#FDBA74"] },
  { id: "iceberg",   name: "Iceberg",         primary: "#0284C7", accent: "#CFFAFE", font: "Inter", tone: "cool", group: "Gradient",
    stops: ["#164E63", "#0284C7", "#CFFAFE"] },
  { id: "grape-soda",name: "Grape Soda",      primary: "#7E22CE", accent: "#F0ABFC", font: "Inter", tone: "cool", group: "Gradient",
    stops: ["#312E81", "#7E22CE", "#F0ABFC"] },
  { id: "citrus",    name: "Citrus",          primary: "#16A34A", accent: "#FDE047", font: "Inter", tone: "warm", group: "Gradient",
    stops: ["#166534", "#16A34A", "#FDE047"] },
  { id: "twilight",  name: "Twilight",        primary: "#4F46E5", accent: "#F472B6", font: "Inter", tone: "cool", group: "Gradient",
    stops: ["#172554", "#4F46E5", "#F472B6"] },
  { id: "nebula",    name: "Nebula",          primary: "#7C3AED", accent: "#38BDF8", font: "Inter", tone: "cool", group: "Gradient",
    stops: ["#111827", "#7C3AED", "#38BDF8"] },
  { id: "prism",     name: "Prism",           primary: "#2563EB", accent: "#F43F5E", font: "Inter", tone: "cool", group: "Gradient",
    stops: ["#2563EB", "#8B5CF6", "#F43F5E"] },
  { id: "blue-hour", name: "Blue Hour",       primary: "#1D4ED8", accent: "#A78BFA", font: "Inter", tone: "cool", group: "Gradient",
    stops: ["#172554", "#1D4ED8", "#A78BFA"] },
  { id: "ocean-sunrise", name: "Ocean Sunrise", primary: "#0EA5E9", accent: "#F59E0B", font: "Inter", tone: "cool", group: "Gradient",
    stops: ["#164E63", "#0EA5E9", "#F59E0B"] },
  { id: "lavender-mist", name: "Lavender Mist", primary: "#8B5CF6", accent: "#F9A8D4", font: "Inter", tone: "cool", group: "Gradient",
    stops: ["#4338CA", "#A78BFA", "#F9A8D4"] },
  { id: "arctic-lime", name: "Arctic Lime",     primary: "#06B6D4", accent: "#A3E635", font: "Inter", tone: "cool", group: "Gradient",
    stops: ["#0E7490", "#06B6D4", "#A3E635"] },
  { id: "emerald-sky", name: "Emerald Sky",     primary: "#10B981", accent: "#60A5FA", font: "Inter", tone: "cool", group: "Gradient",
    stops: ["#065F46", "#10B981", "#60A5FA"] },
  { id: "midnight-rose", name: "Midnight Rose",  primary: "#E11D48", accent: "#818CF8", font: "Inter", tone: "cool", group: "Gradient",
    stops: ["#1E1B4B", "#BE185D", "#818CF8"] },
  { id: "solar-flare", name: "Solar Flare",      primary: "#F97316", accent: "#FDE047", font: "Inter", tone: "warm", group: "Gradient",
    stops: ["#9A3412", "#F97316", "#FDE047"] },
  { id: "plum-fire", name: "Plum Fire",         primary: "#C026D3", accent: "#FB923C", font: "Inter", tone: "warm", group: "Gradient",
    stops: ["#581C87", "#C026D3", "#FB923C"] },
  { id: "blue-horizon", name: "Blue Horizon",    primary: "#0284C7", accent: "#34D399", font: "Inter", tone: "cool", group: "Gradient",
    stops: ["#0C4A6E", "#0284C7", "#34D399"] },
  { id: "mint-sunset", name: "Mint Sunset",      primary: "#14B8A6", accent: "#FB7185", font: "Inter", tone: "cool", group: "Gradient",
    stops: ["#115E59", "#14B8A6", "#FB7185"] },
  { id: "electric-violet", name: "Electric Violet", primary: "#4F46E5", accent: "#E879F9", font: "Inter", tone: "cool", group: "Gradient",
    stops: ["#312E81", "#4F46E5", "#E879F9"] },
  { id: "moonlit",   name: "Moonlit",           primary: "#64748B", accent: "#C4B5FD", font: "Inter", tone: "cool", group: "Gradient",
    stops: ["#0F172A", "#475569", "#C4B5FD"] },
  { id: "candy-sky", name: "Candy Sky",         primary: "#38BDF8", accent: "#F0ABFC", font: "Inter", tone: "cool", group: "Gradient",
    stops: ["#0369A1", "#38BDF8", "#F0ABFC"] },
  { id: "volcanic",  name: "Volcanic",          primary: "#DC2626", accent: "#F59E0B", font: "Inter", tone: "warm", group: "Gradient",
    stops: ["#450A0A", "#DC2626", "#F59E0B"] },
  { id: "rainforest", name: "Rainforest",       primary: "#15803D", accent: "#22D3EE", font: "Inter", tone: "cool", group: "Gradient",
    stops: ["#052E16", "#15803D", "#22D3EE"] },
  { id: "copper-night", name: "Copper Night",   primary: "#B45309", accent: "#A78BFA", font: "Inter", tone: "warm", group: "Gradient",
    stops: ["#1C1917", "#B45309", "#A78BFA"] },
  { id: "bluebell",  name: "Bluebell",          primary: "#6366F1", accent: "#67E8F9", font: "Inter", tone: "cool", group: "Gradient",
    stops: ["#3730A3", "#6366F1", "#67E8F9"] },
  { id: "peach-orchid", name: "Peach Orchid",   primary: "#DB2777", accent: "#FDBA74", font: "Inter", tone: "warm", group: "Gradient",
    stops: ["#9D174D", "#DB2777", "#FDBA74"] },

  // Neutral — restrained accents for a quiet workspace
  { id: "pearl",     name: "Pearl White",      primary: "#E5E7EB", accent: "#FFFFFF", font: "Inter", tone: "cool", group: "Neutral", primaryForeground: "#111827" },
  { id: "graphite",  name: "Graphite",         primary: "#374151", accent: "#9CA3AF", font: "Inter", tone: "cool", group: "Neutral" },
];

export const DEFAULT_BRAND_ID = "lagoon";


const WARM_LIGHT = { bg: "#f8f4f0", sidebar: "#f3ede8", card: "#ffffff", muted: "#eee7e1", accent: "#e8ddd4", border: "#d8cec6", fg: "#201b22", mutedFg: "#6f6670" };
const COOL_LIGHT = { bg: "#f4f7fb", sidebar: "#eef2f7", card: "#ffffff", muted: "#e8edf4", accent: "#dde5ee", border: "#ced8e5", fg: "#172132", mutedFg: "#617086" };
const WARM_DARK  = { bg: "#171310", sidebar: "#1b1611", card: "#201a15", muted: "#241d16", accent: "#2f2519", border: "#322619", fg: "#f5ecdc", mutedFg: "#b3a48d" };
const COOL_DARK  = { bg: "#070a12", sidebar: "#0b1018", card: "#111827", muted: "#161f2e", accent: "#1e293b", border: "#2a3648", fg: "#f1f5f9", mutedFg: "#9aa8bd" };

const STORAGE_KEY = "admin-brand";
const STYLE_ID = "brand-theme-vars";

export function gradientCss(b: Brand): string {
  const stops = b.stops ?? [b.primary, b.accent];
  return `linear-gradient(135deg, ${stops.join(", ")})`;
}

function buildCss(b: Brand): string {
  const p = b.primary;
  const grad = gradientCss(b);
  const font = `"${b.font}", ui-sans-serif, system-ui, sans-serif`;
  // Brand choices are accents only; the workspace surfaces keep the Govern OS palette.
  const L = COOL_LIGHT;
  const D = COOL_DARK;
  const stops = b.stops ?? [b.primary, b.primary, b.primary];

  const light = `
    --primary:${p}; --ring:${p}; --sidebar-primary:${p}; --sidebar-ring:${p}; --chart-1:${p}; --chart-fill:${b.stops ? "url(#dashboard-brand-gradient)" : p};
    --brand-stop-1:${stops[0]}; --brand-stop-2:${stops[1]}; --brand-stop-3:${stops[2]};
    --primary-foreground:${b.primaryForeground ?? "#ffffff"};
    --background:${L.bg}; --card:${L.card}; --card-foreground:${L.fg}; --popover:${L.card}; --popover-foreground:${L.fg};
    --sidebar:${L.sidebar}; --sidebar-accent:color-mix(in oklab, ${p} 12%, ${L.accent});
    --sidebar-border:${L.border}; --sidebar-foreground:${L.fg}; --sidebar-accent-foreground:${L.fg};
    --muted:${L.muted}; --accent:color-mix(in oklab, ${p} 10%, ${L.accent}); --accent-foreground:${L.fg};
    --secondary:${L.muted}; --secondary-foreground:${L.fg}; --border:${L.border}; --input:${L.border};
    --foreground:${L.fg}; --muted-foreground:${L.mutedFg};
    --gradient-brand: ${grad};
    --gradient-surface: linear-gradient(180deg, ${L.card}, ${L.sidebar});
    --shadow-elegant: 0 12px 40px -12px color-mix(in oklab, ${p} 16%, transparent);
    --font-sans: ${font};
  `;

  const dark = `
    --primary:${p}; --ring:${p}; --sidebar-primary:${p}; --sidebar-ring:${p}; --chart-1:${p}; --chart-fill:${b.stops ? "url(#dashboard-brand-gradient)" : p};
    --brand-stop-1:${stops[0]}; --brand-stop-2:${stops[1]}; --brand-stop-3:${stops[2]};
    --primary-foreground:${b.primaryForeground ?? "#ffffff"};
    --background:${D.bg}; --card:${D.card}; --card-foreground:${D.fg}; --popover:${D.card}; --popover-foreground:${D.fg};
    --sidebar:${D.sidebar}; --sidebar-accent:color-mix(in oklab, ${p} 15%, ${D.accent});
    --sidebar-border:${D.border};
    --sidebar-foreground: ${D.fg};
    --sidebar-accent-foreground: #ffffff;
    --muted:${D.muted}; --accent:color-mix(in oklab, ${p} 16%, ${D.accent}); --accent-foreground:${D.fg};
    --secondary:${D.muted}; --secondary-foreground:${D.fg}; --border:${D.border}; --input:${D.border};
    --foreground: ${D.fg};
    --muted-foreground:${D.mutedFg};
    --gradient-brand: ${grad};
    --gradient-surface: linear-gradient(180deg, ${D.card}, ${D.bg});
    --shadow-elegant: 0 12px 40px -12px rgba(0,0,0,0.6);
    --font-sans: ${font};
  `;

  return `:root{${light}} .dark{${dark}} body{font-family:var(--font-sans);}`;
}

export function applyBrand(brand: Brand) {
  let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement("style");
    el.id = STYLE_ID;
    document.head.appendChild(el);
  }
  el.textContent = buildCss(brand);
  document.documentElement.classList.toggle("brand-gradient", Boolean(brand.stops));
}

export function BrandSwitcher() {
  const [activeId, setActiveId] = useState<string>(DEFAULT_BRAND_ID);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) ?? DEFAULT_BRAND_ID;
    const brand = BRANDS.find((b) => b.id === saved) ?? BRANDS.find((b) => b.id === DEFAULT_BRAND_ID) ?? BRANDS[0];
    setActiveId(brand.id);
    applyBrand(brand);
  }, []);

  const pick = (brand: Brand) => {
    setActiveId(brand.id);
    applyBrand(brand);
    localStorage.setItem(STORAGE_KEY, brand.id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground"
          aria-label="Change brand theme"
        >
          <PaletteIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 max-h-[70vh] overflow-y-auto">
        {(["Gradient", "Cool", "Green", "Warm", "Neutral"] as const).map((group, gi) => (
          <div key={group}>
            {gi > 0 && <DropdownMenuSeparator />}
            <DropdownMenuLabel className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {group}
            </DropdownMenuLabel>
            {BRANDS.filter((b) => b.group === group).map((b) => (
              <DropdownMenuItem
                key={b.id}
                onClick={() => pick(b)}
                className="flex items-center gap-2.5 py-2 cursor-pointer"
                style={{ fontFamily: `"${b.font}", sans-serif` }}
              >
                <span
                  className="h-6 w-6 rounded-md border border-border/70 shrink-0"
                  style={{ background: gradientCss(b) }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm leading-tight truncate">{b.name}</div>
                  <div className="text-[10px] text-muted-foreground truncate">Aa · {b.font}</div>
                </div>
                {activeId === b.id && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
              </DropdownMenuItem>
            ))}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
