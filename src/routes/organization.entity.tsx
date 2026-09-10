import { createFileRoute } from "@tanstack/react-router";
import { redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/organization/entity")({
  beforeLoad: () => { throw redirect({ to: "/organization/structure" }); },
  head: () => ({
    meta: [
      { title: "Entity Structure — AAA Group Organization" },
      { name: "description", content: "Legal entity structure of AAA Holding and its ten group companies with headcount and establishment year." },
      { property: "og:title", content: "Entity Structure — AAA Group Organization" },
      { property: "og:description", content: "Legal entity structure of AAA Holding and its ten group companies." },
    ],
  }),
  component: () => null,
});
