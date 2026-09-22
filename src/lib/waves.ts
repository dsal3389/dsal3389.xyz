/** A continuous, irregular wave field, rendered entirely with ASCII characters. */
export type WaveSize = { columns: number; rows: number; width: number; height: number };
export type WaveRipple = { x: number; y: number; born: number };
export const RIPPLE_LIFETIME = 2.4;
export const WAVE_LAYERS = ['shadow', 'red', 'highlight'] as const;
export type WaveFrame = Record<(typeof WAVE_LAYERS)[number], string>;

export function renderWaves(size: WaveSize, seconds = 0, ripples: readonly WaveRipple[] = []): WaveFrame {
  const { columns, rows, width, height } = size;
  const buffers: Record<keyof WaveFrame, string[]> = { shadow: [], red: [], highlight: [] };
  const unit = Math.max(360, Math.min(width, height));
  const glyphs = '.:-=+*#%@';
  const displacement = new Float32Array(columns * rows);
  const rippleCrests = new Float32Array(columns * rows);

  // A click sends two fading wavefronts outward from its original position.
  // Rasterize only the area each disturbance can reach.
  for (const point of ripples) {
    const age = seconds - point.born;
    if (age < 0 || age >= RIPPLE_LIFETIME) continue;
    const radius = 6 + age * 96;
    const reach = radius + 40;
    const energy = Math.pow(1 - age / RIPPLE_LIFETIME, 1.2);
    const left = Math.max(0, Math.floor((point.x - reach) / width * columns));
    const right = Math.min(columns - 1, Math.ceil((point.x + reach) / width * columns));
    const top = Math.max(0, Math.floor((point.y - reach) / height * rows));
    const bottom = Math.min(rows - 1, Math.ceil((point.y + reach) / height * rows));
    for (let row = top; row <= bottom; row++) {
      for (let column = left; column <= right; column++) {
        const distance = Math.hypot((column + 0.5) * width / columns - point.x, (row + 0.5) * height / rows - point.y);
        const edge = distance - radius;
        const front = Math.cos(edge * 0.12) * Math.exp(-0.5 * (edge / 14) ** 2);
        const innerEdge = edge + 30;
        const inner = age > 0.3 ? Math.cos(innerEdge * 0.12) * Math.exp(-0.5 * (innerEdge / 14) ** 2) * Math.min(0.55, (age - 0.3) * 3) : 0;
        const wave = (front + inner) * energy;
        const index = row * columns + column;
        displacement[index] += wave * 2.3;
        rippleCrests[index] += Math.max(0, wave) * 1.2;
      }
    }
  }

  for (let row = 0; row < rows; row++) {
    const lines: Record<keyof WaveFrame, string[]> = { shadow: [], red: [], highlight: [] };
    const y = (row + 0.5) * height / rows;
    const ny = (y - height * 0.5) / unit;
    for (let column = 0; column < columns; column++) {
      const x = (column + 0.5) * width / columns;
      const nx = (x - width * 0.5) / unit;
      const grain = ((column * 17 + row * 31) % 23) / 23;
      let field = ny * 15
        + Math.sin(nx * 4.1 + seconds * 0.21) * 2.6
        + Math.sin(nx * 8.3 - ny * 3.2 - seconds * 0.17) * 1.25
        + Math.cos(nx * 3.7 + ny * 6.2 + seconds * 0.13) * 0.8;

      const index = row * columns + column;
      field += displacement[index]!;
      const ripple = Math.min(1, rippleCrests[index]!);

      const crest = Math.pow((Math.sin(field) + 1) / 2, 5);
      const crossWave = Math.pow((Math.sin(nx * 11 - ny * 8 + seconds * 0.3) + 1) / 2, 12) * 0.12;
      // Keep the introduction quiet while the outer edges carry the brighter waves.
      const quietCenter = width < 600 ? 0.3 : 0.37;
      const quietHeight = height < 500 ? 0.29 : 0.23;
      const quiet = Math.exp(-Math.pow((x / width - quietCenter) / 0.45, 4) - Math.pow((y / height - 0.45) / quietHeight, 4));
      const depth = 0.43 + (y / height) * 0.4 + (x / width) * 0.17;
      const intensity = Math.min(1, ((crest + crossWave) * depth * (1 - quiet * 0.93)) + ripple);
      const character = intensity < 0.065 ? ' ' : glyphs[Math.min(glyphs.length - 1, Math.floor(intensity * 7 + grain * 1.3))]!;
      const layer: keyof WaveFrame = intensity > 0.74 ? 'highlight' : intensity > 0.34 ? 'red' : 'shadow';
      for (const key of WAVE_LAYERS) lines[key].push(key === layer ? character : ' ');
    }
    for (const key of WAVE_LAYERS) buffers[key].push(lines[key].join(''));
  }

  return { shadow: buffers.shadow.join('\n'), red: buffers.red.join('\n'), highlight: buffers.highlight.join('\n') };
}
