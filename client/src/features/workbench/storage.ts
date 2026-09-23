import type { WorkbenchLanguageSlug } from "@/features/problems/problem.types";

const memory = new Map<string, string>();

export function draftKey(problemId: string, language: WorkbenchLanguageSlug): string {
  return `antcode:draft:v1:${problemId}:${language}`;
}

export function customInputKey(problemId: string): string {
  return `antcode:custom-input:v1:${problemId}`;
}

export function readPersisted(key: string, fallback: string): string {
  try {
    const value = window.localStorage.getItem(key);
    if (value !== null) {
      memory.set(key, value);
      return value;
    }
  } catch {
    // In-memory drafts keep the workbench usable when storage is unavailable.
  }
  return memory.get(key) ?? fallback;
}

export function writePersisted(key: string, value: string): void {
  memory.set(key, value);
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // The in-memory copy remains available for this session.
  }
}
