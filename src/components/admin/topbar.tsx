import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { BellIcon } from "@/components/ui/bell";
import { LogoutIcon } from "@/components/ui/logout";
import { MenuIcon } from "@/components/ui/menu";
import { SearchIcon } from "@/components/ui/search";
import { SettingsIcon } from "@/components/ui/settings";
import { UserIcon } from "@/components/ui/user";
import { BellOff, ChevronDown } from "lucide-react";
import { AppearanceMenu } from "./appearance-menu";
import { clearAuthentication } from "@/lib/auth";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ADMIN_AVATAR = "/profiles/frame-12.jpg";

export function Topbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const navigate = useNavigate();

  function handleSignOut() {
    clearAuthentication();
    void navigate({ to: "/login" });
  }

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
            className="h-9 rounded-xl border-border/60 bg-card/50 pl-9 pr-3 text-sm placeholder:text-muted-foreground/70"
          />
        </div>

        <div className="flex-1" />

        <AppearanceMenu />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9 text-muted-foreground" aria-label="Notifications">
              <BellIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 p-5">
            <div className="flex flex-col items-center gap-2 py-3 text-center">
              <BellOff className="h-7 w-7 text-muted-foreground/70" />
              <p className="text-sm font-medium text-foreground">No new notifications</p>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="inline-flex h-9 items-center gap-1 rounded-full px-0.5 text-primary hover:ring-2 hover:ring-primary/20" aria-label="Open profile menu">
              <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-xs font-semibold">
              <img src={ADMIN_AVATAR} alt="" className="h-full w-full object-cover" />
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>
              <div className="flex items-center gap-2">
                <img src={ADMIN_AVATAR} alt="" className="h-8 w-8 rounded-full border border-border object-cover" />
                <span>Faisal Al-Otaibi</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem><UserIcon className="mr-2 h-4 w-4" />Profile</DropdownMenuItem>
            <DropdownMenuItem><SettingsIcon className="mr-2 h-4 w-4" />Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onSelect={handleSignOut}><LogoutIcon className="mr-2 h-4 w-4" />Sign out</DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
