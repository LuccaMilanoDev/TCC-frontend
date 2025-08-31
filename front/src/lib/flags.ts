// Simple feature flag utilities for simulating the problem user
// Usage: add `?pu=1` to the URL or set localStorage.setItem('problemUser','1')

export function isProblemUser(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.get("pu") === "1") return true;
    const ls = window.localStorage.getItem("problemUser");
    return ls === "1" || ls === "true";
  } catch {
    return false;
  }
}

export function setProblemUser(enabled: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("problemUser", enabled ? "1" : "0");
}
