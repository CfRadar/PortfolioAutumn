import { useEffect, useState } from "react";
import { autumnAudio } from "../audio";

export default function SoundButton() {
  const [playing, setPlaying] = useState(autumnAudio.getIsPlaying());

  useEffect(() => {
    return autumnAudio.subscribe((state) => setPlaying(state));
  }, []);

  return (
    <button
      type="button"
      className={`sound-toggle ${playing ? "playing" : "muted"}`}
      onClick={() => autumnAudio.toggle()}
      title={playing ? "Sound is ON (Click to mute)" : "Sound is MUTED (Click to play soothing audio)"}
      aria-label={playing ? "Mute audio" : "Play audio"}
    >
      {playing ? (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Speaker body */}
          <rect x="2" y="6" width="3" height="4" />
          <rect x="5" y="4" width="2" height="8" />
          <rect x="7" y="2" width="2" height="12" />
          {/* Sound waves */}
          <rect x="10" y="5" width="1" height="6" />
          <rect x="11" y="6" width="1" height="4" />
          <rect x="13" y="3" width="1" height="10" />
          <rect x="14" y="5" width="1" height="6" />
        </svg>
      ) : (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Speaker body */}
          <rect x="2" y="6" width="3" height="4" />
          <rect x="5" y="4" width="2" height="8" />
          <rect x="7" y="2" width="2" height="12" />
          {/* Mute X */}
          <rect x="11" y="5" width="1" height="2" />
          <rect x="14" y="5" width="1" height="2" />
          <rect x="12" y="7" width="2" height="2" />
          <rect x="11" y="9" width="1" height="2" />
          <rect x="14" y="9" width="1" height="2" />
        </svg>
      )}
    </button>
  );
}
