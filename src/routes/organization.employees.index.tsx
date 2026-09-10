import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/shell";
import { EmployeesPage } from "@/components/admin/organization-pages";
export const Route = createFileRoute("/organization/employees/")({
  validateSearch: (search: Record<string, unknown>) => ({ company: typeof search.company === "string" ? search.company : undefined, department: typeof search.department === "string" ? search.department : undefined, unplaced: search.unplaced === true }),
  head: () => ({ meta: [{ title: "Employees — Govern OS" }, { name: "description", content: "Search employees, positions, departments, entities and locations across the group." }, { property: "og:title", content: "Employees — Govern OS" }, { property: "og:description", content: "Search employees and organizational assignments across the group." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Page,
});
function Page() { const filters = Route.useSearch(); return <AdminShell><EmployeesPage initialFilters={filters}/></AdminShell>; }
