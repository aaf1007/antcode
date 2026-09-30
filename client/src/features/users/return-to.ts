export function safeReturnTo(value: string | null): string {
  if (!value?.startsWith("/") || value.includes("\\")) return "/problem";
  const appOrigin = "https://antcode.invalid";
  try {
    const destination = new URL(value, appOrigin);
    // Dot-segment normalization can turn "/.//evil.com" into "//evil.com", a protocol-relative URL.
    if (destination.pathname.startsWith("//") || destination.pathname.includes("\\")) return "/problem";
    const routePath = decodeURIComponent(destination.pathname).replace(/\/+$/, "").toLowerCase();
    if (destination.origin !== appOrigin || routePath === "/sign-in" || routePath === "/sign-up") {
      return "/problem";
    }
    return `${destination.pathname}${destination.search}${destination.hash}`;
  } catch {
    return "/problem";
  }
}
