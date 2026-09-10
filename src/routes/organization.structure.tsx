import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/shell";
import { StructurePage } from "@/components/admin/organization-structure";
export const Route = createFileRoute("/organization/structure")({
  head: () => ({ meta: [{ title: "Organization Structure — Govern OS" }, { name: "description", content: "Explore the group's legal ownership, operations and governance hierarchies." }, { property: "og:title", content: "Organization Structure — Govern OS" }, { property: "og:description", content: "Explore legal, operational and governance structures." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: () => <AdminShell><StructurePage/></AdminShell>,
});
