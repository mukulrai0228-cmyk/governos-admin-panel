import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/organization/departments")({
  beforeLoad: () => { throw redirect({ to: "/organization/structure" }); },
  component: () => null,
});