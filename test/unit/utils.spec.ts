import { describe, expect, it } from 'vitest';

import { formatTime, omitData } from '@/utils';

// Characterization tests: capture CURRENT behavior of the pure utils so the
// upcoming H2/H3/H4 refactors can't change them by accident.
describe('formatTime', () => {
  it('formats minutes-only durations', () => {
    expect(formatTime(30)).toBe('30 mins');
    expect(formatTime(2)).toBe('2 mins');
  });

  it('formats hour+minute durations', () => {
    expect(formatTime(90)).toBe('1 hr 30 mins');
    expect(formatTime(150)).toBe('2 hrs 30 mins');
  });

  // Documents current (quirky) singular handling: `> 1` means "1 min"/"1 hr 1 min"
  // render without an 's', but the minutes branch treats 1 as singular too.
  it('DOCUMENTS current singular/plural edge behavior', () => {
    expect(formatTime(1)).toBe('1 min');
    expect(formatTime(61)).toBe('1 hr 1 min');
    // 0 minutes still renders "0 min" (no special-casing)
    expect(formatTime(0)).toBe('0 min');
  });
});

describe('omitData', () => {
  it('removes the named keys and keeps the rest', () => {
    const input = { a: 1, b: 2, c: 3 };
    expect(omitData(input, 'b')).toEqual({ a: 1, c: 3 });
    expect(omitData(input, 'a', 'c')).toEqual({ b: 2 });
  });

  it('does not mutate the original object', () => {
    const input = { a: 1, b: 2 };
    omitData(input, 'a');
    expect(input).toEqual({ a: 1, b: 2 });
  });
});
