import { useEffect, useLayoutEffect, useRef, useState } from "react";

export function useIsMultiLine<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [isMulti, setIsMulti] = useState(false);

  useLayoutEffect(() => {
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

    let raf = 0;
    const onResize = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return { ref, isMulti } as const;
}
