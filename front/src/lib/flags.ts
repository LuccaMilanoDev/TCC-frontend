// Simple feature flag utilities for simulating the problem user and performance user
// Usage: add `?pu=1` to the URL or set localStorage.setItem('problemUser','1')
// Usage: add `?perf=1` to the URL or set localStorage.setItem('performanceUser','1')

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

export function isPerformanceUser(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.get("perf") === "1") return true;
    const ls = window.localStorage.getItem("performanceUser");
    return ls === "1" || ls === "true";
  } catch {
    return false;
  }
}

export function setPerformanceUser(enabled: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("performanceUser", enabled ? "1" : "0");
}
