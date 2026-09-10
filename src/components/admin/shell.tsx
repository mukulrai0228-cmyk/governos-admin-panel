import { useState, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function AdminShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <div data-governos-shell className="min-h-screen text-foreground">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onToggleCollapsed={() => setCollapsed((value) => !value)}
      />
      <div className={collapsed ? "lg:pl-[92px] lg:pr-3 lg:py-3 transition-[padding] duration-300" : "lg:pl-[280px] lg:pr-3 lg:py-3 transition-[padding] duration-300"}>
        <section data-governos-workspace>
          <Topbar onOpenMenu={() => setMobileOpen(true)} />
          <main key={pathname} className="governos-route min-w-0 w-full px-4 py-6 sm:px-6 lg:px-10 lg:py-8">{children}</main>
        </section>
      </div>
    </div>
  );
}
