import { useEffect } from "react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Divider from "./components/Divider";
import Projects from "./components/Projects";
import About from "./components/About";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Credentials from "./components/Credentials";
import Contact from "./components/Contact";
import MapleCursor from "./components/MapleCursor";
import AutumnAtmosphere from "./components/AutumnAtmosphere";
import { autumnAudio } from "./audio";

export default function App() {
  useEffect(() => {
    autumnAudio.ensureRunning();
  }, []);

  return (
    <>
      <MapleCursor />
      <AutumnAtmosphere />
      <Nav />
      <Hero />
      <Divider a="#1d1020" b="#2B1B2E" />
      <Projects />
      <Divider a="#2B1B2E" b="#3a2330" />
      <About />
      <Divider a="#3a2330" b="#2B1B2E" />
      <Skills />
      <Divider a="#2B1B2E" b="#3a2330" />
      <Experience />
      <Divider a="#3a2330" b="#2B1B2E" />
      <Credentials />
      <Divider a="#2B1B2E" b="#3a2330" />
      <Contact />
      <footer>
        <span className="lab">THANKS FOR PLAYING</span>
        <p className="cp">© 2026 Anurag Yadav</p>
      </footer>
    </>
  );
}
