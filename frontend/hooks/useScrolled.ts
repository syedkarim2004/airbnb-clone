import { useSyncExternalStore } from "react";

/**
 * Performant hook that tracks whether the window is scrolled past a threshold.
 * Uses useSyncExternalStore for efficient, tearing-free subscription to window scroll.
 * Only triggers re-renders when the boolean threshold crossing actually changes.
 */
export function useScrolled(threshold: number = 70): boolean {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener("scroll", callback, { passive: true });
      document.addEventListener("scroll", callback, { passive: true });
      return () => {
        window.removeEventListener("scroll", callback);
        document.removeEventListener("scroll", callback);
      };
    },
    () => {
      if (typeof window === "undefined") return false;
      const scrollY =
        window.scrollY ||
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
      return scrollY > threshold;
    },
    () => false
  );
}
