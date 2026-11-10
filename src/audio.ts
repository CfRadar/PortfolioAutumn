/**
 * Soothing Autumn Indie Game Ambient Audio Engine
 * Pure Web Audio API synthesis - zero external assets or loading delays.
 *
 * Design:
 * - Continuous, calm, soothing indie RPG soundtrack (inspired by Animal Crossing, Stardew Valley, Minecraft).
 * - Warm kalimba / music box melody notes.
 * - Gentle nylon / Rhodes arpeggiated chord accompaniment (audible harmonics on laptop/phone speakers).
 * - Warm acoustic bass foundation.
 * - Cozy autumn wind whisper & hearth crackle.
 * - High-precision lookahead scheduler (no drift, no dead-silence gaps, rock-solid timing).
 * - Fully unmuted and starts automatically as soon as the page loads.
 * - Browser policy auto-unlock: immediately begins on page load or on the first user interaction.
 * - Independent of any other button — toggled ONLY via the dedicated navbar mute button.
 */

// Musical scale & note definitions (Hz)
const N = {
  // Bass
  C2: 65.41,
  D2: 73.42,
  E2: 82.41,
  G2: 98.0,
  A2: 110.0,
  B2: 123.47,
  C3: 130.81,
  D3: 146.83,
  E3: 164.81,
  Fs3: 185.0,
  G3: 196.0,
  A3: 220.0,
  B3: 246.94,

  // Mid / Chords
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  Fs4: 369.99,
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,

  // Treble / Kalimba Melody
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  Fs5: 739.99,
  G5: 783.99,
  A5: 880.0,
  B5: 987.77,
  C6: 1046.5,
  D6: 1174.66,
};

// 8-Bar Musical Structure: 128 sixteenth-note steps at 70 BPM (~27.4s loop)
// Harmony: Gmaj7 -> Em7 -> Cadd9 -> Dsus4/D -> Gmaj7 -> Bm7 -> Cmaj7 -> Am7/D7

interface NoteEvent {
  step: number;
  type: "bass" | "arp" | "melody" | "crackle";
  freq?: number;
  duration?: number;
  gain?: number;
}

const SCORE: NoteEvent[] = [
  // --- BAR 0 (steps 0..15): Gmaj7 ---
  { step: 0, type: "bass", freq: N.G2, duration: 1.6, gain: 0.28 },
  { step: 0, type: "arp", freq: N.B3, duration: 0.9, gain: 0.14 },
  { step: 0, type: "arp", freq: N.D4, duration: 0.9, gain: 0.12 },
  { step: 0, type: "melody", freq: N.B4, duration: 1.8, gain: 0.26 },
  { step: 4, type: "arp", freq: N.G4, duration: 0.9, gain: 0.14 },
  { step: 4, type: "melody", freq: N.D5, duration: 1.4, gain: 0.25 },
  { step: 6, type: "melody", freq: N.E5, duration: 1.2, gain: 0.24 },
  { step: 8, type: "bass", freq: N.G3, duration: 1.4, gain: 0.22 },
  { step: 8, type: "arp", freq: N.Fs4, duration: 0.9, gain: 0.14 },
  { step: 8, type: "melody", freq: N.G5, duration: 1.9, gain: 0.27 },
  { step: 10, type: "crackle" },
  { step: 12, type: "arp", freq: N.D4, duration: 0.9, gain: 0.13 },
  { step: 12, type: "melody", freq: N.Fs5, duration: 1.6, gain: 0.25 },

  // --- BAR 1 (steps 16..31): Em7 ---
  { step: 16, type: "bass", freq: N.E2, duration: 1.6, gain: 0.28 },
  { step: 16, type: "arp", freq: N.G3, duration: 0.9, gain: 0.14 },
  { step: 16, type: "arp", freq: N.B3, duration: 0.9, gain: 0.12 },
  { step: 16, type: "melody", freq: N.E5, duration: 1.8, gain: 0.26 },
  { step: 20, type: "arp", freq: N.E4, duration: 0.9, gain: 0.14 },
  { step: 20, type: "melody", freq: N.B4, duration: 1.4, gain: 0.24 },
  { step: 24, type: "bass", freq: N.E3, duration: 1.4, gain: 0.22 },
  { step: 24, type: "arp", freq: N.D4, duration: 0.9, gain: 0.14 },
  { step: 24, type: "melody", freq: N.D5, duration: 1.3, gain: 0.25 },
  { step: 27, type: "melody", freq: N.E5, duration: 1.2, gain: 0.24 },
  { step: 28, type: "arp", freq: N.B3, duration: 0.9, gain: 0.13 },
  { step: 28, type: "melody", freq: N.D5, duration: 1.6, gain: 0.25 },

  // --- BAR 2 (steps 32..47): Cadd9 ---
  { step: 32, type: "bass", freq: N.C2, duration: 1.6, gain: 0.3 },
  { step: 32, type: "arp", freq: N.E3, duration: 0.9, gain: 0.14 },
  { step: 32, type: "arp", freq: N.G3, duration: 0.9, gain: 0.12 },
  { step: 32, type: "melody", freq: N.E5, duration: 1.8, gain: 0.26 },
  { step: 36, type: "arp", freq: N.D4, duration: 0.9, gain: 0.14 },
  { step: 36, type: "melody", freq: N.G5, duration: 1.3, gain: 0.26 },
  { step: 38, type: "melody", freq: N.A5, duration: 1.2, gain: 0.25 },
  { step: 40, type: "bass", freq: N.C3, duration: 1.4, gain: 0.22 },
  { step: 40, type: "arp", freq: N.E4, duration: 0.9, gain: 0.14 },
  { step: 40, type: "melody", freq: N.G5, duration: 1.8, gain: 0.27 },
  { step: 42, type: "crackle" },
  { step: 44, type: "arp", freq: N.G4, duration: 0.9, gain: 0.13 },
  { step: 44, type: "melody", freq: N.E5, duration: 1.6, gain: 0.25 },

  // --- BAR 3 (steps 48..63): Dsus4 -> D ---
  { step: 48, type: "bass", freq: N.D2, duration: 1.6, gain: 0.28 },
  { step: 48, type: "arp", freq: N.A3, duration: 0.9, gain: 0.14 },
  { step: 48, type: "arp", freq: N.D4, duration: 0.9, gain: 0.12 },
  { step: 48, type: "melody", freq: N.D5, duration: 1.8, gain: 0.26 },
  { step: 52, type: "arp", freq: N.G4, duration: 0.9, gain: 0.14 },
  { step: 52, type: "melody", freq: N.A4, duration: 1.4, gain: 0.24 },
  { step: 56, type: "bass", freq: N.D3, duration: 1.4, gain: 0.22 },
  { step: 56, type: "arp", freq: N.Fs4, duration: 0.9, gain: 0.14 },
  { step: 56, type: "melody", freq: N.Fs4, duration: 1.3, gain: 0.23 },
  { step: 58, type: "melody", freq: N.A4, duration: 1.2, gain: 0.24 },
  { step: 60, type: "arp", freq: N.A4, duration: 0.9, gain: 0.13 },
  { step: 60, type: "melody", freq: N.B4, duration: 1.7, gain: 0.25 },

  // --- BAR 4 (steps 64..79): Gmaj7 ---
  { step: 64, type: "bass", freq: N.G2, duration: 1.6, gain: 0.28 },
  { step: 64, type: "arp", freq: N.B3, duration: 0.9, gain: 0.14 },
  { step: 64, type: "arp", freq: N.D4, duration: 0.9, gain: 0.12 },
  { step: 64, type: "melody", freq: N.D5, duration: 1.8, gain: 0.26 },
  { step: 68, type: "arp", freq: N.G4, duration: 0.9, gain: 0.14 },
  { step: 68, type: "melody", freq: N.G5, duration: 1.5, gain: 0.27 },
  { step: 72, type: "bass", freq: N.G3, duration: 1.4, gain: 0.22 },
  { step: 72, type: "arp", freq: N.B4, duration: 0.9, gain: 0.14 },
  { step: 72, type: "melody", freq: N.B5, duration: 1.8, gain: 0.28 },
  { step: 74, type: "crackle" },
  { step: 76, type: "arp", freq: N.D4, duration: 0.9, gain: 0.13 },
  { step: 76, type: "melody", freq: N.A5, duration: 1.6, gain: 0.26 },

  // --- BAR 5 (steps 80..95): Bm7 ---
  { step: 80, type: "bass", freq: N.B2, duration: 1.6, gain: 0.28 },
  { step: 80, type: "arp", freq: N.D4, duration: 0.9, gain: 0.14 },
  { step: 80, type: "arp", freq: N.Fs4, duration: 0.9, gain: 0.12 },
  { step: 80, type: "melody", freq: N.Fs5, duration: 1.8, gain: 0.26 },
  { step: 84, type: "arp", freq: N.A4, duration: 0.9, gain: 0.14 },
  { step: 84, type: "melody", freq: N.D5, duration: 1.4, gain: 0.24 },
  { step: 88, type: "bass", freq: N.Fs3, duration: 1.4, gain: 0.22 },
  { step: 88, type: "arp", freq: N.D4, duration: 0.9, gain: 0.14 },
  { step: 88, type: "melody", freq: N.B4, duration: 1.4, gain: 0.24 },
  { step: 92, type: "arp", freq: N.Fs4, duration: 0.9, gain: 0.13 },
  { step: 92, type: "melody", freq: N.D5, duration: 1.7, gain: 0.25 },

  // --- BAR 6 (steps 96..111): Cmaj7 ---
  { step: 96, type: "bass", freq: N.C2, duration: 1.6, gain: 0.3 },
  { step: 96, type: "arp", freq: N.E4, duration: 0.9, gain: 0.14 },
  { step: 96, type: "arp", freq: N.G4, duration: 0.9, gain: 0.12 },
  { step: 96, type: "melody", freq: N.E5, duration: 1.8, gain: 0.26 },
  { step: 100, type: "arp", freq: N.B4, duration: 0.9, gain: 0.14 },
  { step: 100, type: "melody", freq: N.G5, duration: 1.3, gain: 0.26 },
  { step: 102, type: "melody", freq: N.A5, duration: 1.2, gain: 0.25 },
  { step: 104, type: "bass", freq: N.G2, duration: 1.4, gain: 0.22 },
  { step: 104, type: "arp", freq: N.G4, duration: 0.9, gain: 0.14 },
  { step: 104, type: "melody", freq: N.B5, duration: 1.8, gain: 0.28 },
  { step: 106, type: "crackle" },
  { step: 108, type: "arp", freq: N.E4, duration: 0.9, gain: 0.13 },
  { step: 108, type: "melody", freq: N.G5, duration: 1.6, gain: 0.26 },

  // --- BAR 7 (steps 112..127): Am7 -> D7 ---
  { step: 112, type: "bass", freq: N.A2, duration: 1.6, gain: 0.28 },
  { step: 112, type: "arp", freq: N.C4, duration: 0.9, gain: 0.14 },
  { step: 112, type: "arp", freq: N.E4, duration: 0.9, gain: 0.12 },
  { step: 112, type: "melody", freq: N.A5, duration: 1.7, gain: 0.26 },
  { step: 116, type: "arp", freq: N.G4, duration: 0.9, gain: 0.14 },
  { step: 116, type: "melody", freq: N.Fs5, duration: 1.4, gain: 0.25 },
  { step: 120, type: "bass", freq: N.D2, duration: 1.6, gain: 0.28 },
  { step: 120, type: "arp", freq: N.Fs4, duration: 0.9, gain: 0.14 },
  { step: 120, type: "melody", freq: N.D5, duration: 1.4, gain: 0.24 },
  { step: 124, type: "arp", freq: N.D4, duration: 0.9, gain: 0.13 },
  { step: 124, type: "melody", freq: N.G4, duration: 2.0, gain: 0.26 },
];

class AutumnAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted = false;
  private isPlaying = true;
  private isSchedulerRunning = false;
  private timerId: number | null = null;
  private nextStepTime = 0;
  private currentStep = 0;
  private windStarted = false;
  private listeners: ((playing: boolean) => void)[] = [];

  // 70 BPM -> 1 beat = 60/70 = 0.85714s, 16th-note step = 0.214285s
  private readonly stepDuration = 60 / 70 / 4;
  private readonly scheduleAheadTime = 0.16; // 160ms lookahead window
  private readonly lookaheadInterval = 35; // Check every 35ms
  private readonly targetVolume = 0.35; // Comfortable, rich, soothing master volume

  constructor() {
    this.isPlaying = true;
    this.isMuted = false;

    if (typeof window !== "undefined") {
      const unlockAndRun = () => {
        if (!this.isMuted) {
          this.ensureRunning();
        }
      };

      // 1. Immediate attempt upon script evaluation
      unlockAndRun();

      // 2. Immediate attempt on DOMContentLoaded and load
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", unlockAndRun, { once: true });
      }
      window.addEventListener("load", unlockAndRun, { once: true });

      // 3. User interaction catch-all (passive & capture):
      // Guaranteed to activate Web Audio on the very first touch, click, or key press
      const userEvents = ["pointerdown", "mousedown", "touchstart", "touchend", "keydown", "click"];
      const onFirstUserAction = () => {
        unlockAndRun();
      };

      userEvents.forEach((ev) => {
        window.addEventListener(ev, onFirstUserAction, { passive: true, capture: true });
        document.addEventListener(ev, onFirstUserAction, { passive: true, capture: true });
      });
    }
  }

  private initContext() {
    if (this.ctx) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      const initialVol = this.isMuted ? 0.0001 : this.targetVolume;
      this.masterGain.gain.setValueAtTime(initialVol, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Listen for context state changes
      this.ctx.addEventListener("statechange", () => {
        if (this.ctx?.state === "running") {
          this.onContextActive();
        }
      });
    } catch {}
  }

  private onContextActive() {
    if (!this.ctx || this.ctx.state !== "running") return;

    if (!this.windStarted) {
      this.startBreeze();
      this.windStarted = true;
    }

    if (!this.isSchedulerRunning) {
      this.startScheduler();
    }
  }

  /** Soft ambient wind whisper using filtered pink noise */
  private startBreeze() {
    if (!this.ctx || !this.masterGain) return;
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        lastOut = (lastOut + 0.02 * white) / 1.02;
        data[i] = lastOut * 0.22;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(420, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

      const windGain = this.ctx.createGain();
      windGain.gain.setValueAtTime(0.045, this.ctx.currentTime);

      const lfo = this.ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.setValueAtTime(0.1, this.ctx.currentTime);

      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(140, this.ctx.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      noise.connect(filter);
      filter.connect(windGain);
      windGain.connect(this.masterGain);

      noise.start();
      lfo.start();
    } catch {}
  }

  /** Warm acoustic bass tone with audible harmonics */
  private playBass(freq: number, startTime: number, duration = 1.4, gainLevel = 0.26) {
    if (!this.ctx || !this.masterGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const oscHarmonic = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, startTime);

      // Octave harmonic ensures bass line is easily audible on laptop & mobile speakers
      oscHarmonic.type = "sine";
      oscHarmonic.frequency.setValueAtTime(freq * 2, startTime);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(580, startTime);

      const safeStart = Math.max(startTime, this.ctx.currentTime + 0.002);
      gain.gain.setValueAtTime(0.0001, safeStart);
      gain.gain.linearRampToValueAtTime(gainLevel, safeStart + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, safeStart + duration);

      osc.connect(filter);
      oscHarmonic.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(safeStart);
      oscHarmonic.start(safeStart);
      osc.stop(safeStart + duration + 0.05);
      oscHarmonic.stop(safeStart + duration + 0.05);
    } catch {}
  }

  /** Gentle rolling nylon / Rhodes chord arpeggio */
  private playArp(freq: number, startTime: number, duration = 0.9, gainLevel = 0.14) {
    if (!this.ctx || !this.masterGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, startTime);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1050, startTime);
      filter.Q.setValueAtTime(1.0, startTime);

      const safeStart = Math.max(startTime, this.ctx.currentTime + 0.002);
      gain.gain.setValueAtTime(0.0001, safeStart);
      gain.gain.linearRampToValueAtTime(gainLevel, safeStart + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, safeStart + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(safeStart);
      osc.stop(safeStart + duration + 0.05);
    } catch {}
  }

  /** Crystalline, soothing kalimba / music box melody ping */
  private playKalimba(freq: number, startTime: number, duration = 1.7, gainLevel = 0.26) {
    if (!this.ctx || !this.masterGain) return;
    try {
      const oscFundamental = this.ctx.createOscillator();
      const oscOvertone = this.ctx.createOscillator();
      const gainFund = this.ctx.createGain();
      const gainOver = this.ctx.createGain();

      oscFundamental.type = "sine";
      oscFundamental.frequency.setValueAtTime(freq, startTime);

      // Pure wooden / metal chime tine overtone
      oscOvertone.type = "sine";
      oscOvertone.frequency.setValueAtTime(freq * 3, startTime);

      const safeStart = Math.max(startTime, this.ctx.currentTime + 0.002);

      // Fundamental envelope: quick attack, singing decay
      gainFund.gain.setValueAtTime(0.0001, safeStart);
      gainFund.gain.linearRampToValueAtTime(gainLevel, safeStart + 0.005);
      gainFund.gain.exponentialRampToValueAtTime(gainLevel * 0.45, safeStart + 0.35);
      gainFund.gain.exponentialRampToValueAtTime(0.0001, safeStart + duration);

      // Overtone envelope: gives the initial wooden tine "tock" ping
      gainOver.gain.setValueAtTime(0.0001, safeStart);
      gainOver.gain.linearRampToValueAtTime(gainLevel * 0.24, safeStart + 0.004);
      gainOver.gain.exponentialRampToValueAtTime(0.0001, safeStart + 0.16);

      oscFundamental.connect(gainFund);
      oscOvertone.connect(gainOver);

      gainFund.connect(this.masterGain);
      gainOver.connect(this.masterGain);

      oscFundamental.start(safeStart);
      oscOvertone.start(safeStart);
      oscFundamental.stop(safeStart + duration + 0.05);
      oscOvertone.stop(safeStart + 0.2);
    } catch {}
  }

  /** Cozy warm fireplace ember crackle */
  private playCrackle(startTime: number) {
    if (!this.ctx || !this.masterGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(180 + Math.random() * 90, startTime);

      const safeStart = Math.max(startTime, this.ctx.currentTime + 0.002);
      gain.gain.setValueAtTime(0.0001, safeStart);
      gain.gain.linearRampToValueAtTime(0.035, safeStart + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, safeStart + 0.04);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(safeStart);
      osc.stop(safeStart + 0.05);
    } catch {}
  }

  private scheduleStep(stepIndex: number, time: number) {
    const events = SCORE.filter((e) => e.step === stepIndex);
    events.forEach((ev) => {
      switch (ev.type) {
        case "bass":
          if (ev.freq) this.playBass(ev.freq, time, ev.duration ?? 1.4, ev.gain ?? 0.26);
          break;
        case "arp":
          if (ev.freq) this.playArp(ev.freq, time, ev.duration ?? 0.9, ev.gain ?? 0.14);
          break;
        case "melody":
          if (ev.freq) this.playKalimba(ev.freq, time, ev.duration ?? 1.7, ev.gain ?? 0.26);
          break;
        case "crackle":
          this.playCrackle(time);
          break;
      }
    });
  }

  private schedulerTick = () => {
    if (!this.ctx || this.ctx.state !== "running") return;

    // Reset nextStepTime if it fell behind due to suspended state
    if (this.nextStepTime < this.ctx.currentTime) {
      this.nextStepTime = this.ctx.currentTime + 0.03;
    }

    // Schedule all notes up to lookahead horizon
    while (this.nextStepTime < this.ctx.currentTime + this.scheduleAheadTime) {
      this.scheduleStep(this.currentStep, this.nextStepTime);
      this.nextStepTime += this.stepDuration;
      this.currentStep = (this.currentStep + 1) % 128; // 8 bars * 16 steps
    }
  };

  private startScheduler() {
    if (this.isSchedulerRunning) return;
    this.isSchedulerRunning = true;
    if (this.ctx) {
      this.nextStepTime = this.ctx.currentTime + 0.04;
    }
    this.timerId = window.setInterval(this.schedulerTick, this.lookaheadInterval);
  }

  /** Ensures context is initialized, resumed, and scheduler is active */
  public ensureRunning() {
    this.initContext();
    if (!this.ctx) return;

    if (this.ctx.state === "suspended") {
      this.ctx
        .resume()
        .then(() => {
          this.onContextActive();
        })
        .catch(() => {
          // If browser policy blocked resumption without prior gesture,
          // resetting this.ctx to null allows initContext() to cleanly create
          // a fresh running AudioContext directly inside the next user gesture
          try {
            this.ctx?.close().catch(() => {});
          } catch {}
          this.ctx = null;
          this.masterGain = null;
          this.windStarted = false;
        });
    } else if (this.ctx.state === "running") {
      this.onContextActive();
    }
  }

  /**
   * Mute toggle: the ONLY control that mutes/unmutes audio
   */
  public toggle() {
    this.ensureRunning();

    if (this.isMuted) {
      // Unmute
      this.isMuted = false;
      this.isPlaying = true;
      if (this.ctx && this.masterGain) {
        this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(this.targetVolume, this.ctx.currentTime + 0.25);
      }
    } else {
      // Mute
      this.isMuted = true;
      this.isPlaying = false;
      if (this.ctx && this.masterGain) {
        this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.2);
      }
    }
    this.notify();
  }

  public stopScheduler() {
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
    this.isSchedulerRunning = false;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public subscribe(fn: (playing: boolean) => void) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  private notify() {
    const state = !this.isMuted;
    this.listeners.forEach((fn) => fn(state));
  }
}

export const autumnAudio = new AutumnAudioEngine();
