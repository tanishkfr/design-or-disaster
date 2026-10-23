export const clamp = (value, min = 0, max = 100) =>
  Math.min(max, Math.max(min, value))

// A rectangle uses its top-left as origin; legacy points retain their center.
export function rectangleFromPoints(start, end) {
  return {
    x: Math.min(start.x, end.x),
    y: Math.min(start.y, end.y),
    width: Math.abs(end.x - start.x),
    height: Math.abs(end.y - start.y),
  }
}

export function normalizeGeometry(mark, patch) {
  const next = { ...mark, ...patch }
  next.x = clamp(Number(next.x) || 0)
  next.y = clamp(Number(next.y) || 0)
  if (next.width != null)
    next.width = clamp(Number(next.width) || 1, 1, 100 - Math.min(next.x, 99))
  if (next.height != null)
    next.height = clamp(Number(next.height) || 1, 1, 100 - Math.min(next.y, 99))
  if (next.width != null) next.x = Math.min(next.x, 100 - next.width)
  if (next.height != null) next.y = Math.min(next.y, 100 - next.height)
  return next
}
