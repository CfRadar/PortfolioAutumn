import { CERTS } from "../data";
import Reveal from "./Reveal";

export default function Credentials() {
  return (
    <section id="certs" style={{ background: "var(--plum)" }}>
      <div className="wrap">
        <div className="lab">TROPHY ROOM</div>
        <h2>CREDENTIALS</h2>
        <div className="cg">
          {CERTS.map((c) => (
            <Reveal className="cd pxb" key={c.title}>
              <div className="lab">{c.label}</div>
              <h3>{c.title}</h3>
              <div className="m">{c.meta}</div>
              {c.body && <p>{c.body}</p>}
              {c.id && <p className="id">{c.id}</p>}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
