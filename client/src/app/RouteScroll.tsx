import { useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router";

/** Preserve hash links, new-page scrolling, and back/forward scroll positions. */
export function RouteScroll() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const positions = useRef(new Map<string, [number, number]>());

  useLayoutEffect(() => {
    const saved = positions.current.get(location.key);
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    if (navigationType === "POP" && saved) {
      window.scrollTo({ left: saved[0], top: saved[1], behavior: "instant" });
    } else if (location.hash) {
      let id = location.hash.slice(1);
      try { id = decodeURIComponent(id); } catch { /* Use the literal hash. */ }
      // Initial history visits must finish before StrictMode replays this
      // effect; a smooth scroll would still be at the starting position.
      document.getElementById(id)?.scrollIntoView({
        behavior: navigationType === "POP" ? "instant" : "smooth",
      });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }

    const historyKey = location.key;
    const scrollPositions = positions.current;
    return () => {
      scrollPositions.set(historyKey, [window.scrollX, window.scrollY]);
      window.history.scrollRestoration = previousRestoration;
    };
  }, [location, navigationType]);

  return null;
}
