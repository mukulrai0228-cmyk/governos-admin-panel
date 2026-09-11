import { AnimatePresence, motion, useMotionValue, useTransform } from "motion/react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useLayoutEffect, useState, type FormEvent, type MouseEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import logo from "@/assets/governors-logo.svg";
import { BRANDS, DEFAULT_BRAND_ID, applyBrand } from "./brand-switcher";
import { setAuthenticated } from "@/lib/auth";
import { WarpStripesBackground } from "./warp-stripes-background";

export const DEMO_LOGIN = {
  email: "demo@governos.com",
  password: "GovernOS2026!",
} as const;
function initializeLoginTheme() {
  const brandId = localStorage.getItem("admin-brand") ?? DEFAULT_BRAND_ID;
  const brand = BRANDS.find((item) => item.id === brandId) ?? BRANDS.find((item) => item.id === DEFAULT_BRAND_ID) ?? BRANDS[0];
  applyBrand(brand);

  // Login always uses the dark glass treatment, independently of the workspace preference.
  document.documentElement.classList.add("dark");
  document.documentElement.dataset.theme = "dark";
}

export function LoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-260, 260], [7, -7]);
  const rotateY = useTransform(mouseX, [-360, 360], [-7, 7]);

  useLayoutEffect(() => {
    initializeLoginTheme();
  }, []);

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set(event.clientX - rect.left - rect.width / 2);
    mouseY.set(event.clientY - rect.top - rect.height / 2);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const isValidDemoLogin = email.trim().toLowerCase() === DEMO_LOGIN.email && password === DEMO_LOGIN.password;
    if (!isValidDemoLogin) {
      setError("Use the demo email and password provided for this preview.");
      return;
    }

    setError("");
    setAuthenticated();
    setIsLoading(true);
    window.setTimeout(() => {
      setIsLoading(false);
      void navigate({ to: "/" });
    }, 900);
  }

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background/75 px-4 py-12 text-foreground sm:px-6 sm:py-16"
    >
      <WarpStripesBackground />
      <div className="pointer-events-none absolute inset-0 bg-background/45" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_76%)]" />
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent"
        animate={{ x: ["-35%", "35%", "-35%"], opacity: [0.25, 0.8, 0.25] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="relative z-10 w-full max-w-[500px]"
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        style={{ perspective: 1300 }}
      >
        <motion.div
          style={{ rotateX, rotateY }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
        >
          <div className="group relative">
            <motion.div
              className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-r from-transparent via-foreground/30 to-transparent opacity-0 blur-sm transition-opacity duration-500 group-hover:opacity-35"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: "220% 100%" }}
            />
            <section className="relative overflow-hidden rounded-2xl border border-foreground/20 bg-card/32 p-8 shadow-[0_24px_80px_color-mix(in_oklab,var(--background)_45%,transparent)] backdrop-blur-3xl sm:p-10">
              <motion.div
                className="pointer-events-none absolute left-0 top-0 h-px w-1/2 bg-gradient-to-r from-transparent via-foreground/55 to-transparent"
                animate={{ left: ["-50%", "100%"], opacity: [0.08, 0.28, 0.08] }}
                transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
              />

              <div className="mb-9 text-center">
                <motion.img
                  src={logo}
                  alt="Govern OS"
                  className="mx-auto h-11 w-auto object-contain brightness-0 invert"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.45 }}
                />
                <motion.h1
                  className="mt-5 text-2xl font-semibold tracking-tight"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22, duration: 0.45 }}
                >
                  Welcome back
                </motion.h1>
                <motion.p
                  className="mt-1.5 text-sm text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.45 }}
                >
                  Sign in to continue to Govern OS.
                </motion.p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <label className="block space-y-3">
                  <span className="text-sm font-medium text-foreground">Email address</span>
                  <span className="relative block">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors peer-focus:text-primary" />
                    <Input
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setError("");
                      }}
                      placeholder="you@company.com"
                      className="peer h-12 rounded-xl border-border/80 bg-background/45 pl-10 transition-[border-color,box-shadow,background-color] focus:bg-background/70 focus:ring-2 focus:ring-primary/20"
                    />
                  </span>
                </label>

                <label className="block space-y-3">
                  <span className="text-sm font-medium text-foreground">Password</span>
                  <span className="relative block">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors peer-focus:text-primary" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        setError("");
                      }}
                      placeholder="Enter your password"
                      className="peer h-12 rounded-xl border-border/80 bg-background/45 pl-10 pr-10 transition-[border-color,box-shadow,background-color] focus:bg-background/70 focus:ring-2 focus:ring-primary/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </span>
                </label>

                <div className="flex items-center gap-4 pt-2 text-xs">
                  <label className="inline-flex cursor-pointer items-center gap-2 text-muted-foreground hover:text-foreground">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                      className="h-4 w-4 rounded border-border bg-background accent-primary"
                    />
                    Remember me
                  </label>
                </div>

                {error && <p className="text-xs text-destructive" role="alert">{error}</p>}

                <Button type="submit" disabled={isLoading} className="group relative h-12 w-full overflow-hidden rounded-xl">
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  <AnimatePresence mode="wait" initial={false}>
                    {isLoading ? (
                      <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/80 border-t-transparent" />
                    ) : (
                      <motion.span key="label" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-2">
                        Sign in <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </form>

              <p className="mt-8 text-center text-xs text-muted-foreground">
                Secure workspace access for authorized Govern OS users.
              </p>
            </section>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}
