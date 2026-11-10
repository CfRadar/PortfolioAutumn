import { useEffect, useRef, useState } from "react";
import SoundButton from "./SoundButton";

const LINKS: [id: string, label: string][] = [
  ["projects", "PROJECTS"],
  ["about", "PROFILE"],
  ["skills", "SKILLS"],
  ["experience", "LOG"],
  ["certs", "CERTS"],
  ["contact", "SAVE"],
];

export default function Nav() {
  const [active, setActive] = useState("");
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const upd = (): void => {
      const h = document.documentElement;
      const max = h.scrollHeight - innerHeight;
      if (bar.current) bar.current.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + "%";
    };
    upd();
    addEventListener("scroll", upd, { passive: true });
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    document.querySelectorAll("section").forEach((s) => io.observe(s));
    return () => {
      removeEventListener("scroll", upd);
      io.disconnect();
    };
  }, []);

  return (
    <>
      <nav aria-label="Sections">
        <div className="brand-wrap">
          <a href="#home" className="brand-logo">
            <span className="brand-badge">AY</span>
            <span className="brand-name">ANURAG YADAV</span>
          </a>
        </div>
        <div className="nav-links">
          {LINKS.map(([id, label]) => (
            <a key={id} href={`#${id}`} className={active === id ? "on" : ""}>
              {label}
            </a>
          ))}
        </div>
        <div className="nav-actions">
          <SoundButton />
        </div>
      </nav>
      <div className="xp" ref={bar} />
    </>
  );
}
