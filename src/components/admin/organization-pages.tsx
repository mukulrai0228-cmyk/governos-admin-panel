import { useMemo, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowRight, Briefcase, ChevronDown, ChevronRight, ChevronUp, FileText, Landmark, LayoutGrid, MapPin, Search, SlidersHorizontal, Table2, UserRoundX, Users } from "lucide-react";
import { PageHeader } from "@/components/admin/states";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { COMPANIES, DEPARTMENTS, EMPLOYEES, ORG_SUMMARY, ROLES, companyById, companyDescendants, departmentById, departmentDescendants, governanceById, initials, positionHolders, roleById, type Employee } from "@/lib/org-v2-data";
import { profileImageFor } from "@/lib/profile-images";

import { OrgSelect } from "@/components/admin/org-select";
import { AddDepartmentDialog, AddEmployeeDialog, EmployeeActions } from "@/components/admin/org-forms";

function Badge({ children, warning, solid }: { children: ReactNode; warning?: boolean; solid?: boolean }) {
  return <span className={cn("inline-flex whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium", warning ? "border-destructive/50 border-dashed text-destructive bg-destructive/5" : solid ? "border-primary/20 bg-primary/10 text-primary" : "border-border text-muted-foreground")}>{children}</span>;
}

function PersonLink({ person }: { person: Employee }) {
  return <Link to="/organization/employees/$employeeId" params={{ employeeId: person.id }} search={{ company: undefined, department: undefined, unplaced: false }} className="flex items-center gap-3 rounded-md border border-border/70 p-3 hover:border-primary/40 hover:bg-muted/30"><img src={profileImageFor(person)} alt="" className="h-8 w-8 shrink-0 rounded-md border border-border object-cover" /><span className="min-w-0"><b className="block truncate text-sm font-medium">{person.name}</b><span className="block truncate text-xs text-muted-foreground">{companyById(person.company)?.name} · {person.location}</span></span></Link>;
}

function PersonPopover({ person, children }: { person: Employee; children: ReactNode }) {
  const position = person.role ? roleById(person.role) : null;
  const department = person.department ? departmentById(person.department) : null;
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent align="start" className="w-80 p-0">
        <div className="flex items-start gap-3 border-b border-border/70 bg-muted/30 p-4">
          <img src={profileImageFor(person)} alt="" className="h-11 w-11 shrink-0 rounded-lg border border-border object-cover" />
          <span className="min-w-0">
            <b className="block truncate text-sm font-semibold">{person.name}</b>
            <span className="block truncate text-xs text-muted-foreground">{position ? position.name : "No position assigned"}</span>
            <Badge solid={person.status === "Active"} warning={person.status !== "Active"}>{person.status}</Badge>
          </span>
        </div>
        <dl className="grid gap-2 p-4 text-xs">
          {[
            ["Employee ID", person.id],
            ["Entity", companyById(person.company)?.name ?? "—"],
            ["Department", department?.name ?? "Unplaced"],
            ["Location", person.location],
            ["Email", person.email],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-3">
              <dt className="shrink-0 text-muted-foreground">{label}</dt>
              <dd className="truncate font-medium" title={value}>{value}</dd>
            </div>
          ))}
        </dl>
        <div className="border-t border-border/70 p-3">
          <Button asChild size="sm" className="w-full gap-1.5">
            <Link to="/organization/employees/$employeeId" params={{ employeeId: person.id }} search={{ company: undefined, department: undefined, unplaced: false }}>View full profile<ArrowRight className="h-3.5 w-3.5"/></Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export type EmployeeFilters = { company?: string; department?: string; unplaced?: boolean; role?: string };

function ViewToggle({ view, onChange }: { view: "table" | "grid"; onChange: (view: "table" | "grid") => void }) {
  return <div className="flex rounded-md border bg-card p-1" role="group" aria-label="View mode">
    <Button size="sm" variant={view === "table" ? "default" : "ghost"} className="gap-1.5" onClick={() => onChange("table")} aria-pressed={view === "table"}><Table2 className="h-3.5 w-3.5"/>Table</Button>
    <Button size="sm" variant={view === "grid" ? "default" : "ghost"} className="gap-1.5" onClick={() => onChange("grid")} aria-pressed={view === "grid"}><LayoutGrid className="h-3.5 w-3.5"/>Grid</Button>
  </div>;
}

const COLUMN_LABELS = { name: "Name", role: "Position", department: "Department", company: "Entity", location: "Location" } as const;

export function EmployeesPage({ initialFilters = {} }: { initialFilters?: EmployeeFilters }) {
  const [query, setQuery] = useState(""); const [company, setCompany] = useState(initialFilters.company ?? ""); const [department, setDepartment] = useState(initialFilters.department ?? ""); const [unplaced, setUnplaced] = useState(initialFilters.unplaced ?? false); const [sort, setSort] = useState<keyof typeof COLUMN_LABELS>("name"); const [descending, setDescending] = useState(false); const [page, setPage] = useState(1); const [view, setView] = useState<"table" | "grid">("grid"); const [, refresh] = useState(0);
  const positionName = (id: string | null) => roleById(id)?.name ?? "Not assigned";
  const rows = useMemo(() => {
    const term = query.trim().toLowerCase(); let result = EMPLOYEES.filter((employee) => {
      const matches = !term || [employee.name, employee.email, employee.id, positionName(employee.role)].some((value) => value.toLowerCase().includes(term));
      const allowedCompanies = company ? companyDescendants(company) : [];
      const allowedDepartments = department ? departmentDescendants(department) : [];
      return matches && (!company || allowedCompanies.includes(employee.company)) && (!department || (employee.department ? allowedDepartments.includes(employee.department) : false)) && (!unplaced || !employee.department);
    });
    const value = (employee: Employee) => ({ name: employee.name, role: positionName(employee.role), department: departmentById(employee.department)?.name ?? "zzz", company: companyById(employee.company)?.name ?? "", location: employee.location }[sort]);
    result = result.sort((a, b) => value(a).localeCompare(value(b)) * (descending ? -1 : 1)); return result;
  }, [query, company, department, unplaced, sort, descending]);
  const perPage = 18; const pages = Math.max(1, Math.ceil(rows.length / perPage)); const visible = rows.slice((page - 1) * perPage, page * perPage);
  const updateSort = (next: typeof sort) => { if (next === sort) setDescending((value) => !value); else { setSort(next); setDescending(false); } setPage(1); };
  const reset = () => { setQuery(""); setCompany(""); setDepartment(""); setUnplaced(false); setPage(1); };
  const activeFilters = Number(Boolean(company)) + Number(Boolean(department)) + Number(unplaced);
  return <>
    <PageHeader breadcrumbs={[{ label: "Organization" }, { label: "Employees" }]} title="Employees" actions={<AddEmployeeDialog />} />
    {!unplaced && <button onClick={() => { setUnplaced(true); setDepartment(""); setPage(1); }} className="mb-4 flex w-full items-center gap-3 rounded-md border border-dashed border-destructive/50 bg-destructive/5 px-4 py-3 text-left text-sm text-foreground"><UserRoundX className="h-4 w-4 text-destructive"/><span><b>{ORG_SUMMARY.unplaced} employees</b> are not placed in any department. Review them.</span><ChevronRight className="ml-auto h-4 w-4 text-muted-foreground"/></button>}
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <div className="relative min-w-[280px] flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/><Input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search name, position, email or employee ID" aria-label="Search employees" className="h-10 rounded-lg pl-9"/></div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="h-10 shrink-0 gap-2 rounded-lg px-3" aria-label="Open employee filters">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilters > 0 && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">{activeFilters}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[min(22rem,calc(100vw-2rem))] rounded-xl p-3">
          <div className="mb-3 flex items-center justify-between">
            <div><p className="text-sm font-semibold">Employee filters</p><p className="text-xs text-muted-foreground">Refine the directory view</p></div>
            {activeFilters > 0 && <button type="button" className="text-xs font-medium text-primary hover:underline" onClick={reset}>Clear</button>}
          </div>
          <div className="space-y-3">
            <OrgSelect label="Entity" placeholder="All entities" value={company} onValueChange={(next) => { setCompany(next); setDepartment(""); setUnplaced(false); setPage(1); }} className="w-full min-w-0" options={COMPANIES.map((item) => ({ value: item.id, label: item.name, hint: item.kind }))}/>
            <OrgSelect label="Department" placeholder="All departments" value={department} onValueChange={(next) => { setDepartment(next); setUnplaced(false); setPage(1); }} className="w-full min-w-0" options={DEPARTMENTS.filter((item) => !company || companyDescendants(company).includes(item.company)).map((item) => ({ value: item.id, label: item.name, hint: company ? undefined : companyById(item.company)?.name }))}/>
            <Button size="sm" variant={unplaced ? "default" : "outline"} className="h-9 w-full justify-start gap-2 rounded-lg" onClick={() => { setUnplaced((value) => !value); setDepartment(""); setPage(1); }} aria-pressed={unplaced}><UserRoundX className="h-3.5 w-3.5" />No department assigned</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
    <div className="mb-3 flex items-center justify-between gap-3"><p className="text-xs text-muted-foreground"><b className="text-foreground">{rows.length}</b> of {ORG_SUMMARY.employees} employees</p><ViewToggle view={view} onChange={setView}/></div>
    {rows.length ? <>{view === "table" ? <Card className="overflow-hidden rounded-md border-border shadow-none"><div className="overflow-x-auto"><Table><TableHeader><TableRow className="bg-muted/40">{(Object.keys(COLUMN_LABELS) as (keyof typeof COLUMN_LABELS)[]).map((key) => <TableHead key={key} className="cursor-pointer whitespace-nowrap text-[11px] uppercase" onClick={() => updateSort(key)}>{COLUMN_LABELS[key]} {sort === key ? (descending ? "↑" : "↓") : ""}</TableHead>)}<TableHead className="w-12" /></TableRow></TableHeader><TableBody>{visible.map((employee) => <TableRow key={employee.id}><TableCell><Link to="/organization/employees/$employeeId" params={{ employeeId: employee.id }} search={{ company: undefined, department: undefined, unplaced: false }} className="flex items-center gap-3"><img src={profileImageFor(employee)} alt="" className="h-8 w-8 shrink-0 rounded-md border object-cover" /><span><b className="block font-medium text-foreground">{employee.name}</b><small className="text-muted-foreground">{employee.id}</small></span></Link></TableCell><TableCell>{employee.role ? positionName(employee.role) : <Badge warning>Not assigned</Badge>}</TableCell><TableCell>{employee.department ? departmentById(employee.department)?.name : <Badge warning>No department</Badge>}</TableCell><TableCell>{companyById(employee.company)?.name}</TableCell><TableCell><span className="block">{employee.location}</span><small className="text-muted-foreground">{employee.locationType}</small></TableCell><TableCell><EmployeeActions employee={employee} onChanged={() => refresh((value) => value + 1)} onDeleted={() => refresh((value) => value + 1)} /></TableCell></TableRow>)}</TableBody></Table></div></Card> : <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{visible.map((employee) => <div key={employee.id} className="group relative rounded-lg border border-border/70 bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"><Link to="/organization/employees/$employeeId" params={{ employeeId: employee.id }} search={{ company: undefined, department: undefined, unplaced: false }} className="block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><div className="flex items-center gap-3 pr-8"><img src={profileImageFor(employee)} alt="" className="h-11 w-11 shrink-0 rounded-lg border bg-muted object-cover" /><span className="min-w-0"><b className="block truncate font-medium text-foreground group-hover:text-primary">{employee.name}</b><small className="text-muted-foreground">{employee.id}</small></span></div><div className="mt-3 space-y-1.5 text-xs text-muted-foreground"><p className="flex items-center gap-1.5 truncate"><Briefcase className="h-3.5 w-3.5 shrink-0"/>{employee.role ? positionName(employee.role) : <Badge warning>Not assigned</Badge>}</p><p className="flex items-center gap-1.5 truncate"><Users className="h-3.5 w-3.5 shrink-0"/>{employee.department ? departmentById(employee.department)?.name : <Badge warning>No department</Badge>}</p><p className="flex items-center gap-1.5 truncate"><MapPin className="h-3.5 w-3.5 shrink-0"/>{companyById(employee.company)?.name} · {employee.location}</p></div></Link><div className="absolute right-3 top-3"><EmployeeActions employee={employee} onChanged={() => refresh((value) => value + 1)} onDeleted={() => refresh((value) => value + 1)} /></div></div>)}</div>}<div className="mt-3 flex items-center justify-end gap-3 text-xs text-muted-foreground"><Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>Previous</Button><span>Page {page} of {pages}</span><Button variant="outline" size="sm" disabled={page === pages} onClick={() => setPage((value) => value + 1)}>Next</Button></div></> : <Card className="p-10 text-center shadow-none"><h2 className="font-semibold">Nobody matches these filters</h2><p className="mt-1 text-sm text-muted-foreground">Remove a filter, or try a different search.</p><Button className="mt-4" onClick={reset}>Reset the view</Button></Card>}
  </>;
}

type TitleGroup = { key: string; name: string; grade: string; seats: typeof ROLES; filled: number; vacant: number; documents: number };
type PositionGroup = { key: string; name: string; subtitle: string; scope: "operations" | "governance"; titles: TitleGroup[]; seats: number; filled: number; vacant: number; documents: number };

function FillBar({ filled, seats }: { filled: number; seats: number }) {
  const pct = seats ? Math.round((filled / seats) * 100) : 0;
  return <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted"><div className={cn("h-full rounded-full transition-all", pct === 100 ? "bg-primary" : "bg-destructive/70")} style={{ width: `${Math.max(pct, 2)}%` }} /></div>;
}

function TitleRow({ title }: { title: TitleGroup }) {
  const [open, setOpen] = useState(false);
  const single = title.seats.length === 1;
  const summary = <>
    <span className="min-w-0 flex-1"><b className="block truncate text-sm font-medium">{title.name}</b><small className="text-muted-foreground">{title.grade}{title.documents ? ` · ${title.documents} documents owned` : ""}</small></span>
    <span className="flex shrink-0 items-center gap-2">{title.filled > 0 && <Badge solid>{title.filled} filled</Badge>}{title.vacant > 0 && <Badge warning>{title.vacant} vacant</Badge>}<small className="hidden w-16 text-right text-muted-foreground sm:block">{title.seats.length} {title.seats.length === 1 ? "seat" : "seats"}</small></span>
  </>;
  if (single) return <Link to="/organization/roles/$roleId" params={{ roleId: title.seats[0].id }} className="flex items-center gap-3 rounded-md px-3 py-2.5 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{summary}<ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground"/></Link>;
  return <div className="rounded-md">
    <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{summary}{open ? <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground"/> : <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground"/>}</button>
    {open && <ul className="ml-3 border-l border-border/70 pl-3">{title.seats.map((seat) => { const holder = positionHolders(seat.id)[0]; return <li key={seat.id}>{holder ? <PersonPopover person={holder}><button type="button" className="flex w-full items-center rounded-md px-3 py-2 text-left text-xs font-medium hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><span className="truncate">{holder.name}</span></button></PersonPopover> : <Link to="/organization/roles/$roleId" params={{ roleId: seat.id }} className="flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Badge warning>Vacant</Badge><ChevronRight className="h-3.5 w-3.5 text-muted-foreground"/></Link>}</li>; })}</ul>}
  </div>;
}

function GroupCard({ group }: { group: PositionGroup }) {
  const [open, setOpen] = useState(false);
  return <Card className="roles-group-card overflow-hidden rounded-lg border-border/70 shadow-sm">
    <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} className="flex w-full items-start gap-3 p-4 text-left hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg border bg-muted text-muted-foreground">{group.scope === "governance" ? <Landmark className="h-4 w-4"/> : <Users className="h-4 w-4"/>}</span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2"><b className="roles-group-title truncate font-medium text-foreground">{group.name}</b>{group.vacant > 0 ? <Badge warning>{group.vacant} vacant</Badge> : <Badge>Fully staffed</Badge>}</span>
        <small className="mt-0.5 block truncate text-muted-foreground">{group.subtitle}</small>
        <span className="mt-2.5 block"><FillBar filled={group.filled} seats={group.seats}/></span>
        <small className="mt-1.5 block text-muted-foreground">{group.titles.length} job {group.titles.length === 1 ? "title" : "titles"} · {group.seats} {group.seats === 1 ? "seat" : "seats"} · {group.filled} filled · {group.vacant} vacant{group.documents ? ` · ${group.documents} documents` : ""}</small>
      </span>
      {open ? <ChevronUp className="mt-1 h-4 w-4 shrink-0 text-muted-foreground"/> : <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-muted-foreground"/>}
    </button>
    {open && <div className="border-t border-border/70 p-2">{group.titles.map((title) => <TitleRow key={title.key} title={title}/>)}</div>}
  </Card>;
}

export function RolesPage() {
  const [query, setQuery] = useState(""); const [scope, setScope] = useState<"all" | "operations" | "governance">("all"); const [vacantOnly, setVacantOnly] = useState(false); const [grouping, setGrouping] = useState<"entity" | "function">("entity");
  const groups = useMemo<PositionGroup[]>(() => {
    const term = query.trim().toLowerCase();
    const map = new Map<string, PositionGroup>();
    for (const position of ROLES) {
      if (scope !== "all" && position.scope !== scope) continue;
      const department = departmentById(position.department ?? null);
      const body = governanceById(position.body ?? null);
      const groupKey = position.scope === "governance" ? `gov:${position.body}` : `dep:${position.department}`;
      const groupName = position.scope === "governance" ? body?.name ?? "Governance" : department?.name ?? "Unassigned";
      const subtitle = position.scope === "governance" ? `Governance body${body?.kind ? ` · ${body.kind}` : ""}` : companyById(department?.company ?? null)?.name ?? "";
      if (term && !position.name.toLowerCase().includes(term) && !groupName.toLowerCase().includes(term)) continue;
      let group = map.get(groupKey);
      if (!group) { group = { key: groupKey, name: groupName, subtitle, scope: position.scope, titles: [], seats: 0, filled: 0, vacant: 0, documents: 0 }; map.set(groupKey, group); }
      const filled = positionHolders(position.id).length > 0;
      let title = group.titles.find((item) => item.name === position.name);
      if (!title) { title = { key: `${groupKey}:${position.name}`, name: position.name, grade: position.grade, seats: [], filled: 0, vacant: 0, documents: 0 }; group.titles.push(title); }
      title.seats.push(position); title.documents += position.documents; if (filled) title.filled += 1; else title.vacant += 1;
      group.seats += 1; group.documents += position.documents; if (filled) group.filled += 1; else group.vacant += 1;
    }
    const list = [...map.values()];
    for (const group of list) group.titles.sort((a, b) => b.vacant - a.vacant || b.seats.length - a.seats.length || a.name.localeCompare(b.name));
    const filtered = list.filter((group) => !vacantOnly || group.vacant > 0);
    // The underlying cards are identical in both modes; only the sort order differs.
    // "By entity" reflects the reporting structure (vacancies first). "By job function"
    // is just an alphabetical re-sort so cards sharing a name sit together — totals are
    // never merged across entities.
    if (grouping === "function") return filtered.sort((a, b) => a.name.localeCompare(b.name) || a.subtitle.localeCompare(b.subtitle));
    return filtered.sort((a, b) => b.vacant - a.vacant || b.seats - a.seats || a.name.localeCompare(b.name));
  }, [query, scope, vacantOnly, grouping]);
  const totals = groups.reduce((acc, group) => ({ seats: acc.seats + group.seats, titles: acc.titles + group.titles.length, vacant: acc.vacant + group.vacant }), { seats: 0, titles: 0, vacant: 0 });
  // For "By job function", cluster consecutive cards that share a name under one heading.
  // Each card inside still shows its own entity, fill bar and counts — nothing is merged.
  const clusters = useMemo<{ name: string; cards: PositionGroup[] }[]>(() => {
    if (grouping !== "function") return [];
    const out: { name: string; cards: PositionGroup[] }[] = [];
    for (const group of groups) {
      const last = out[out.length - 1];
      if (last && last.name === group.name) last.cards.push(group);
      else out.push({ name: group.name, cards: [group] });
    }
    return out;
  }, [groups, grouping]);
  const activeFilters = Number(scope !== "all") + Number(vacantOnly) + Number(grouping !== "entity");
  return <><PageHeader breadcrumbs={[{ label: "Organization" }, { label: "Positions" }]} title="Position catalogue" actions={<AddDepartmentDialog />} />
    <div className="mb-4 flex items-center gap-3 rounded-md border border-dashed border-destructive/50 bg-destructive/5 px-4 py-3 text-sm"><AlertTriangle className="h-4 w-4 shrink-0 text-destructive"/><span><b>{ORG_SUMMARY.vacantPositions} positions are vacant.</b> {ORG_SUMMARY.unownedDocuments} governance documents have no current owner.</span></div>
    <div className="mb-4 flex items-center gap-2">
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
        <Input className="h-10 rounded-lg pl-9" placeholder="Search job titles, departments or bodies" value={query} onChange={(event) => setQuery(event.target.value)}/>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="h-10 shrink-0 gap-2 rounded-lg px-3" aria-label="Open position filters">
            <SlidersHorizontal className="h-4 w-4"/>
            <span className="hidden sm:inline">Filters</span>
            {activeFilters > 0 && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">{activeFilters}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[min(22rem,calc(100vw-2rem))] rounded-xl p-3">
          <div className="mb-3 flex items-center justify-between">
            <div><p className="text-sm font-semibold">Position filters</p><p className="text-xs text-muted-foreground">Refine the catalogue view</p></div>
            {activeFilters > 0 && <button type="button" className="text-xs font-medium text-primary hover:underline" onClick={() => { setScope("all"); setGrouping("entity"); setVacantOnly(false); }}>Clear</button>}
          </div>
          <div className="space-y-3">
            <div role="group" aria-label="Position scope"><p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Scope</p><div className="grid grid-cols-3 gap-1 rounded-lg bg-muted/40 p-1">{(["all","operations","governance"] as const).map((item) => <Button key={item} size="sm" variant={scope === item ? "default" : "ghost"} className="h-8 px-2 text-xs" onClick={() => setScope(item)} aria-pressed={scope === item}>{item[0].toUpperCase() + item.slice(1)}</Button>)}</div></div>
            <div role="group" aria-label="Group positions by"><p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Group by</p><div className="grid grid-cols-2 gap-1 rounded-lg bg-muted/40 p-1"><Button size="sm" variant={grouping === "entity" ? "default" : "ghost"} className="h-8 px-2 text-xs" onClick={() => setGrouping("entity")} aria-pressed={grouping === "entity"}>By entity</Button><Button size="sm" variant={grouping === "function" ? "default" : "ghost"} className="h-8 px-2 text-xs" onClick={() => setGrouping("function")} aria-pressed={grouping === "function"}>By job function</Button></div></div>
            <Button size="sm" variant={vacantOnly ? "default" : "outline"} className="h-9 w-full justify-start gap-2 rounded-lg" onClick={() => setVacantOnly((value) => !value)} aria-pressed={vacantOnly}><AlertTriangle className="h-3.5 w-3.5"/>With vacancies</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
    <p className="mb-3 text-xs text-muted-foreground"><b className="text-foreground">{groups.length}</b> {scope === "governance" ? "governance bodies" : "groups"} · {totals.titles} job titles · {totals.seats} seats · <b className="text-foreground">{totals.vacant}</b> vacant</p>
    {groups.length ? (grouping === "function" ? <div className="space-y-6">{clusters.map((cluster) => <section key={cluster.name}><div className="mb-2 flex items-baseline gap-2"><h2 className="text-sm font-semibold tracking-tight">{cluster.name}</h2><span className="text-xs text-muted-foreground">{cluster.cards.length} {cluster.cards.length === 1 ? "entity" : "entities"}</span></div><div className="grid items-start gap-3 xl:grid-cols-2">{cluster.cards.map((group) => <GroupCard key={group.key} group={group}/>)}</div></section>)}</div> : <div className="grid items-start gap-3 xl:grid-cols-2">{groups.map((group) => <GroupCard key={group.key} group={group}/>)}</div>) : <Card className="p-10 text-center shadow-none"><h2 className="font-semibold">No positions match</h2><p className="mt-1 text-sm text-muted-foreground">Try a different search or clear the vacancy filter.</p></Card>}
  </>;
}


export function RoleDetailPage({ roleId }: { roleId: string }) {
  const position = roleById(roleId); if (!position) return <p>Position not found.</p>;
  const held = positionHolders(position.id); const vacant = held.length === 0;
  const where = position.scope === "governance" ? governanceById(position.body ?? null)?.name : `${departmentById(position.department ?? null)?.name} · ${companyById(departmentById(position.department ?? null)?.company ?? null)?.name}`;

  if (vacant) {
    return <>
      <Button asChild variant="ghost" size="sm" className="mb-3"><Link to="/organization/roles">← Positions</Link></Button>
      <PageHeader breadcrumbs={[{ label: "Organization" }, { label: "Positions", to: "/organization/roles" }, { label: position.name }]} title={position.name} description={where}/>
      <div className="mb-5 flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-4">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-destructive/10 text-destructive"><UserRoundX className="h-4.5 w-4.5"/></span>
        <div className="min-w-0">
          <b className="block text-sm font-semibold text-destructive">This seat is vacant</b>
          <p className="mt-1 text-sm text-muted-foreground">
            {position.documents > 0
              ? `${position.documents} governance ${position.documents === 1 ? "document is" : "documents are"} owned by this seat. Approvals and change requests on ${position.documents === 1 ? "it" : "them"} escalate one level up until someone is assigned.`
              : "This seat owns no governance documents, but its approvals escalate one level up until someone is assigned."}
          </p>
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <section className="lg:col-span-1">
          <h2 className="mb-3 text-sm font-semibold">Position details</h2>
          <Card className="divide-y rounded-md shadow-none">
            {[["Hierarchy", position.scope], ["Grade", position.grade], [position.scope === "governance" ? "Body" : "Department / Entity", where ?? "—"], ["Status", "Vacant"]].map(([label, value]) => <div key={label} className="flex justify-between gap-4 p-3 text-sm"><span className="text-muted-foreground">{label}</span><b className={cn("text-right font-medium capitalize", value === "Vacant" && "text-destructive")}>{value}</b></div>)}
          </Card>
        </section>
        <section className="lg:col-span-1">
          <h2 className="mb-3 text-sm font-semibold">Vacancy impact</h2>
          <Card className="divide-y rounded-md border-destructive/30 shadow-none">
            <div className="flex items-center justify-between gap-4 p-3 text-sm"><span className="flex items-center gap-2 text-muted-foreground"><FileText className="h-4 w-4 text-destructive"/>Documents affected</span><b className={cn("font-semibold tabular-nums", position.documents > 0 && "text-destructive")}>{position.documents}</b></div>
            <div className="flex items-center justify-between gap-4 p-3 text-sm"><span className="flex items-center gap-2 text-muted-foreground"><AlertTriangle className="h-4 w-4 text-destructive"/>Pending approvals</span><b className="font-semibold tabular-nums text-destructive">{position.documents > 0 ? position.documents : 1}</b></div>
            <div className="flex items-start justify-between gap-4 p-3 text-sm"><span className="flex items-center gap-2 text-muted-foreground"><Landmark className="h-4 w-4 text-muted-foreground"/>Decision authority</span><b className="text-right font-medium">{position.authority}</b></div>
          </Card>
          <p className="mt-2 text-xs text-muted-foreground">Approvals requiring this authority currently escalate one level up the chain.</p>
        </section>
        <section className="lg:col-span-1">
          <h2 className="mb-3 text-sm font-semibold">Holder history</h2>
          <Card className="p-5 shadow-none">
            {position.previousHolder ? <>
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-border bg-muted text-[11px] font-semibold">{initials(position.previousHolder.name)}</span>
                <span className="min-w-0"><b className="block truncate text-sm font-medium">{position.previousHolder.name}</b><small className="text-muted-foreground">Last held this seat · left {position.previousHolder.until}</small></span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">The seat has been vacant since {position.previousHolder.until}.</p>
            </> : <p className="text-sm text-muted-foreground">No previous holder on record for this seat.</p>}
          </Card>
        </section>
      </div>
    </>;
  }

  return <><Button asChild variant="ghost" size="sm" className="mb-3"><Link to="/organization/roles">← Positions</Link></Button><PageHeader breadcrumbs={[{ label: "Organization" }, { label: "Positions", to: "/organization/roles" }, { label: position.name }]} title={position.name} description={where}/><div className="grid gap-5 lg:grid-cols-2"><section><h2 className="mb-3 text-sm font-semibold">Position details</h2><Card className="divide-y rounded-md shadow-none">{[["Hierarchy", position.scope], ["Grade", position.grade], ["Decision authority", position.authority], ["Documents owned", String(position.documents)], ["Status", "Filled"]].map(([label,value]) => <div key={label} className="flex justify-between gap-4 p-3 text-sm"><span className="text-muted-foreground">{label}</span><b className="text-right font-medium capitalize">{value}</b></div>)}</Card></section><section><h2 className="mb-3 text-sm font-semibold">{`Held by ${held.length}`}</h2><div className="grid gap-2">{held.slice(0,10).map((person) => <PersonLink key={person.id} person={person}/>)}</div></section></div></>;
}
