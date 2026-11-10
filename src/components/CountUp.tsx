import { useEffect, useRef, useState } from "react";
import { REDUCE } from "../lib";

/** Counts a value like "1,500+" up from zero once it is visible. */
export default function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLElement>(null);
  const [text, setText] = useState(value);

  useEffect(() => {
    const el = ref.current;
    const m = value.match(/^([\d,]+)(.*)$/);
    if (!el || !m || REDUCE) return;
    const n = Number(m[1].replace(/,/g, ""));
    const commas = m[1].includes(",");
    let iv: number | undefined;
    const io = new IntersectionObserver((es) => {
      if (!es[0].isIntersecting) return;
      io.disconnect();
      let k = 0;
      iv = window.setInterval(() => {
        k = Math.min(n, k + Math.ceil(n / 24));
        setText((commas ? k.toLocaleString("en-US") : String(k)) + m[2]);
        if (k >= n) window.clearInterval(iv);
      }, 40);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      if (iv !== undefined) window.clearInterval(iv);
    };
  }, [value]);

  return <b ref={ref}>{text}</b>;
}
