import { useEffect, useRef } from "react";
import { startScene } from "../scene";
import { REDUCE } from "../lib";

const goProjects = (): void =>
  document.getElementById("projects")?.scrollIntoView({ behavior: REDUCE ? "auto" : "smooth" });

export default function Hero() {
  const host = useRef<HTMLElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!cv.current || !host.current) return;
    return startScene(cv.current, host.current, REDUCE);
  }, []);

  return (
    <header id="home" ref={host}>
      <canvas id="scene" ref={cv} aria-hidden="true" />
      <div className="hc">
        <div className="hi">HI, I'M</div>
        <h1>ANURAG<br />YADAV</h1>
        <div className="tag">Systems programmer, full-stack developer and creator of NovaCPP</div>
        <div className="cta">
          <button className="start" type="button" onClick={goProjects}>PRESS START</button>
          <a className="btn alt" href="https://github.com/CfRadar" target="_blank" rel="noopener noreferrer">GITHUB</a>
        </div>
      </div>
    </header>
  );
}
