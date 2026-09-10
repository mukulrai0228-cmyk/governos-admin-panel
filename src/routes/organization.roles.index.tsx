import { createFileRoute } from "@tanstack/react-router";
import { RolesPage } from "@/components/admin/organization-pages";
export const Route = createFileRoute("/organization/roles/")({
  head: () => ({ meta: [{ title: "Position Catalogue — Govern OS" }, { name: "description", content: "Operations and governance positions, assignments, authority and vacancies." }, { property: "og:title", content: "Position Catalogue — Govern OS" }, { property: "og:description", content: "Review organizational positions, vacancies and document ownership." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: RolesPage,
});
