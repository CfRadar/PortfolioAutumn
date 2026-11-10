import { useEffect, useRef } from "react";
import { STATS } from "../data";
import { PF } from "../sprites";
import CountUp from "./CountUp";
import Reveal from "./Reveal";

function Portrait() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(PF[0], 0, 0, 90, 130);
  }, []);
  return (
    <div className="port pxb">
      <canvas ref={ref} width={90} height={130} style={{ width: 180, height: 260 }} role="img" aria-label="Pixel portrait" />
    </div>
  );
}

export default function About() {
  return (
    <section id="about">
      <div className="wrap pf">
        <Portrait />
        <Reveal>
          <div className="lab">PLAYER PROFILE</div>
          <h2>ABOUT</h2>
          <p>I'm a B.Tech student in Electronics and Telecommunication at IET DAVV, Indore (2024 to 2028). I like building close to the metal, then wrapping it in an interface people enjoy using.</p>
          <p>My main project, NovaCPP, is a C++17 framework that ships UI and backend in one executable and has passed 1,800+ npm downloads. Around it I build React and Node apps, a browser OS, computer-vision bots and reinforcement-learning experiments. I lead 8+ hackathon teams to podium finishes, run DSA sessions as GDG DSA Lead, and I'm open to internships and collaborations.</p>
          <div id="stats">
            {STATS.map(([label, value, on]) => (
              <div className="st" key={label}>
                <span>{label}</span>
                <div className="bar">
                  {Array.from({ length: 10 }, (_, i) => <i key={i} className={i < on ? "on" : ""} />)}
                </div>
                <CountUp value={value} />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
