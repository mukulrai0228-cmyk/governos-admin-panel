import { createFileRoute } from "@tanstack/react-router";
import { RoleDetailPage } from "@/components/admin/organization-pages";
export const Route = createFileRoute("/organization/roles/$roleId")({
  head: () => ({ meta: [{ title: "Position Details — Govern OS" }, { name: "description", content: "Position authority, assignment status and governance document ownership." }, { property: "og:title", content: "Position Details — Govern OS" }, { property: "og:description", content: "Position assignment and document ownership details." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Page,
});
function Page() { const { roleId } = Route.useParams(); return <RoleDetailPage roleId={roleId}/>; }
