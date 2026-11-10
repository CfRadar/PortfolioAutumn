import { useEffect, useRef, useState } from "react";
import { CONTACT_LINKS, EMAIL_ADDRESS, GMAIL_URL, MAILTO_URL } from "../data";
import { FIRE } from "../sprites";

function EmailDispatch() {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(EMAIL_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <div className="email-dispatch pxb">
      <div className="email-top">
        <span className="email-tag">DIRECT EMAIL</span>
        {copied && <span className="email-copied-pill">COPIED TO CLIPBOARD!</span>}
      </div>

      <a
        href={GMAIL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="email-primary-btn"
        title="Directly compose email to anurag312006yadav@gmail.com in Gmail"
      >
        <span className="email-icon">✉</span>
        <span className="email-text">{EMAIL_ADDRESS}</span>
        <span className="email-cta">OPEN GMAIL ▶</span>
      </a>

      <div className="email-aux">
        <a href={MAILTO_URL} className="email-aux-btn" title="Open with default email client">
          DEFAULT MAIL APP
        </a>
        <button type="button" onClick={handleCopy} className="email-aux-btn copy-btn" title="Copy email address to clipboard">
          {copied ? "COPIED! ✓" : "COPY ADDRESS 📋"}
        </button>
      </div>
    </div>
  );
}

function Campfire() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    let frame = 0;
    let lastTime = performance.now();
    let flameTimer = 0;
    let raf = 0;
    let isVisible = true;

    const CW = cv.width;
    const CH = cv.height;
    const fireX = CW / 2 - FIRE[0].width / 2;
    const fireY = CH - FIRE[0].height - 8;

    const embers = Array.from({ length: 16 }, () => ({
      x: CW / 2 + (Math.random() - 0.5) * 36,
      y: fireY + 16 + Math.random() * 32,
      vx: (Math.random() - 0.5) * 0.35,
      vy: 0.45 + Math.random() * 0.75,
      life: Math.random() * 60,
      maxLife: 45 + Math.random() * 45,
      size: Math.random() < 0.35 ? 2 : 1,
      color: Math.random() < 0.6 ? "#F2A541" : Math.random() < 0.85 ? "#FFF7D6" : "#D9622B",
    }));

    const render = (ts: number) => {
      if (!isVisible) {
        raf = requestAnimationFrame(render);
        return;
      }
      const dt = Math.min(3, (ts - lastTime) / 16.6 || 1);
      lastTime = ts;

      flameTimer += dt * 16.6;
      if (flameTimer > 120) {
        flameTimer = 0;
        frame = (frame + 1) % FIRE.length;
      }

      ctx.clearRect(0, 0, CW, CH);

      // Ambient hearth glow
      const glowPulse = Math.sin(ts * 0.005) * 3 + Math.sin(ts * 0.012) * 2;
      const grad = ctx.createRadialGradient(
        CW / 2,
        fireY + FIRE[0].height - 8,
        4,
        CW / 2,
        fireY + FIRE[0].height - 8,
        46 + glowPulse
      );
      grad.addColorStop(0, "rgba(242, 165, 65, 0.32)");
      grad.addColorStop(0.5, "rgba(217, 98, 43, 0.14)");
      grad.addColorStop(1, "rgba(43, 27, 46, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(CW / 2, fireY + FIRE[0].height - 6, 50 + glowPulse, 16 + glowPulse * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Fire sprite
      ctx.drawImage(FIRE[frame], fireX | 0, fireY | 0);

      // Rising sparks / embers
      embers.forEach((e) => {
        e.y -= e.vy * dt;
        e.x += (e.vx + Math.sin(ts * 0.004 + e.life) * 0.3) * dt;
        e.life += dt;
        if (e.y < 8 || e.life >= e.maxLife) {
          e.x = CW / 2 + (Math.random() - 0.5) * 32;
          e.y = fireY + 24 + Math.random() * 24;
          e.life = 0;
          e.maxLife = 45 + Math.random() * 45;
        }
        ctx.fillStyle = e.color;
        ctx.fillRect(e.x | 0, e.y | 0, e.size, e.size);
      });

      raf = requestAnimationFrame(render);
    };

    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    io.observe(cv);

    raf = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return (
    <div className="campfire-host">
      <canvas ref={ref} width={130} height={130} style={{ width: 220, height: 220 }} aria-hidden="true" />
      <div className="save-beacon">REST AREA SAVED</div>
    </div>
  );
}

export default function Contact() {
  const otherLinks = CONTACT_LINKS.filter((l) => !l.href.includes("mail.google.com") && !l.href.startsWith("mailto:"));

  return (
    <section id="contact">
      <div className="wrap sv">
        <Campfire />
        <div>
          <div className="lab">SAVE POINT</div>
          <h2>CONTACT</h2>
          <p className="hint" style={{ marginBottom: 20 }}>Rest by the fire. Open to internships and collaborations.</p>
          <EmailDispatch />
          <div className="menu">
            {otherLinks.map((l) => (
              <a key={l.label} href={l.href} {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
