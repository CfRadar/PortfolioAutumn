/**
 * Global imaginary autumn wind physics simulation.
 * Drives both ambient falling leaves and particles shed from the cursor.
 */
export interface WindVector {
  windX: number;
  windY: number;
  gustFactor: number;
}

export function getWind(x: number, y: number, time: number): WindVector {
  const t = time * 0.001;
  // Complex harmonic gust cycles simulating natural outdoor gusts
  const gustCycle = Math.sin(t * 0.35) * 0.5 + 0.5;
  const turbulence = Math.sin(t * 0.85 + 1.1) * 0.5 + 0.5;
  const gustFactor = Math.pow(gustCycle * turbulence, 1.6) * 3.2;

  // Spatial atmospheric waves
  const waveX = Math.sin(y * 0.0028 + t * 1.1) * 0.4;
  const waveY = Math.cos(x * 0.0022 + t * 0.75) * 0.28;

  const windX = 0.75 + gustFactor * 1.45 + waveX;
  const windY = 0.3 + gustFactor * 0.35 + waveY;

  return { windX, windY, gustFactor };
}

