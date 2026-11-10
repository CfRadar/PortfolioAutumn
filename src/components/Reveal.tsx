import { useEffect, useRef, useState } from "react";
import type { ElementType, ReactNode } from "react";

interface Props {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

/** Fades its children in the first time they scroll into view. */
export default function Reveal({ as: Tag = "div", className = "", children }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => {
        if (es[0].isIntersecting) {
          setVis(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`rv ${vis ? "vis" : ""} ${className}`.trim()}>
      {children}
    </Tag>
  );
}
