import { createFileRoute, Link } from "@tanstack/react-router";
import type { CSSProperties } from "react";
import { AdminShell } from "@/components/admin/shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  Building2,
  ChevronRight,
  FileWarning,
  Layers,
  ShieldAlert,
  Briefcase,
  UserRoundX,
} from "lucide-react";
import { SparklesIcon } from "@/components/ui/sparkles";
import { UsersIcon } from "@/components/ui/users";
import { cn } from "@/lib/utils";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  COMPANIES,
  DEPARTMENTS,
  EMPLOYEES,
  GOVERNANCE,
  ORG_SUMMARY,
  ROLES,
  companyById,
  departmentById,
  departmentDescendants,
  isVacant,
  positionHolders,
} from "@/lib/org-v2-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Organization Dashboard — Govern OS" },
      { name: "description", content: "Headcount, entities, departments, position vacancies and governance document ownership across the AAA group." },
      { property: "og:title", content: "Organization Dashboard — Govern OS" },
      { property: "og:description", content: "Live view of entities, departments, positions and governance coverage." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

const employeeSearch = { company: undefined, department: undefined, unplaced: false } as const;

const stats = [
  { label: "Employees", value: String(ORG_SUMMARY.employees), sub: "on the group payroll", icon: UsersIcon, tint: "bg-primary/10 text-primary" },
  { label: "Entities", value: String(ORG_SUMMARY.entities), sub: "in the legal ownership tree", icon: Building2, tint: "bg-sky-500/10 text-sky-600 dark:text-sky-400" },
  { label: "Departments", value: String(ORG_SUMMARY.departments), sub: "across all entities", icon: Layers, tint: "bg-teal-500/10 text-teal-600 dark:text-teal-400" },
  { label: "Vacant positions", value: String(ORG_SUMMARY.vacantPositions), sub: `of ${ORG_SUMMARY.positions} budgeted seats`, icon: Briefcase, tint: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  { label: "Unowned documents", value: String(ORG_SUMMARY.unownedDocuments), sub: "waiting on a governance owner", icon: FileWarning, tint: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
];

const headcountByEntity = COMPANIES.map((entity) => ({
  id: entity.id,
  name: entity.name.split(" / ")[0],
  people: EMPLOYEES.filter((employee) => employee.company === entity.id).length,
})).sort((a, b) => b.people - a.people);

const largestDepartments = DEPARTMENTS.filter((department) => !department.parent)
  .map((department) => ({
    department,
    people: departmentDescendants(department.id).reduce((sum, id) => sum + EMPLOYEES.filter((employee) => employee.department === id).length, 0),
  }))
  .sort((a, b) => b.people - a.people)
  .slice(0, 8);

const vacantPositions = ROLES.filter((position) => isVacant(position.id));

const governanceChain = GOVERNANCE.map((body) => {
  const positions = ROLES.filter((position) => position.body === body.id);
  const vacant = positions.filter((position) => isVacant(position.id)).length;
  const holder = positions.map((position) => positionHolders(position.id)[0]).find(Boolean);
  return { body, positions: positions.length, vacant, holder };
});

const unplacedByEntity = COMPANIES.map((entity) => ({
  entity,
  count: EMPLOYEES.filter((employee) => employee.company === entity.id && !employee.department).length,
})).filter((item) => item.count > 0);

function Dashboard() {
  const maxHeadcount = headcountByEntity[0]?.people ?? 1;
  const chartMax = Math.ceil(maxHeadcount / 45) * 45;

  return (
    <AdminShell>
      <div className="governos-enter mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">Dashboard</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">People, positions and governance coverage across the AAA group.</p>
        </div>
        <Button size="sm" className="h-9 gap-2 rounded-lg">
          <SparklesIcon className="h-4 w-4" />
          Ask AI
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label} className="governos-stat-card rounded-xl border-border/70 bg-card p-5 shadow-none" style={{ "--enter-delay": `${80 + stats.indexOf(item) * 65}ms` } as CSSProperties}>
              <div className="flex items-start justify-between">
                <div className="text-sm text-muted-foreground">{item.label}</div>
                <div className={`flex h-9 w-9 items-center justify-center rounded-full ${item.tint}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{item.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{item.sub}</div>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 grid items-start grid-cols-1 gap-5 xl:grid-cols-3">
        <Card className="governos-enter dashboard-chart rounded-xl border-border/70 bg-card p-6 shadow-none xl:col-span-2" style={{ "--enter-delay": "430ms" } as CSSProperties}>
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h2 className="text-foreground text-lg font-semibold tracking-tight">Headcount by entity</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">Where the {ORG_SUMMARY.employees} employees are legally employed</p>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              Live org data
            </div>
          </div>
          <div className="h-[23rem]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={headcountByEntity} layout="vertical" margin={{ left: 4, right: 28, top: 8, bottom: 4 }} barCategoryGap="22%">
                <defs>
                  <linearGradient id="dashboard-brand-gradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="var(--brand-stop-1)" />
                    <stop offset="52%" stopColor="var(--brand-stop-2)" />
                    <stop offset="100%" stopColor="var(--brand-stop-3)" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, chartMax]} allowDecimals={false} stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} tickCount={5} />
                <YAxis type="category" dataKey="name" width={132} stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} tick={{ dx: -4 }} />
                <Tooltip
                  cursor={{ fill: "var(--color-primary)", opacity: 0.06 }}
                  contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 10, boxShadow: "0 12px 30px color-mix(in oklab, var(--color-foreground) 14%, transparent)", color: "var(--color-popover-foreground)", fontSize: 12 }}
                  labelStyle={{ color: "var(--color-popover-foreground)", fontWeight: 600 }}
                  itemStyle={{ color: "var(--color-muted-foreground)" }}
                  formatter={(value) => [`${value} employees`, "Headcount"]}
                />
                <Bar dataKey="people" radius={[0, 7, 7, 0]} barSize={22} animationBegin={140} animationDuration={900} animationEasing="ease-out">
                  {headcountByEntity.map((entry) => (
                    <Cell key={entry.id} fill={entry.people ? "var(--chart-fill)" : "var(--color-border)"} fillOpacity={entry.people ? 0.95 : 0.45} />
                  ))}
                  <LabelList dataKey="people" position="right" offset={8} fill="var(--color-foreground)" fontSize={11} fontWeight={600} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="governos-enter dashboard-chart rounded-xl border-border/70 bg-card p-6 shadow-none" style={{ "--enter-delay": "500ms" } as CSSProperties}>
          <div className="mb-4">
            <h2 className="text-foreground text-lg font-semibold tracking-tight">Governance alerts</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">Gaps that break an approval chain</p>
          </div>
          <div className="space-y-3">
            <Alert icon={ShieldAlert} tone="warning" title={`${vacantPositions.filter((position) => position.scope === "governance").length} governance positions are vacant`} body={`${ORG_SUMMARY.unownedDocuments} documents have no current owner and escalate one level up.`} />
            <Alert icon={Briefcase} tone="warning" title={`${vacantPositions.filter((position) => position.scope === "operations").length} department heads are missing`} body="Their teams currently report to the parent department." />
            <Alert icon={UserRoundX} tone="warning" title={`${ORG_SUMMARY.unplaced} employees are unplaced`} body={unplacedByEntity.map((item) => `${item.entity.name.split(" / ")[0]} ${item.count}`).join(" · ")} />
            <Alert icon={Layers} tone="positive" title={`${DEPARTMENTS.filter((department) => department.shared).length} shared departments`} body="Quality Assurance is run jointly across Bakemate, Khadija and AAA Contracting." />
          </div>
        </Card>
      </div>

      <div className="mt-6 grid items-start grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <Card className="rounded-xl border-border/70 bg-card p-6 shadow-none">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Largest departments</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">Rolled up with their sub-departments</p>
            </div>
            <Button asChild variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground hover:text-foreground">
              <Link to="/organization/structure">View structure <ChevronRight className="h-3.5 w-3.5" /></Link>
            </Button>
          </div>
          <ul className="divide-y divide-border/60">
            {largestDepartments.map((item, index) => (
              <li key={item.department.id} className="flex items-center gap-4 py-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-xs font-semibold tabular-nums text-muted-foreground">
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    to="/organization/employees"
                    search={{ company: item.department.company, department: item.department.id, unplaced: false }}
                    className="block truncate text-sm font-medium text-foreground hover:text-primary"
                  >
                    {item.department.name}
                  </Link>
                  <div className="truncate text-xs text-muted-foreground">{companyById(item.department.company)?.name}</div>
                </div>
                <div className="hidden w-40 shrink-0 sm:block">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${Math.round((item.people / maxHeadcount) * 100)}%` }} />
                  </div>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 text-xs tabular-nums text-muted-foreground">
                  <UsersIcon className="h-3.5 w-3.5" />
                  {item.people}
                </span>
              </li>
            ))}
          </ul>
          </Card>

          <Card className="flex flex-wrap items-center justify-between gap-4 rounded-xl border-border/70 bg-card p-6 shadow-none">
            <div>
              <h3 className="text-base font-semibold tracking-tight">Explore the organization</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">Employees, the position catalogue and three structure lenses.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm" className="gap-2 rounded-lg">
                <Link to="/organization/employees" search={employeeSearch}><UsersIcon className="h-4 w-4" /> Employees</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="gap-2 rounded-lg">
                <Link to="/organization/roles"><Briefcase className="h-4 w-4" /> Positions</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="gap-2 rounded-lg">
                <Link to="/organization/structure"><Building2 className="h-4 w-4" /> Structure <ArrowUpRight className="h-3.5 w-3.5" /></Link>
              </Button>
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="rounded-xl border-border/70 bg-card p-6 shadow-none">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold tracking-tight">Vacant positions</h3>
              <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{vacantPositions.length} open</span>
            </div>
            <ul className="space-y-2.5">
              {vacantPositions.map((position) => (
                <li key={position.id}>
                  <Link to="/organization/roles/$roleId" params={{ roleId: position.id }} className="flex items-start gap-2.5 text-sm hover:text-primary">
                    <Briefcase className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-foreground">{position.name}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {position.scope === "governance" ? `Governance · ${position.documents} documents` : departmentById(position.department)?.name}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="rounded-xl border-border/70 bg-card p-6 shadow-none">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold tracking-tight">Governance chain</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">Leadership from the top of the group downward</p>
              </div>
              <ShieldAlert className="h-4 w-4 text-muted-foreground" />
            </div>
            <ol className="relative space-y-2">
              <span className="pointer-events-none absolute bottom-6 left-[15px] top-6 w-px bg-border/70" />
              {governanceChain.map((item, index) => (
                <li key={item.body.id} className="governos-enter relative flex items-center gap-3" style={{ "--enter-delay": `${560 + index * 55}ms` } as CSSProperties}>
                  <span className={cn("z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold tabular-nums", item.vacant ? "border-destructive/35 bg-destructive/10 text-destructive" : "border-primary/30 bg-primary/10 text-primary")}>{index + 1}</span>
                  <div className={cn("min-w-0 flex-1 rounded-lg border px-3 py-2.5 transition-colors", item.vacant ? "border-destructive/20 bg-destructive/[0.04]" : "border-border/60 bg-muted/[0.18]")}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="truncate text-sm font-medium text-foreground">{item.body.name}</div>
                      <span className={cn("shrink-0 text-[10px] font-semibold uppercase tracking-wider", item.vacant ? "text-destructive" : "text-emerald-600 dark:text-emerald-400")}>{item.vacant ? "Open" : "Filled"}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                      {item.vacant ? <Briefcase className="h-3.5 w-3.5 shrink-0 text-destructive" /> : <UsersIcon className="h-3.5 w-3.5 shrink-0 text-primary" />}
                      {item.vacant ? `${item.vacant} vacant position${item.vacant === 1 ? "" : "s"}` : `${item.holder?.name ?? "Filled"} · ${item.positions} position${item.positions === 1 ? "" : "s"}`}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>

    </AdminShell>
  );
}

function Alert({ icon: Icon, tone, title, body }: { icon: typeof ShieldAlert; tone: "warning" | "positive"; title: string; body: string }) {
  const positive = tone === "positive";
  return (
    <div className="flex gap-3 rounded-lg border border-border/60 bg-muted/30 p-3">
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${positive ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-medium text-foreground">{title}</div>
        <div className="mt-1 text-xs leading-relaxed text-muted-foreground">{body}</div>
      </div>
    </div>
  );
}
