import { Link, useRouterState } from "@tanstack/react-router";
import { useRef } from "react";
import type { ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";
import containerLogo from "@/assets/governos-container-logo.svg";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BriefcaseBusinessIcon } from "@/components/ui/briefcase-business";
import { ChevronLeftIcon } from "@/components/ui/chevron-left";
import { ChevronRightIcon } from "@/components/ui/chevron-right";
import { LayoutGridIcon } from "@/components/ui/layout-grid";
import { LayersIcon } from "@/components/ui/layers";
import { LogoutIcon } from "@/components/ui/logout";
import { UsersIcon } from "@/components/ui/users";
import { WorkflowIcon } from "@/components/ui/workflow";
import { XIcon } from "@/components/ui/x";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type AnimatedIconHandle = { startAnimation: () => void; stopAnimation: () => void };
type AnimatedIcon = ForwardRefExoticComponent<HTMLAttributes<HTMLDivElement> & { size?: number } & RefAttributes<AnimatedIconHandle>>;
type NavChild = { to: string; label: string; icon: AnimatedIcon };
type NavItem = { to: string; label: string; icon: AnimatedIcon; badge?: string; children?: NavChild[] };

const groups: { title: string; items: NavItem[] }[] = [
  {
    title: "Workspace",
    items: [
      { to: "/", label: "Dashboard", icon: LayoutGridIcon },
      {
        to: "/organization",
        label: "Organization",
        icon: LayersIcon,
        children: [
          { to: "/organization/employees", label: "Employees", icon: UsersIcon },
          { to: "/organization/roles", label: "Positions", icon: BriefcaseBusinessIcon },
          { to: "/organization/structure", label: "Structure", icon: WorkflowIcon },
        ],
      },
    ],
  },
];


type SidebarProps = {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onToggleCollapsed: () => void;
};

export function Sidebar({ collapsed, mobileOpen, onCloseMobile, onToggleCollapsed }: SidebarProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const iconRefs = useRef<Record<string, AnimatedIconHandle | null>>({});

  const animateIcon = (key: string, active: boolean) => {
    const icon = iconRefs.current[key];
    if (active) icon?.startAnimation();
    else icon?.stopAnimation();
  };

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-[2px] lg:hidden"
          onClick={onCloseMobile}
          aria-label="Close navigation"
        />
      )}
      <aside
        data-governos-sidebar
        className={cn(
          "group/sidebar fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar/80 text-sidebar-foreground shadow-[18px_0_60px_oklch(0.06_0.03_265_/_0.18)] backdrop-blur-2xl transition-[width,transform] duration-300 ease-out lg:inset-y-3 lg:left-3 lg:rounded-[28px] lg:border",
          collapsed && "lg:w-[76px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
      <div className={cn("relative flex h-16 shrink-0 items-center justify-center border-b border-sidebar-border/70 px-5", collapsed && "lg:justify-center lg:px-3")}>
        <div className={cn("flex justify-center overflow-hidden transition-[width] duration-300", collapsed ? "lg:h-10 lg:w-10" : "w-[146px]")}>
          {collapsed ? (
            <svg viewBox="0 0 42 47" role="img" aria-label="AAA" className="h-10 w-10 shrink-0 brightness-0 dark:brightness-100">
              <image href={containerLogo} width="157" height="47" preserveAspectRatio="none" />
            </svg>
          ) : (
            <img src={containerLogo} alt="Govern OS" className="h-11 w-[146px] max-w-none object-contain object-center brightness-0 dark:brightness-100" />
          )}
        </div>
        <Button variant="ghost" size="icon" className="absolute right-3 hidden h-8 w-8 lg:flex" onClick={onToggleCollapsed} aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}>
          {collapsed ? <ChevronRightIcon className="h-4 w-4" /> : <ChevronLeftIcon className="h-4 w-4" />}
        </Button>
        <Button variant="ghost" size="icon" className="absolute right-3 h-8 w-8 lg:hidden" onClick={onCloseMobile} aria-label="Close navigation">
          <XIcon className="h-4 w-4" />
        </Button>
      </div>

      <TooltipProvider delayDuration={150}>
      <nav className="flex-1 overflow-visible px-3 py-5">
        {groups.map((group) => (
          <div key={group.title} className="mb-5">
            <div className={cn("px-3 pb-2 text-[10px] uppercase tracking-[0.22em] text-sidebar-foreground/45 font-medium transition-opacity", collapsed && "lg:h-2 lg:overflow-hidden lg:p-0 lg:opacity-0")}>
              {group.title}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active =
                  item.to === "/"
                    ? pathname === "/"
                    : pathname === item.to || pathname.startsWith(item.to + "/");
                const Icon = item.icon;
                return (
                  <div key={item.to} className="group/item relative">
                    <Tooltip>
                      <TooltipTrigger asChild>
                      <Link
                      to={item.to}
                      onClick={onCloseMobile}
                      onMouseEnter={() => animateIcon(item.to, true)}
                      onMouseLeave={() => animateIcon(item.to, false)}
                      className={cn(
                        "sidebar-nav-item group flex h-10 items-center gap-3 rounded-md px-3 text-sm transition-colors relative",
                        collapsed && "lg:justify-center lg:px-0",
                        active
                          ? "sidebar-nav-active bg-primary text-primary-foreground font-medium shadow-sm"
                          : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                      )}
                    >
                      <Icon ref={(node) => { iconRefs.current[item.to] = node; }} className="sidebar-nav-icon h-4 w-4 opacity-90" />
                      <span className={cn("flex-1 whitespace-nowrap transition-opacity", collapsed && "lg:hidden")}>{item.label}</span>
                      {item.badge && (
                        <span
                          className={cn(
                            "text-[10px] tabular-nums px-1.5 py-0.5 rounded",
                            active
                              ? "bg-primary-foreground/20 text-primary-foreground"
                              : "bg-sidebar-accent/70 text-sidebar-foreground/60",
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                      </TooltipTrigger>
                      {collapsed && <TooltipContent side="right" className="hidden lg:block">{item.label}</TooltipContent>}
                    </Tooltip>
                    {item.children && active && !collapsed && (
                      <div className="mt-3 mb-1 ml-5 space-y-0.5 border-l border-sidebar-border/70 pl-3">
                        {item.children.map((child) => {
                          const childActive = pathname === child.to || pathname.startsWith(child.to + "/");
                          return (
                            <Link
                              key={child.to}
                              to={child.to}
                              onClick={onCloseMobile}
                              onMouseEnter={() => animateIcon(child.to, true)}
                              onMouseLeave={() => animateIcon(child.to, false)}
                              className={cn(
                                "flex h-10 items-center gap-3 rounded-md px-3 text-sm transition-colors",
                                childActive
                                  ? "text-primary font-medium bg-primary/10"
                                  : "text-sidebar-foreground/65 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                              )}
                            >
                              <child.icon ref={(node) => { iconRefs.current[child.to] = node; }} className="h-4 w-4 shrink-0" />
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                    {item.children && collapsed && (
                      <div className="invisible absolute left-[calc(100%+12px)] top-0 z-50 hidden w-52 translate-x-1 rounded-lg border border-border bg-popover p-2 text-popover-foreground opacity-0 shadow-xl transition-all group-hover/item:visible group-hover/item:translate-x-0 group-hover/item:opacity-100 group-focus-within/item:visible group-focus-within/item:translate-x-0 group-focus-within/item:opacity-100 lg:block">
                        <div className="px-2 pb-2 pt-1 text-xs font-semibold">Organization</div>
                        {item.children.map((child) => {
                          const childActive = pathname === child.to || pathname.startsWith(child.to + "/");
                          return (
                            <Link key={child.to} to={child.to} className={cn("flex items-center gap-2.5 rounded-md px-2 py-2 text-sm hover:bg-accent", childActive && "bg-accent font-medium text-primary")}>
                              <child.icon className="h-4 w-4" />{child.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      </TooltipProvider>

      <div className="border-t border-sidebar-border/70 p-3">
        <div className={cn("flex items-center gap-3 rounded-md border border-sidebar-border/70 bg-sidebar-accent/35 p-2", collapsed && "lg:justify-center lg:border-transparent lg:bg-transparent lg:p-0")}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/12 text-xs font-semibold text-primary">FA</div>
          <div className={cn("min-w-0 flex-1", collapsed && "lg:hidden")}>
            <div className="truncate text-xs font-semibold">Faisal Al-Otaibi</div>
            <div className="truncate text-[10px] text-sidebar-foreground/55">Administrator</div>
          </div>
          <Button variant="ghost" size="icon" className={cn("h-8 w-8 shrink-0 text-sidebar-foreground/55", collapsed && "lg:hidden")} aria-label="Sign out">
            <LogoutIcon className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </aside>
    </>
  );
}
