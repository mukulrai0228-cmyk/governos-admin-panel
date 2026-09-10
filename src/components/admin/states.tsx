import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Inbox, Loader2, ShieldOff, ChevronRight, ThumbsUp, ThumbsDown, ExternalLink, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

/* --------------------------------- Breadcrumb -------------------------------- */
export function Breadcrumb({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav className="text-xs text-muted-foreground mb-1 flex items-center gap-1 flex-wrap">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-3 w-3 opacity-60" />}
          {it.to ? (
            <Link to={it.to} className="hover:text-foreground">{it.label}</Link>
          ) : (
            <span className="text-foreground/80">{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

/* --------------------------------- PageHeader -------------------------------- */
export function PageHeader({
  breadcrumbs,
  title,
  actions,
  description,
}: {
  breadcrumbs?: { label: string; to?: string }[];
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="min-w-0">
        {breadcrumbs && <Breadcrumb items={breadcrumbs} />}
        <h1 className="text-lg font-semibold tracking-tight text-foreground">{title}</h1>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

/* -------------------------------- Sub-nav pills ------------------------------ */
export function SubNav({ items }: { items: { to: string; label: string; badge?: string | number }[] }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="mb-6 flex flex-wrap items-center gap-1 rounded-lg bg-muted/40 p-1 w-fit">
      {items.map((it) => {
        const active = pathname === it.to;
        return (
          <Link
            key={it.to}
            to={it.to}
            className={cn(
              "text-xs px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5",
              active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {it.label}
            {it.badge !== undefined && (
              <span className={cn("rounded-full px-1.5 text-[10px] tabular-nums", active ? "bg-primary/10 text-primary" : "bg-muted-foreground/10")}>
                {it.badge}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}

/* ---------------------------------- Badges ----------------------------------- */
export function LifecycleBadge({ status }: { status: "Draft" | "In Review" | "Published" | "Archived" }) {
  const tone =
    status === "Published" ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
    : status === "In Review" ? "bg-amber-500/10 text-amber-700 border-amber-500/20"
    : status === "Archived" ? "bg-stone-500/10 text-stone-600 border-stone-500/20"
    : "bg-muted text-muted-foreground border-border";
  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${tone}`}>{status}</span>;
}

export function StaleBadge({ days }: { days: number }) {
  if (days <= 90) {
    return <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-700"><Clock className="h-3 w-3" />Fresh</span>;
  }
  return <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 text-[11px] font-medium text-rose-700"><AlertCircle className="h-3 w-3" />Stale · {days}d</span>;
}

export function PermissionBadge({ role }: { role: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-primary/20 bg-primary/5 px-2 py-0.5 text-[10px] font-medium text-primary uppercase tracking-wider">
      <ShieldOff className="h-3 w-3 rotate-180" />{role}
    </span>
  );
}

export function FreshnessIndicator({ updatedDaysAgo }: { updatedDaysAgo: number }) {
  const fresh = updatedDaysAgo <= 30;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium", fresh ? "bg-emerald-500/10 text-emerald-700" : "bg-amber-500/10 text-amber-700")}>
      <Clock className="h-3 w-3" />Updated {updatedDaysAgo}d ago
    </span>
  );
}

export function CitationChip({ n, title, sku }: { n: number; title: string; sku?: string }) {
  return (
    <button className="inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-card px-2 py-1 text-[11px] hover:border-primary/40 transition-colors">
      <span className="h-4 w-4 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[9px] font-semibold">{n}</span>
      <span className="font-medium max-w-[16ch] truncate">{title}</span>
      {sku && <span className="text-muted-foreground font-mono">{sku}</span>}
      <ExternalLink className="h-3 w-3 text-muted-foreground" />
    </button>
  );
}

export function FeedbackButtons() {
  return (
    <div className="mt-2 flex items-center gap-1">
      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-emerald-600"><ThumbsUp className="h-3.5 w-3.5" /></Button>
      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-rose-600"><ThumbsDown className="h-3.5 w-3.5" /></Button>
    </div>
  );
}

/* -------------------------------- Empty / Loading ---------------------------- */
export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
}: {
  icon?: typeof Inbox;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <Card className="p-14 flex flex-col items-center justify-center text-center border-dashed border-2 border-border/60 bg-muted/20 rounded-xl shadow-none">
      <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mt-2 max-w-md">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </Card>
  );
}

export function LoadingSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 rounded-lg bg-muted/40 animate-pulse" style={{ opacity: 1 - i * 0.08 }} />
      ))}
    </div>
  );
}

export function InlineLoader({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" />{label}
    </div>
  );
}

/* --------------------------------- Validation -------------------------------- */
export function ValidationSummary({ errors }: { errors: string[] }) {
  if (errors.length === 0) return null;
  return (
    <div className="mb-5 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-destructive">
        <AlertCircle className="h-4 w-4" />Please fix {errors.length} issue{errors.length > 1 ? "s" : ""} before continuing
      </div>
      <ul className="mt-2 space-y-1 pl-6 text-sm text-destructive/90 list-disc">
        {errors.map((e) => <li key={e}>{e}</li>)}
      </ul>
    </div>
  );
}

/* -------------------------------- Confirmation ------------------------------- */
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = "Confirm",
  destructive,
  onConfirm,
}: {
  trigger: ReactNode;
  title: string;
  description: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm?: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={destructive ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}