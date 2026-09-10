import type { ReactNode } from "react";
import logo from "@/assets/governors-logo.svg";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <div className="hidden lg:flex flex-1 bg-primary/5 border-r border-border/60 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.15),transparent_60%),radial-gradient(circle_at_80%_60%,hsl(var(--primary)/0.08),transparent_60%)]" />
        <div className="relative z-10 p-12 flex flex-col justify-between w-full">
          <div className="flex items-center">
            <img src={logo} alt="Govern OS" className="h-10 w-auto" />
          </div>
          <div className="max-w-md">
            <h2 className="text-3xl font-semibold tracking-tight leading-tight">
              One source of truth for every product decision.
            </h2>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              BOS centralizes product knowledge, competitor intel, and sales
              enablement — powered by AI, built for R&amp;D, Sales and Management.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {["15K+ SKUs", "3.2K Competitors", "1.3K AI Queries/day"].map((s) => (
                <div key={s} className="rounded-lg border border-border/60 bg-card/60 backdrop-blur px-3 py-2 text-[11px] text-muted-foreground">
                  {s}
                </div>
              ))}
            </div>
          </div>
          <div className="text-[11px] text-muted-foreground">© Bakemate. All rights reserved.</div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8 flex items-center gap-3">
            <img src={logo} alt="Govern OS" className="h-8 w-auto" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>}
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-sm text-muted-foreground text-center">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
