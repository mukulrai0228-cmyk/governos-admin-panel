import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Briefcase, Building2, FileText, GitBranch, IdCard, Mail, MapPin, Phone, ShieldCheck, Users } from "lucide-react";
import { Breadcrumb } from "@/components/admin/states";
import { EmployeeActions } from "@/components/admin/org-forms";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { EMPLOYEES, companyById, departmentById, initials, roleById, type Employee } from "@/lib/org-v2-data";
import { jobDescriptionFor } from "@/lib/job-description";
import { profileImageFor } from "@/lib/profile-images";

const TABS = [
  { id: "details", label: "Details", icon: IdCard },
  { id: "jd", label: "Job description", icon: FileText },
  { id: "position-reporting", label: "Position & reporting", icon: GitBranch },
] as const;
type Tab = (typeof TABS)[number]["id"];

function Chip({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center rounded-md border border-foreground/15 bg-foreground/5 px-2.5 py-1 text-[11px] font-semibold text-foreground">{children}</span>;
}

function Avatar({ name, image, size = "md", active }: { name: string; image?: string; size?: "sm" | "md" | "lg"; active?: boolean }) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-xl border font-semibold tracking-wide",
        active ? "border-primary-foreground/30 bg-primary-foreground/15 text-primary-foreground" : "border-border/70 bg-[image:var(--gradient-surface)] text-foreground",
        size === "lg" && "h-16 w-16 text-lg",
        size === "md" && "h-10 w-10 text-xs",
        size === "sm" && "h-9 w-9 text-[11px]",
      )}
    >
      {image ? <img src={image} alt="" className="h-full w-full rounded-[inherit] object-cover" /> : initials(name)}
    </span>
  );
}

function PersonRow({ person, active, caption }: { person: Employee; active?: boolean; caption?: string }) {
  const inner = (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors",
        active ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-elegant)]" : "border-border/70 bg-card hover:border-primary/40 hover:bg-accent/40",
      )}
    >
      <Avatar name={person.name} image={profileImageFor(person)} active={active} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold">{person.name}</span>
        <span className={cn("block truncate text-xs", active ? "text-primary-foreground/75" : "text-muted-foreground")}>{caption ?? roleById(person.role)?.name ?? "No position assigned"}</span>
      </span>
      {!active && <Chip>{companyById(person.company)?.name}</Chip>}
    </div>
  );
  if (active) return inner;
  return (
    <Link to="/organization/employees/$employeeId" params={{ employeeId: person.id }} search={{ company: undefined, department: undefined, unplaced: false }} className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      {inner}
    </Link>
  );
}

export function EmployeeDetailPage({ employeeId }: { employeeId: string }) {
  const [tab, setTab] = useState<Tab>("details");
  const [, refresh] = useState(0);
  const employee = EMPLOYEES.find((item) => item.id === employeeId);
  if (!employee) {
    return (
      <Card className="p-10 text-center shadow-none">
        <h1 className="text-lg font-semibold">Employee not found</h1>
        <p className="mt-1 text-sm text-muted-foreground">This profile may have been removed.</p>
        <Button asChild className="mt-4"><Link to="/organization/employees" search={{ company: undefined, department: undefined, unplaced: false }}>Back to employees</Link></Button>
      </Card>
    );
  }

  const role = roleById(employee.role);
  const company = companyById(employee.company);
  const department = departmentById(employee.department);
  const profileImage = profileImageFor(employee);

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-2">
          <Button asChild variant="outline" size="icon" className="h-8 w-8 shrink-0 rounded-full" aria-label="Back to employees" title="Back to employees">
            <Link to="/organization/employees" search={{ company: undefined, department: undefined, unplaced: false }}><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <Breadcrumb items={[{ label: "Organization" }, { label: "Employees", to: "/organization/employees" }, { label: employee.name }]} />
        </div>
        <EmployeeActions employee={employee} onChanged={() => refresh((value) => value + 1)} onDeleted={() => window.history.back()} />
      </div>

      <Card className="w-full min-w-0 overflow-hidden rounded-2xl border-border/70 p-0 shadow-[var(--shadow-soft)]">
        <div className="relative overflow-hidden border-b border-border/70 bg-[image:var(--gradient-surface)] p-6">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <img src={profileImage} alt="" className="absolute inset-0 h-full w-full scale-125 object-cover opacity-45 blur-3xl saturate-125" />
            <div className="absolute inset-0 bg-background/45" />
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[image:var(--gradient-brand)]" />
          <span className={cn("absolute right-6 top-6 z-10 inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold", employee.status === "Active" ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" : "border-dashed border-destructive/50 bg-destructive/5 text-destructive")}>{employee.status}</span>
          <div className="relative flex flex-wrap items-start gap-4">
            <Avatar name={employee.name} image={profileImage} size="lg" />
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-2xl font-semibold tracking-tight text-foreground">{employee.name}</h1>
              <p className="mt-0.5 text-sm text-muted-foreground">{role?.name ?? "No position assigned"}{department ? `, ${department.name}` : ""}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Chip>{company?.name}</Chip>
                {department && <Chip>{department.name}</Chip>}
                <Chip>{employee.location}</Chip>
                {role && <Chip>{role.grade}</Chip>}
              </div>
            </div>
          </div>

          <div className="-mb-6 mt-6 flex gap-1 overflow-x-auto">
            {TABS.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                aria-current={tab === item.id}
                className={cn(
                  "governos-tab-trigger flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  tab === item.id ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                <item.icon className={cn("governos-tab-icon h-4 w-4", tab === item.id && "governos-tab-icon-active")} />
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div key={tab} className="governos-tab-content p-6">
          {tab === "jd" && <JobDescriptionTab employee={employee} />}

          {tab === "position-reporting" && <PositionReportingTab employee={employee} />}

          {tab === "details" && (
            <dl className="grid gap-x-10 gap-y-0 sm:grid-cols-2">
              <Detail icon={IdCard} label="Employee ID" value={employee.id} mono />
              <Detail icon={Users} label="Status" value={employee.status} />
              <Detail icon={Mail} label="Email" value={employee.email} mono />
              <Detail icon={Phone} label="Phone" value={employee.phone} mono />
              <Detail icon={Briefcase} label="Joined" value={String(employee.since)} />
              <Detail icon={MapPin} label="Location" value={`${employee.location} · ${employee.locationType}`} />
            </dl>
          )}
        </div>
      </Card>
    </div>
  );
}

function PositionRow({ icon: Icon, label, title, body, to }: { icon: typeof Building2; label: string; title: string; body: string; to?: { roleId: string } }) {
  const heading = to ? (
    <Link to="/organization/roles/$roleId" params={to} className="text-sm font-semibold underline-offset-4 hover:text-primary hover:underline">{title}</Link>
  ) : (
    <span className="text-sm font-semibold">{title}</span>
  );
  return (
    <div className="grid gap-2 rounded-xl border border-border/70 bg-card p-4 sm:grid-cols-[150px_1fr] sm:items-start">
      <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground"><Icon className="h-4 w-4" />{label}</span>
      <span>
        {heading}
        <span className="mt-1 block text-sm text-muted-foreground">{body}</span>
      </span>
    </div>
  );
}

function Detail({ icon: Icon, label, value, mono }: { icon: typeof Mail; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/60 py-3.5">
      <dt className="flex items-center gap-2 text-sm text-muted-foreground"><Icon className="h-4 w-4" />{label}</dt>
      <dd className={cn("text-right text-sm font-medium", mono && "font-mono text-[13px]")}>{value}</dd>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-6 first:mt-0">
      <h2 className="text-base font-semibold tracking-tight">{title}</h2>
      <div className="mt-2 text-sm text-muted-foreground">{children}</div>
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return <ul className="list-disc space-y-1.5 pl-5">{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

function Tag({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">{children}</span>;
}

function SideRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/60 py-2.5 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium">{value}</span>
    </div>
  );
}

function JobDescriptionTab({ employee }: { employee: Employee }) {
  const role = roleById(employee.role);
  if (!role) {
    return <p className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">No operational position is assigned, so there is no job description to show yet.</p>;
  }
  const jd = jobDescriptionFor(role);

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="rounded-2xl border border-border/70 bg-card p-6 lg:col-span-2">
        <Section title="Job purpose"><p>{jd.purpose}</p></Section>
      </div>
      <div className="rounded-2xl border border-border/70 bg-card p-6">
        <Section title="Key responsibilities"><Bullets items={jd.responsibilities} /></Section>
      </div>
      <div className="rounded-2xl border border-border/70 bg-card p-6">
        <Section title="Qualifications & experience"><Bullets items={jd.qualifications} /></Section>
      </div>
      <div className="rounded-2xl border border-border/70 bg-card p-6">
        <Section title="Competencies">
          <p className="text-[11px] font-semibold uppercase tracking-wider">Core</p>
          <div className="mt-2 flex flex-wrap gap-2">{jd.core.map((item) => <Tag key={item}>{item}</Tag>)}</div>
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider">Functional</p>
          <div className="mt-2 flex flex-wrap gap-2">{jd.functional.map((item) => <Tag key={item}>{item}</Tag>)}</div>
        </Section>
      </div>
      <div className="rounded-2xl border border-border/70 bg-card p-6">
        <Section title="Job architecture">
          <SideRow label="Job family" value={jd.jobFamily} />
          <SideRow label="Grade / band" value={jd.gradeBand} />
          <SideRow label="Decision authority" value={role.authority} />
          <SideRow label="Document status" value={`${jd.status} · v${jd.version}`} />
          <SideRow label="Last reviewed" value={jd.lastReviewed} />
        </Section>
      </div>
    </div>
  );
}

function PositionReportingTab({ employee }: { employee: Employee }) {
  const role = roleById(employee.role);
  const governanceRole = roleById(employee.governanceRole);
  const manager = EMPLOYEES.find((item) => item.id === employee.manager);
  const reports = EMPLOYEES.filter((item) => item.manager === employee.id);
  const company = companyById(employee.company);
  const department = departmentById(employee.department);

  return (
    <div className="grid gap-5">
      <section className="rounded-2xl border border-border/70 bg-card p-6">
        <h2 className="text-base font-semibold tracking-tight">Position</h2>
        <p className="mt-1 text-sm text-muted-foreground">{employee.name.split(" ")[0]} appears in the legal, operational and governance hierarchies.</p>
        <div className="mt-4 grid gap-3">
          <PositionRow icon={Building2} label="Legal" title={company?.name ?? "Unknown entity"} body={`The entity that employs them. ${company?.kind ?? ""} · ${company?.country ?? ""}. One employee, one entity.`} />
          <PositionRow icon={Briefcase} label="Operations" to={role ? { roleId: role.id } : undefined} title={role?.name ?? "No operations position assigned"} body={role ? `${department?.name ?? "No department"} · grade ${role.grade}. Decision authority: ${role.authority}.` : "This employee is on the payroll but has no operational position."} />
          <PositionRow icon={ShieldCheck} label="Governance" to={governanceRole ? { roleId: governanceRole.id } : undefined} title={governanceRole?.name ?? "No governance position"} body={governanceRole ? `Authority: ${governanceRole.authority} · owns ${governanceRole.documents} documents in the approval chain.` : "Most employees have none. Governance seats are held by a small number of people, usually in addition to an operations position."} />
        </div>
      </section>

      <section className="rounded-2xl border border-border/70 bg-card p-6">
        <h2 className="text-base font-semibold tracking-tight">Reporting</h2>
        <div className="mt-4 grid gap-5">
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Reports to</h3>
            {manager ? <PersonRow person={manager} /> : <p className="rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground">Top of the chain — this position reports to nobody.</p>}
          </div>
          <div className="relative pl-4">
            <span className="absolute left-0 top-0 h-full w-0.5 rounded-full bg-foreground/20" />
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">This employee</h3>
            <PersonRow person={employee} active />
          </div>
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Direct reports, {reports.length}</h3>
            {reports.length ? <div className="grid gap-2 lg:grid-cols-2">{reports.slice(0, 12).map((person) => <PersonRow key={person.id} person={person} />)}</div> : <div className="rounded-xl border border-dashed border-border p-6"><b className="text-sm">No direct reports</b><p className="mt-1 text-sm text-muted-foreground">No other position reports into {role?.name ?? "this position"} today.</p></div>}
          </div>
        </div>
      </section>
    </div>
  );
}
