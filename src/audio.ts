/**
 * Soothing Autumn Indie Game Ambient Audio Engine
 * Pure Web Audio API synthesis - zero external assets or loading delays.
 * Features:
 * - Peaceful pentatonic kalimba / music box melodic phrases
 * - Gentle ambient breeze with wind-modulated filtering
 * - Cozy warm hearth ember crackle at very low soothing volume
 */

class AutumnAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying = false;
  private timerId: number | null = null;
  private listeners: ((playing: boolean) => void)[] = [];

  // Pleasant warm pentatonic scale (D major / B minor)
  // Notes: D4, E4, F#4, A4, B4, D5, E5, F#5
  private scale = [293.66, 329.63, 369.99, 440.0, 493.88, 587.33, 659.25, 739.99];
  private chords = [
    [146.83, 293.66, 369.99, 440.0], // Dmaj
    [123.47, 246.94, 293.66, 440.0], // Bm7
    [98.0, 196.0, 293.66, 369.99],   // Gmaj7
    [110.0, 220.0, 293.66, 329.63],  // Asus4
  ];
  private chordIndex = 0;

  constructor() {
    let explicitlyMuted = false;
    try {
      explicitlyMuted = localStorage.getItem("autumn_bgm_enabled") === "false";
    } catch {}

    if (!explicitlyMuted) {
      // 1. Attempt immediate playback upon page load
      const tryImmediatePlay = () => {
        this.start().catch(() => {});
      };

      if (document.readyState === "complete" || document.readyState === "interactive") {
        tryImmediatePlay();
      } else {
        window.addEventListener("DOMContentLoaded", tryImmediatePlay, { once: true });
        window.addEventListener("load", tryImmediatePlay, { once: true });
      }

      // 2. Browser autoplay fallback: unlock immediately on first move/scroll/touch
      const unlockAndPlay = () => {
        if (!this.isPlaying) {
          let isMuted = false;
          try {
            isMuted = localStorage.getItem("autumn_bgm_enabled") === "false";
          } catch {}
          if (!isMuted) {
            this.start().catch(() => {});
          }
        }
        cleanup();
      };

      const events = ["pointermove", "pointerdown", "touchstart", "scroll", "keydown", "click"];
      const cleanup = () => {
        events.forEach((ev) =>
          window.removeEventListener(ev, unlockAndPlay, { capture: true } as EventListenerOptions)
        );
      };
      events.forEach((ev) =>
        window.addEventListener(ev, unlockAndPlay, { once: true, passive: true, capture: true })
      );
    }
  }

  private initContext() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioCtx();

    // Master volume set to very low, gentle level (0.08 - 0.10)
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.09, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    this.startBreeze();
  }

  /** Soft ambient wind whisper using filtered noise */
  private startBreeze() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Pink noise filter
      lastOut = (lastOut + 0.02 * white) / 1.02;
      data[i] = lastOut * 0.18;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    // Bandpass filter to make it sound like gentle wind through autumn leaves
    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(420, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

    const windGain = this.ctx.createGain();
    windGain.gain.setValueAtTime(0.045, this.ctx.currentTime);

    // Modulate wind filter slowly
    const lfo = this.ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(0.15, this.ctx.currentTime);

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(180, this.ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    noise.connect(filter);
    filter.connect(windGain);
    windGain.connect(this.masterGain);

    noise.start();
    lfo.start();
  }

  /** Plays a single soft, warm bell / music box tone */
  private playTone(freq: number, startTime: number, duration = 2.4, gainLevel = 0.12) {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Soft warm waveform: mix of sine and soft triangle for indie music box / kalimba warmth
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, startTime);

    // Subtle gentle overtone
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(freq * 2, startTime);

    // Soft envelope with gradual release
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(gainLevel, startTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(gainLevel * 0.4, startTime + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);

    osc.start(startTime);
    osc2.start(startTime);
    osc.stop(startTime + duration + 0.1);
    osc2.stop(startTime + duration + 0.1);
  }

  /** Plays a soft warm pad chord in the background */
  private playChord(chord: number[], startTime: number) {
    if (!this.ctx || !this.masterGain) return;
    chord.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);

      const chordVol = idx === 0 ? 0.035 : 0.02;
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(chordVol, startTime + 1.2);
      gain.gain.linearRampToValueAtTime(chordVol * 0.7, startTime + 3.8);
      gain.gain.linearRampToValueAtTime(0.0001, startTime + 5.2);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(startTime);
      osc.stop(startTime + 5.3);
    });
  }

  /** Schedules the next peaceful musical phrase */
  private schedulePhrase() {
    if (!this.isPlaying || !this.ctx) return;

    const now = this.ctx.currentTime;
    const currentChord = this.chords[this.chordIndex];
    this.chordIndex = (this.chordIndex + 1) % this.chords.length;

    // Play chord pad
    this.playChord(currentChord, now);

    // Pick 3 to 4 gentle melodic notes from the pentatonic scale
    const noteCount = 3 + Math.floor(Math.random() * 2);
    let noteTime = now + 0.2;

    for (let i = 0; i < noteCount; i++) {
      const freq = this.scale[Math.floor(Math.random() * this.scale.length)];
      this.playTone(freq, noteTime, 2.2, 0.09);
      noteTime += 0.65 + Math.random() * 0.55;
    }

    // Occasional tiny warm ember crackle
    if (Math.random() < 0.6) {
      this.playCrackle(now + 1.5 + Math.random() * 2);
    }

    // Loop interval between phrases: ~4.5 - 5.5s
    const nextPhraseDelay = 4600 + Math.random() * 1200;
    this.timerId = window.setTimeout(() => this.schedulePhrase(), nextPhraseDelay);
  }

  /** Tiny cozy fireplace crackle */
  private playCrackle(startTime: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(140 + Math.random() * 80, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(0.012, startTime + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.04);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + 0.05);
  }

  public async start() {
    this.initContext();
    if (!this.ctx) return;

    if (this.ctx.state === "suspended") {
      await this.ctx.resume();
    }

    if (!this.isPlaying) {
      this.isPlaying = true;
      try {
        localStorage.setItem("autumn_bgm_enabled", "true");
      } catch {}
      this.schedulePhrase();
      this.notify();
    }
  }

  public stop() {
    if (this.isPlaying) {
      this.isPlaying = false;
      try {
        localStorage.setItem("autumn_bgm_enabled", "false");
      } catch {}
      if (this.timerId) {
        clearTimeout(this.timerId);
        this.timerId = null;
      }
      if (this.ctx && this.masterGain) {
        // Smoothly fade out volume over 0.5s instead of abrupt cut
        this.masterGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
        setTimeout(() => {
          if (this.ctx && !this.isPlaying) {
            this.ctx.suspend();
            this.masterGain?.gain.setValueAtTime(0.09, this.ctx.currentTime);
          }
        }, 550);
      }
      this.notify();
    }
  }

  public toggle() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
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
    this.listeners.forEach((fn) => fn(this.isPlaying));
  }
}

export const autumnAudio = new AutumnAudioEngine();
