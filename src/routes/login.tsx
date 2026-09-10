import { createFileRoute } from "@tanstack/react-router";
import { LoginScreen } from "@/components/admin/login-screen";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Govern OS" },
      { name: "description", content: "Sign in to the Govern OS workspace." },
    ],
  }),
  component: LoginScreen,
});
