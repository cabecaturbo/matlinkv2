"use client";

import { useEffect, useRef, useState } from "react";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

// Debounced autosave: persists the latest value a short time after it stops
// changing. Skips the initial mount so loading a step doesn't trigger a write.
export function useAutosave<T>(
  value: T,
  save: (v: T) => Promise<{ error?: string } | void>,
  delay = 1200,
) {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const first = useRef(true);

  // Serialized value drives the effect; the effect closure captures `value`.
  const key = JSON.stringify(value);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setStatus("saving");
    const t = setTimeout(async () => {
      try {
        const res = await save(value);
        setStatus(res && "error" in res && res.error ? "error" : "saved");
      } catch {
        setStatus("error");
      }
    }, delay);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return status;
}
