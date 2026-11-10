import { QUESTS, SIDE_QUESTS } from "../data";
import type { Quest as QuestT } from "../types";
import Reveal from "./Reveal";

function Quest({ q, i }: { q: QuestT; i: number }) {
  return (
    <Reveal as="article" className="q pxb">
      <div className="in">
        <div className="top">
          <div className="lab">QUEST 0{i + 1}</div>
          <span className={`rar r-${q.k}`}>{q.r}</span>
        </div>
        <h3>{q.t}</h3>
        <div className="m">{q.m}</div>
        <p className="d">{q.d}</p>
        <div className="rw">REWARD: {q.s}</div>
        <div className="tg">{q.g.map((x) => <span key={x}>{x}</span>)}</div>
        <div className="act">
          {q.l && <a className="btn" href={q.l} target="_blank" rel="noopener noreferrer">{q.n}</a>}
          {q.c && <a className={`btn${q.l ? " alt" : ""}`} href={q.c} target="_blank" rel="noopener noreferrer">CODE</a>}
        </div>
      </div>
    </Reveal>
  );
}

export default function Projects() {
  return (
    <section id="projects">
      <div className="wrap">
        <div className="head">
          <div>
            <div className="lab">QUEST BOARD</div>
            <h2>PROJECTS</h2>
          </div>
        </div>
        <p className="hint">Eight main quests, then the side quests below.</p>
        <div className="grid">
          {QUESTS.map((q, i) => <Quest key={q.t} q={q} i={i} />)}
        </div>
        <div className="lab" style={{ marginTop: 44 }}>SIDE QUESTS</div>
        <div className="side">
          {SIDE_QUESTS.map((s) => (
            <Reveal key={s.t} className="sq pxb">
              <h4>{s.t}</h4>
              <p>{s.d}</p>
              <div className="tg">{s.g.map((x) => <span key={x}>{x}</span>)}</div>
              {s.l && <a href={s.l} target="_blank" rel="noopener noreferrer">{s.n} ►</a>}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
