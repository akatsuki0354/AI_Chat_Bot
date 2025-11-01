import { useEffect, useRef, useState } from "react";

export function useIsMultiLine<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [isMulti, setIsMulti] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const style = getComputedStyle(el);
      const lineHeight = style.lineHeight === "normal"
        ? parseFloat(style.fontSize) * 1.2
        : parseFloat(style.lineHeight);
      const lines = Math.round(el.scrollHeight / lineHeight);
      setIsMulti(lines > 1);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return { ref, isMulti } as const;
}
