import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/shell";
export const Route = createFileRoute("/organization/roles")({
  component: () => <AdminShell><Outlet/></AdminShell>,
});
