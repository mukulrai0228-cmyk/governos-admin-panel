import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BellIcon } from "@/components/ui/bell";
import { LogoutIcon } from "@/components/ui/logout";
import { MenuIcon } from "@/components/ui/menu";
import { SearchIcon } from "@/components/ui/search";
import { SettingsIcon } from "@/components/ui/settings";
import { UserIcon } from "@/components/ui/user";
import { AppearanceMenu } from "./appearance-menu";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Topbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <header data-governos-panel data-governos-topbar className="sticky top-0 z-30 h-16 border-b border-border/70 bg-background/55 backdrop-blur-2xl">
      <div className="flex h-full items-center gap-3 px-4 lg:px-5">
        <Button
          variant="ghost"
          size="icon"
          className="-ml-2 h-9 w-9 shrink-0 lg:hidden"
          onClick={onOpenMenu}
          aria-label="Open navigation"
        >
          <MenuIcon className="h-4 w-4" />
        </Button>
        <div className="flex-1 max-w-2xl relative">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search employees, positions or entities…"
            className="h-9 rounded-xl border-border/60 bg-card/50 pl-9 pr-14 text-sm placeholder:text-muted-foreground/70"
          />
          <kbd className="hidden lg:inline-flex absolute right-3 top-1/2 -translate-y-1/2 items-center gap-0.5 rounded border border-border/70 bg-muted/50 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
            ⌘K
          </kbd>
        </div>

        <div className="flex-1" />

        <AppearanceMenu />

        <Button variant="ghost" size="icon" className="relative h-9 w-9 text-muted-foreground">
          <BellIcon className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-primary" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold hover:ring-2 hover:ring-primary/20">
              FA
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>Faisal Al-Otaibi</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem><UserIcon className="mr-2 h-4 w-4" />Profile</DropdownMenuItem>
            <DropdownMenuItem><SettingsIcon className="mr-2 h-4 w-4" />Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive"><LogoutIcon className="mr-2 h-4 w-4" />Sign out</DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
