import type { CSSProperties } from "react";

/** Checkerboard strip between sections. */
export default function Divider({ a, b }: { a: string; b: string }) {
  return <div className="dv" style={{ "--a": a, "--b": b } as CSSProperties} />;
}
