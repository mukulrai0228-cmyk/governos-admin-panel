const AUTH_KEY = "governos-demo-auth";

export function isAuthenticated() {
  return typeof window !== "undefined" && localStorage.getItem(AUTH_KEY) === "true";
}

export function setAuthenticated() {
  if (typeof window !== "undefined") localStorage.setItem(AUTH_KEY, "true");
}

export function clearAuthentication() {
  if (typeof window !== "undefined") localStorage.removeItem(AUTH_KEY);
}
