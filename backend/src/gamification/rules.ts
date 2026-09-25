// Central source for the current points and level configuration.
// Review these values with FREQ-018 before treating them as school policy.
export const POINTS_PER_PRESENCE = 10

export const LEVELS = [
  { name: 'Bronze', minimum: 0 },
  { name: 'Prata', minimum: 51 },
  { name: 'Ouro', minimum: 151 },
  { name: 'Diamante', minimum: 300 },
] as const

export function progressFor(points: number) {
  const currentIndex = LEVELS.reduce<number>((index, level, position) =>
    points >= level.minimum ? position : index, 0)
  const current = LEVELS[Math.max(currentIndex, 0)]
  const next = LEVELS[currentIndex + 1]
  return {
    name: current.name,
    minimum: current.minimum,
    nextLevel: next?.name ?? null,
    nextMinimum: next?.minimum ?? null,
    percent: next
      ? Math.max(0, Math.min(100, Math.round((points - current.minimum) / (next.minimum - current.minimum) * 100)))
      : 100,
  }
}
