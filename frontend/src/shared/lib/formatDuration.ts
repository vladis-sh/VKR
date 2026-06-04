/**
 * Formats a duration in seconds to a short Russian label, e.g. `45с`, `2м 5с`,
 * `1ч 20м`. Shared across stats so the format never diverges.
 */
export function formatDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.round(totalSeconds))
  if (seconds < 60) return `${seconds}с`

  const minutes = Math.floor(seconds / 60)
  const restSeconds = seconds % 60
  if (minutes < 60) {
    return restSeconds > 0 ? `${minutes}м ${restSeconds}с` : `${minutes}м`
  }

  const hours = Math.floor(minutes / 60)
  const restMinutes = minutes % 60
  return restMinutes > 0 ? `${hours}ч ${restMinutes}м` : `${hours}ч`
}
