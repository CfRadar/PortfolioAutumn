import { useMemo, useState } from "react";
import { SKILLS } from "../data";

const TC = ["#D9622B", "#A8321F", "#E0B83A", "#5E6B3A", "#F2A541", "#8f4a1f"];

interface SkillItem {
  name: string;
  category: string;
  abbr: string;
  color: string;
}

export default function Skills() {
  const categories = Object.keys(SKILLS);
  const tabs = ["ALL", ...categories];
  const [tab, setTab] = useState("ALL");

  const allSkills: SkillItem[] = useMemo(() => {
    let colorIdx = 0;
    const items: SkillItem[] = [];
    for (const [cat, list] of Object.entries(SKILLS)) {
      list.forEach((name) => {
        const clean = name.replace(/[^A-Za-z0-9+]/g, "");
        const abbr = clean.slice(0, 2).toUpperCase() || "SK";
        items.push({
          name,
          category: cat,
          abbr,
          color: TC[colorIdx % TC.length],
        });
        colorIdx++;
      });
    }
    return items;
  }, []);

  const displayedSkills = useMemo(() => {
    if (tab === "ALL") return allSkills;
    return allSkills.filter((s) => s.category === tab);
  }, [tab, allSkills]);

  return (
    <section id="skills">
      <div className="wrap">
        <div className="skills-head">
          <div>
            <div className="lab">INVENTORY & PROFICIENCIES</div>
            <h2>SKILLS</h2>
          </div>
          <div className="skills-count-pill">
            TOTAL ITEMS: {displayedSkills.length}
          </div>
        </div>
        <p className="hint">
          Equipped tech stack spanning systems programming, machine learning, and full-stack web.
        </p>
        <div className="tabs" role="tablist">
          {tabs.map((t) => {
            const count = t === "ALL" ? allSkills.length : SKILLS[t]?.length ?? 0;
            return (
              <button
                key={t}
                role="tab"
                aria-selected={t === tab}
                onClick={() => setTab(t)}
                className={`tab-btn ${t === tab ? "active" : ""}`}
              >
                {t.toUpperCase()} <span className="tab-cnt">[{count}]</span>
              </button>
            );
          })}
        </div>
        <div className="slots pxb" role="tabpanel">
          {displayedSkills.map((s) => (
            <div className="slot" key={s.category + "-" + s.name}>
              <div className="slot-box" style={{ background: s.color }}>
                <span className="slot-abbr">{s.abbr}</span>
              </div>
              <span className="slot-name">{s.name}</span>
              <span className="slot-cat">{s.category}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
