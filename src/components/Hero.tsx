import { useCallback, useEffect, useRef, useState } from "react";
import { startScene } from "../scene";
import { REDUCE } from "../lib";
import { DIALOGUES } from "../data";

const goProjects = (): void =>
  document.getElementById("projects")?.scrollIntoView({ behavior: REDUCE ? "auto" : "smooth" });

export default function Hero() {
  const host = useRef<HTMLElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const [diagIdx, setDiagIdx] = useState(0);
  const [msg, setMsg] = useState(REDUCE ? DIALOGUES[0] : "");
  const [isTyping, setIsTyping] = useState(!REDUCE);

  useEffect(() => {
    if (!cv.current || !host.current) return;
    return startScene(cv.current, host.current, REDUCE);
  }, []);

  useEffect(() => {
    if (REDUCE) {
      setMsg(DIALOGUES[diagIdx]);
      setIsTyping(false);
      return;
    }
    const target = DIALOGUES[diagIdx];
    let i = 0;
    setMsg("");
    setIsTyping(true);
    const iv = window.setInterval(() => {
      i++;
      setMsg(target.slice(0, i));
      if (i >= target.length) {
        window.clearInterval(iv);
        setIsTyping(false);
      }
    }, 22);
    return () => window.clearInterval(iv);
  }, [diagIdx]);

  const advanceDialogue = useCallback(() => {
    const target = DIALOGUES[diagIdx];
    if (isTyping) {
      setMsg(target);
      setIsTyping(false);
    } else {
      setDiagIdx((prev) => (prev + 1) % DIALOGUES.length);
    }
  }, [diagIdx, isTyping]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (scrollY < 80 && (e.key === "Enter" || e.key === " ")) {
        if (document.activeElement?.tagName !== "BUTTON" && document.activeElement?.tagName !== "A") {
          e.preventDefault();
          advanceDialogue();
        }
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [advanceDialogue]);

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
      <div
        className="dlg pxb"
        role="button"
        tabIndex={0}
        onClick={advanceDialogue}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            advanceDialogue();
          }
        }}
        aria-label="Click to advance dialogue"
      >
        <div className="dlg-head">
          <b>ANURAG</b>
          <span className="dlg-step">{diagIdx + 1}/{DIALOGUES.length}</span>
        </div>
        <p aria-live="polite">{msg}</p>
        <div className="dlg-foot">
          <span className="dlg-hint">[CLICK TO {isTyping ? "SKIP" : diagIdx + 1 === DIALOGUES.length ? "REPLAY" : "CONTINUE"}]</span>
          <i>▼</i>
        </div>
      </div>
    </header>
  );
}
