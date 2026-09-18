/**
 * Sanitise the API's pre-formatted cook-time string for display (H4 fix).
 * The backend can emit junk like "± 205389.13 hrs" from bad data; never show
 * that verbatim. Strips the jarring "±" prefix, and caps absurd durations.
 *
 * Examples:
 *   "± 22 mins"        -> "22 mins"
 *   "± 205389.13 hrs"  -> "Long cook"
 *   "1.33 hrs"         -> "1.3 hrs"
 */
export function formatCookTime(raw: string | undefined | null): string {
  if (!raw) return '';
  const cleaned = raw.replace(/±/g, '').trim();

  const match = cleaned.match(/([\d.]+)\s*(hrs?|hours?|mins?|minutes?)/i);
  if (!match) return cleaned;

  const value = parseFloat(match[1]);
  const unitRaw = match[2].toLowerCase();
  const isHours = unitRaw.startsWith('h');

  const totalHours = isHours ? value : value / 60;

  // Guard absurd / bad data.
  if (!Number.isFinite(totalHours) || totalHours > 24) return 'Long cook';

  if (isHours) {
    // Trim to one decimal, drop trailing ".0".
    const rounded = Math.round(value * 10) / 10;
    return `${rounded} ${rounded === 1 ? 'hr' : 'hrs'}`;
  }
  const mins = Math.round(value);
  return `${mins} ${mins === 1 ? 'min' : 'mins'}`;
}
