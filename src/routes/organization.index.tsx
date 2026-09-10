import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/organization/")({
  beforeLoad: () => {
    throw redirect({ to: "/organization/employees", search: { company: undefined, department: undefined, unplaced: false } });
  },
});
