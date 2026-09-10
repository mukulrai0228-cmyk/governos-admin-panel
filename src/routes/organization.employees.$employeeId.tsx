import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/shell";
import { EmployeeDetailPage } from "@/components/admin/organization-employee-detail";
export const Route = createFileRoute("/organization/employees/$employeeId")({
  head: () => ({ meta: [{ title: "Employee Profile — Govern OS" }, { name: "description", content: "Employee positions, reporting line and organizational details." }, { property: "og:title", content: "Employee Profile — Govern OS" }, { property: "og:description", content: "Employee positions and reporting details in Govern OS." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Page,
});
function Page() { const { employeeId } = Route.useParams(); return <AdminShell><EmployeeDetailPage employeeId={employeeId}/></AdminShell>; }
