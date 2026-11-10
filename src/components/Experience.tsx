import { JOBS, WINS } from "../data";
import Reveal from "./Reveal";

export default function Experience() {
  return (
    <section id="experience">
      <div className="wrap">
        <div className="lab">QUEST LOG</div>
        <h2>EXPERIENCE</h2>
        <p className="hint">Checkpoints reached, newest first.</p>
        <div className="log">
          {JOBS.map((j) => (
            <Reveal className="ev" key={j.title}>
              <div className="box pxb">
                <h3>{j.title}</h3>
                <div className="m">{j.meta}</div>
                <ul>
                  {j.bullets.map((b) => <li key={b}>{b}</li>)}
                  {j.link && (
                    <li><a href={j.link.href} target="_blank" rel="noopener noreferrer">{j.link.label}</a></li>
                  )}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="lab" style={{ marginTop: 56 }}>ACHIEVEMENTS UNLOCKED</div>
        <ul className="wins">
          {WINS.map(([title, detail]) => (
            <Reveal as="li" key={title}>
              <b>{title}</b>
              {detail}
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
