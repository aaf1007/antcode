import { themeScript } from "@/components/theme/theme";
import assert from "node:assert/strict";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

// Run the actual pre-paint script: a broken fallback or preference precedence
// would make visitors see the wrong theme before React loads.
for (const scenario of [
  { name: "uses a dark system preference on first visit", saved: null, dark: true, expected: "dark" },
  { name: "uses a light system preference on first visit", saved: null, dark: false, expected: "light" },
  { name: "keeps an explicit light choice on a dark system", saved: "light", dark: true, expected: "light" },
  { name: "keeps an explicit dark choice on a light system", saved: "dark", dark: false, expected: "dark" },
  { name: "ignores invalid stored preferences", saved: "invalid", dark: true, expected: "dark" },
  { name: "works when browser storage is blocked", saved: null, dark: true, blocked: true, expected: "dark" },
]) {
  test(scenario.name, () => {
    const root = { dataset: {} as Record<string, string> };

    runInNewContext(themeScript, {
      document: { documentElement: root },
      window: {
        matchMedia: () => ({ matches: scenario.dark }),
        localStorage: {
          getItem(key: string) {
            if (scenario.blocked) throw new Error("Storage blocked");
            return key === "antcode-theme" ? scenario.saved : null;
          },
        },
      },
    });

    assert.equal(root.dataset.theme, scenario.expected);
  });
}