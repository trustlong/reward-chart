export const MIN_SCALE = 5;
export const MAX_SCALE = 200;

export function clampScale(value: number): number {
  if (Number.isNaN(value)) return 30;
  return Math.max(MIN_SCALE, Math.min(MAX_SCALE, Math.floor(value)));
}

export function gridColumns(scale: number): number {
  return scale <= 10 ? scale : 10;
}
