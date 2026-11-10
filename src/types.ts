export interface Quest {
  k: "l" | "e" | "r";
  r: string;
  t: string;
  m: string;
  d: string;
  s: string;
  g: string[];
  l?: string;
  n?: string;
  c?: string;
}

export interface SideQuest {
  t: string;
  d: string;
  g: string[];
  l?: string;
  n?: string;
}

export type Stat = [label: string, value: string, filled: number];
export type Win = [title: string, detail: string];

export interface Job {
  title: string;
  meta: string;
  bullets: string[];
  link?: { href: string; label: string };
}

export interface Cert {
  label: string;
  title: string;
  meta: string;
  body?: string;
  id?: string;
}
