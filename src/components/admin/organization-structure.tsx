import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Building2, Focus, Landmark, Maximize2, Minimize2, Minus, Network, Plus, ShieldAlert, UserRound, Users } from "lucide-react";
import { TransformComponent, TransformWrapper, type ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/admin/states";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { COMPANIES, DEPARTMENTS, EMPLOYEES, GOVERNANCE, ROLES, companyById, companyDescendants, departmentById, departmentDescendants, governanceById } from "@/lib/org-v2-data";

type Lens = "legal" | "operations" | "governance";

type VisualNode = {
  id: string;
  name: string;
  eyebrow: string;
  meta: string;
  parent: string | null;
  warning?: boolean;
};

const LENSES: { id: Lens; name: string; icon: typeof Landmark; description: string }[] = [
  { id: "legal", name: "Legal ownership", icon: Landmark, description: "Who owns whom. This decides which entity employs each person and which books they sit in." },
  { id: "operations", name: "Operations", icon: Network, description: "Who does the work. Departments and teams inside each entity, and who runs them." },
  { id: "governance", name: "Governance", icon: ShieldAlert, description: "Who decides. The approval chain from the Chairman down to the domain heads." },
];

function Pill({ children, warning, solid }: { children: ReactNode; warning?: boolean; solid?: boolean }) {
  return (
    <span className={cn(
      "whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium",
      warning ? "border-dashed border-destructive/50 bg-destructive/5 text-destructive" : solid ? "border-primary/25 bg-primary/10 text-primary" : "border-border/70 bg-card/60 text-muted-foreground",
    )}>{children}</span>
  );
}

function getVisualNodes(lens: Lens): VisualNode[] {
  if (lens === "legal") {
    return COMPANIES.map((company) => ({
      id: company.id,
      name: company.name,
      eyebrow: company.kind,
      meta: `${EMPLOYEES.filter((employee) => employee.company === company.id).length} employees`,
      parent: company.parent,
    }));
  }

  if (lens === "governance") {
    return GOVERNANCE.map((body) => {
      const roles = ROLES.filter((role) => role.body === body.id);
      const vacant = roles.filter((role) => !EMPLOYEES.some((employee) => employee.governanceRole === role.id)).length;
      return {
        id: body.id,
        name: body.name,
        eyebrow: body.kind,
        meta: vacant ? `${vacant} vacant position${vacant === 1 ? "" : "s"}` : `${roles.length} position${roles.length === 1 ? "" : "s"}`,
        parent: body.parent,
        warning: vacant > 0,
      };
    });
  }

  const companyNodes: VisualNode[] = COMPANIES
    .filter((company) => DEPARTMENTS.some((department) => department.company === company.id))
    .map((company) => ({
      id: company.id,
      name: company.name,
      eyebrow: "Entity",
      meta: `${EMPLOYEES.filter((employee) => employee.company === company.id).length} employees`,
      parent: null,
    }));
  const departmentNodes: VisualNode[] = DEPARTMENTS.map((department) => ({
    id: department.id,
    name: department.name,
    eyebrow: department.shared ? "Shared department" : "Department",
    meta: `${departmentDescendants(department.id).reduce((sum, id) => sum + EMPLOYEES.filter((employee) => employee.department === id).length, 0)} employees`,
    parent: department.parent ?? department.company,
  }));
  return [...companyNodes, ...departmentNodes];
}

function VisualNodeCard({ node, selected, onSelect }: { node: VisualNode; selected: boolean; onSelect: () => void }) {
  const Icon = node.eyebrow === "Entity" || node.eyebrow.includes("entity") ? Building2 : node.eyebrow.includes("Department") || node.eyebrow.includes("department") ? Users : ShieldAlert;
  return (
    <Button
      variant="outline"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "relative z-10 h-[112px] w-[188px] shrink-0 flex-col items-stretch justify-start gap-0 overflow-hidden rounded-xl border-border/70 bg-card px-4 py-3 text-left shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/45 hover:bg-card hover:shadow-[var(--shadow-elegant)]",
        selected && "-translate-y-1 border-primary bg-primary/10 ring-2 ring-primary/20",
        node.warning && !selected && "border-dashed border-destructive/50",
      )}
    >
      <span className="flex w-full items-center gap-2">
        <span className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary", node.warning && "bg-destructive/10 text-destructive")}>
          <Icon className="h-3.5 w-3.5" />
        </span>
        <span className="truncate text-[10px] font-semibold uppercase text-muted-foreground">{node.eyebrow}</span>
      </span>
      <span className="mt-2 line-clamp-2 w-full whitespace-normal text-sm font-semibold leading-tight text-foreground">{node.name}</span>
      <span className={cn("mt-auto w-full truncate text-xs text-muted-foreground", node.warning && "text-destructive")}>{node.meta}</span>
    </Button>
  );
}

function VisualBranch({ node, nodes, selected, setSelected }: { node: VisualNode; nodes: VisualNode[]; selected: string; setSelected: (id: string) => void }) {
  const children = nodes.filter((item) => item.parent === node.id);
  return (
    <div className="flex min-w-max flex-col items-center">
      <VisualNodeCard node={node} selected={selected === node.id} onSelect={() => setSelected(node.id)} />
      {children.length > 0 && (
        <div className="relative mt-8 flex items-start gap-5 px-2 pt-8 before:absolute before:left-1/2 before:top-0 before:h-8 before:w-px before:-translate-x-1/2 before:bg-border">
          {children.length > 1 && <span aria-hidden className="absolute left-[102px] right-[102px] top-0 h-px bg-border" />}
          {children.map((child) => (
            <div key={child.id} className="relative before:absolute before:left-1/2 before:-top-8 before:h-8 before:w-px before:-translate-x-1/2 before:bg-border">
              <VisualBranch node={child} nodes={nodes} selected={selected} setSelected={setSelected} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function GovernanceVisualMap({ nodes, selected, setSelected }: { nodes: VisualNode[]; selected: string; setSelected: (id: string) => void }) {
  const byId = (id: string) => nodes.find((node) => node.id === id);
  const chair = byId("gov-chair");
  const board = byId("gov-board");
  const audit = byId("gov-audit");
  const risk = byId("gov-risk");
  const ceo = byId("gov-ceo");
  const domains = nodes.filter((node) => node.parent === "gov-ceo");
  const domainPositions = ["left-[105px]", "left-[318px]", "left-[531px]", "left-[744px]", "left-[957px]"];
  if (!chair || !board || !audit || !risk || !ceo) return null;

  const card = (node: VisualNode, className: string) => (
    <div className={cn("absolute", className)}>
      <VisualNodeCard node={node} selected={selected === node.id} onSelect={() => setSelected(node.id)} />
    </div>
  );

  return (
    <div className="relative h-[770px] w-[1260px]" aria-label="Governance approval hierarchy">
      {/* Chair → Board */}
      <div aria-hidden className="absolute left-[629px] top-[112px] h-[150px] w-px bg-border" />
      {/* Board → horizontal branch line */}
      <div aria-hidden className="absolute left-[629px] top-[374px] h-[40px] w-px bg-border" />
      {/* Horizontal branch line + verticals down to Audit / Risk / CEO */}
      <div aria-hidden className="absolute left-[283px] top-[414px] h-px w-[692px] bg-border" />
      <div aria-hidden className="absolute left-[283px] top-[414px] h-[30px] w-px bg-border" />
      <div aria-hidden className="absolute left-[503px] top-[414px] h-[30px] w-px bg-border" />
      <div aria-hidden className="absolute left-[975px] top-[414px] h-[30px] w-px bg-border" />
      {/* CEO → domain branch line */}
      <div aria-hidden className="absolute left-[975px] top-[556px] h-[40px] w-px bg-border" />
      {/* Domain branch line + verticals down to each domain */}
      <div aria-hidden className="absolute left-[199px] top-[596px] h-px w-[852px] bg-border" />
      {domains.map((node, index) => {
        const left = 105 + index * 213;
        return (
          <div key={node.id}>
            <div aria-hidden className="absolute top-[596px] h-[30px] w-px bg-border" style={{ left: left + 94 }} />
            {card(node, cn("top-[626px]", domainPositions[index]))}
          </div>
        );
      })}
      {card(chair, "left-[536px] top-0")}
      {card(board, "left-[536px] top-[262px]")}
      {card(audit, "left-[189px] top-[444px]")}
      {card(risk, "left-[409px] top-[444px]")}
      {card(ceo, "left-[881px] top-[444px]")}
      <span className="absolute left-[739px] top-[386px] -translate-x-1/2 rounded-full border border-border/70 bg-card px-3 py-1 text-[10px] font-semibold uppercase text-muted-foreground">Approval branches</span>
      <span className="absolute left-[518px] top-[568px] -translate-x-1/2 rounded-full border border-border/70 bg-card px-3 py-1 text-[10px] font-semibold uppercase text-muted-foreground">Domain authority</span>
    </div>
  );
}

function VisualMap({ lens, selected, setSelected }: { lens: Lens; selected: string; setSelected: (id: string) => void }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const transformRef = useRef<ReactZoomPanPinchRef>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const nodes = useMemo(() => getVisualNodes(lens), [lens]);
  const roots = useMemo(() => nodes.filter((node) => node.parent === null), [nodes]);

  useEffect(() => {
    transformRef.current?.centerView(0.72, 0);
  }, [lens]);

  useEffect(() => {
    const updateFullscreen = () => setIsFullscreen(document.fullscreenElement === mapRef.current);
    document.addEventListener("fullscreenchange", updateFullscreen);
    return () => document.removeEventListener("fullscreenchange", updateFullscreen);
  }, []);

  const toggleFullscreen = async () => {
    if (document.fullscreenElement === mapRef.current) {
      await document.exitFullscreen();
    } else if (mapRef.current) {
      await mapRef.current.requestFullscreen();
    }
    requestAnimationFrame(() => transformRef.current?.centerView(0.72, 250));
  };

  return (
    <div ref={mapRef} className="flex flex-col overflow-hidden rounded-xl bg-card fullscreen:h-screen fullscreen:rounded-none">
      <TransformWrapper
        ref={transformRef}
        initialScale={0.72}
        minScale={0.35}
        maxScale={2}
        centerOnInit
        limitToBounds={false}
        wheel={{ step: 0.08 }}
        doubleClick={{ disabled: true }}
      >
        {({ zoomIn, zoomOut, centerView, resetTransform }) => (
          <>
            <div className={cn("relative h-[480px] overflow-hidden bg-muted/20", isFullscreen && "min-h-0 flex-1")} aria-label={`${lens} hierarchy visual map`}>
              <TransformComponent
                wrapperClass="!h-full !w-full cursor-grab active:cursor-grabbing"
                contentClass="!w-max"
                wrapperStyle={{ width: "100%", height: "100%" }}
              >
                <div className="flex min-h-[620px] min-w-max items-start justify-start gap-12 px-16 py-12">
                  {lens === "governance"
                    ? <GovernanceVisualMap nodes={nodes} selected={selected} setSelected={setSelected} />
                    : roots.map((root) => <VisualBranch key={root.id} node={root} nodes={nodes} selected={selected} setSelected={setSelected} />)}
                </div>
              </TransformComponent>
              <div className="pointer-events-none absolute bottom-4 right-4 rounded-lg border border-border/70 bg-card/90 px-2 py-1 text-[11px] text-muted-foreground shadow-[var(--shadow-soft)] backdrop-blur">
                Drag to pan · Scroll to zoom
              </div>
            </div>
            <TooltipProvider delayDuration={200}>
              <div className="flex min-h-14 items-center justify-between gap-3 border-t border-border/70 bg-card px-3 py-2">
                <div className="flex items-center gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => zoomOut()} aria-label="Zoom out"><Minus className="h-4 w-4" /></Button></TooltipTrigger>
                    <TooltipContent>Zoom out</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => zoomIn()} aria-label="Zoom in"><Plus className="h-4 w-4" /></Button></TooltipTrigger>
                    <TooltipContent>Zoom in</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => centerView(0.72, 250)} aria-label="Fit map to view"><Focus className="h-4 w-4" /></Button></TooltipTrigger>
                    <TooltipContent>Fit to view</TooltipContent>
                  </Tooltip>
                  <Button variant="ghost" size="sm" className="ml-1 text-xs text-muted-foreground" onClick={() => resetTransform(250)}>Reset</Button>
                </div>
                <Button variant="outline" size="sm" onClick={toggleFullscreen} className="gap-2">
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  {isFullscreen ? "Exit full view" : "View full"}
                </Button>
              </div>
            </TooltipProvider>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}

function PanelHeader({ kind, title, subtitle, icon: Icon }: { kind: string; title: string; subtitle: string; icon: typeof Building2 }) {
  return (
    <div className="border-b border-border/70 pb-4">
      <span className="grid h-10 w-10 place-items-center rounded-xl border border-border/70 bg-[image:var(--gradient-surface)]"><Icon className="h-5 w-5 text-primary" /></span>
      <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{kind}</p>
      <h2 className="mt-1 text-lg font-semibold leading-tight">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function Stats({ items }: { items: [string, string][] }) {
  return (
    <dl className="mt-4 grid gap-2">
      {items.map(([label, value]) => (
        <div key={label} className="flex items-center justify-between rounded-lg border border-border/70 bg-card/60 px-3 py-2.5 text-sm">
          <dt className="text-muted-foreground">{label}</dt>
          <dd className="font-semibold">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function DetailPanel({ selected, lens }: { selected: string; lens: Lens }) {
  if (selected.startsWith("none:")) {
    const company = companyById(selected.slice(5));
    const count = EMPLOYEES.filter((employee) => employee.company === company?.id && !employee.department).length;
    return (
      <>
        <PanelHeader icon={ShieldAlert} kind="Data gap" title="No department" subtitle={`${count} employees at ${company?.name} are on the payroll but have no place in the structure.`} />
        <Button asChild className="mt-4 w-full rounded-lg"><Link to="/organization/employees" search={{ company: company?.id, department: undefined, unplaced: true }}>Review these employees</Link></Button>
      </>
    );
  }

  const body = governanceById(selected);
  if (body) {
    const roles = ROLES.filter((role) => role.body === body.id);
    return (
      <>
        <PanelHeader icon={ShieldAlert} kind={body.kind} title={body.name} subtitle="Part of the governance hierarchy. Positions here carry approval authority." />
        <h3 className="mb-2 mt-5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Positions here</h3>
        <div className="grid gap-2">
          {roles.length ? roles.map((role) => {
            const holder = EMPLOYEES.find((employee) => employee.governanceRole === role.id);
            return (
              <Link key={role.id} to="/organization/roles/$roleId" params={{ roleId: role.id }} className="grid min-w-0 gap-1.5 rounded-lg border border-border/70 bg-card/60 px-3 py-2.5 text-sm transition-colors hover:border-primary/40">
                <span className="min-w-0 truncate font-medium" title={role.name}>{role.name}</span>
                <span className={cn("flex min-w-0 items-center gap-1.5 text-xs", holder ? "text-muted-foreground" : "text-destructive")}>
                  <UserRound className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate" title={holder?.name ?? "Vacant"}>{holder?.name ?? "Vacant"}</span>
                </span>
              </Link>
            );
          }) : <p className="text-sm text-muted-foreground">No positions defined here.</p>}
        </div>
      </>
    );
  }

  const department = departmentById(selected);
  if (department) {
    const count = departmentDescendants(department.id).reduce((sum, id) => sum + EMPLOYEES.filter((employee) => employee.department === id).length, 0);
    const headPosition = ROLES.find((role) => role.department === department.id && role.head);
    const head = EMPLOYEES.find((employee) => employee.role === headPosition?.id);
    const roles = ROLES.filter((role) => role.department === department.id);
    return (
      <>
        <PanelHeader icon={Users} kind="Department" title={department.name} subtitle={`Inside ${companyById(department.company)?.name}`} />
        <Stats items={[["Employees", String(count)], ["Head", head?.name ?? "Not assigned"], ["Positions defined", String(roles.length)]]} />
        <h3 className="mb-2 mt-5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Positions here</h3>
        <div className="grid gap-2">
          {roles.map((role) => (
            <Link key={role.id} to="/organization/roles/$roleId" params={{ roleId: role.id }} className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-card/60 px-3 py-2.5 text-sm transition-colors hover:border-primary/40">
              <span className="min-w-0 truncate font-medium">{role.name}</span>
              <span className="shrink-0 text-xs text-muted-foreground">{EMPLOYEES.filter((employee) => employee.role === role.id).length || "Vacant"}</span>
            </Link>
          ))}
        </div>
        <Button asChild variant="outline" className="mt-4 w-full rounded-lg"><Link to="/organization/employees" search={{ company: department.company, department: department.id, unplaced: false }}>View employees</Link></Button>
      </>
    );
  }

  const company = companyById(selected);
  if (company) {
    const own = EMPLOYEES.filter((employee) => employee.company === company.id).length;
    const total = companyDescendants(company.id).reduce((sum, id) => sum + EMPLOYEES.filter((employee) => employee.company === id).length, 0);
    const departments = DEPARTMENTS.filter((item) => item.company === company.id && !item.parent);
    return (
      <>
        <PanelHeader icon={Building2} kind="Entity" title={company.name} subtitle={`${company.kind} · registered in ${company.country} · founded ${company.established}`} />
        <Stats items={[["Employed here", String(own)], ["With subsidiaries", String(total)], ["Departments", String(departments.length)]]} />
        {lens === "operations" && <Button asChild variant="outline" className="mt-4 w-full rounded-lg"><Link to="/organization/employees" search={{ company: company.id, department: undefined, unplaced: false }}>View employees</Link></Button>}
      </>
    );
  }

  return <p className="text-sm text-muted-foreground">Select something on the left.</p>;
}

export function StructurePage() {
  const [lens, setLens] = useState<Lens>("legal");
  const [selected, setSelected] = useState("ent-hold");
  const active = LENSES.find((item) => item.id === lens) ?? LENSES[0];
  const switchLens = (next: Lens) => { setLens(next); setSelected(next === "governance" ? "gov-chair" : "ent-hold"); };

  return (
    <>
      <PageHeader breadcrumbs={[{ label: "Organization" }, { label: "Structure" }]} title={active.name} />
      <div className="mb-5 flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
        <div className="inline-flex max-w-full gap-1 overflow-x-auto rounded-xl border border-border/70 bg-card/70 p-1 shadow-[var(--shadow-soft)]">
          {LENSES.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => switchLens(item.id)}
              aria-pressed={lens === item.id}
              className={cn(
                "governos-tab-trigger whitespace-nowrap rounded-lg px-4",
                lens === item.id ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary hover:text-primary-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Button>
          ))}
        </div>
      </div>
      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Card key={lens} className="governos-tab-content overflow-hidden rounded-2xl border-border/70 p-2 shadow-[var(--shadow-soft)]">
          <VisualMap lens={lens} selected={selected} setSelected={setSelected} />
        </Card>
        <Card className="rounded-2xl border-border/70 p-5 shadow-[var(--shadow-soft)] xl:sticky xl:top-24">
          <DetailPanel selected={selected} lens={lens} />
        </Card>
      </div>
    </>
  );
}
