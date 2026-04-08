import { useState, useCallback } from 'react';

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export type SelectionMode = 'idle' | 'selecting';

export function useDateRange() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [mode, setMode] = useState<SelectionMode>('idle');

  const selectDate = useCallback((date: Date) => {
    if (mode === 'idle' || (range.start && range.end)) {
      // Start fresh selection
      setRange({ start: date, end: null });
      setMode('selecting');
    } else if (mode === 'selecting' && range.start) {
      if (date < range.start) {
        // Swap: clicked before start
        setRange({ start: date, end: range.start });
      } else if (date.getTime() === range.start.getTime()) {
        // Deselect
        setRange({ start: null, end: null });
        setMode('idle');
        return;
      } else {
        setRange(prev => ({ ...prev, end: date }));
      }
      setMode('idle');
      setHoverDate(null);
    }
  }, [mode, range.start, range.end]);

  const clearRange = useCallback(() => {
    setRange({ start: null, end: null });
    setMode('idle');
    setHoverDate(null);
  }, []);

  const isInRange = useCallback((date: Date): boolean => {
    const start = range.start;
    const end = range.end || (mode === 'selecting' ? hoverDate : null);
    if (!start || !end) return false;
    const [s, e] = start <= end ? [start, end] : [end, start];
    return date > s && date < e;
  }, [range, hoverDate, mode]);

  const isStart = useCallback((date: Date): boolean => {
    return range.start ? date.toDateString() === range.start.toDateString() : false;
  }, [range.start]);

  const isEnd = useCallback((date: Date): boolean => {
    const end = range.end || (mode === 'selecting' ? hoverDate : null);
    return end ? date.toDateString() === end.toDateString() : false;
  }, [range.end, hoverDate, mode]);

  const isHovering = useCallback((date: Date): boolean => {
    return hoverDate ? date.toDateString() === hoverDate.toDateString() : false;
  }, [hoverDate]);

  const getRangeDays = useCallback((): number => {
    if (!range.start || !range.end) return 0;
    const diff = Math.abs(range.end.getTime() - range.start.getTime());
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  }, [range]);

  const formatRangeLabel = useCallback((): string => {
    if (!range.start) return '';
    const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    const startStr = range.start.toLocaleDateString('en-US', opts);
    if (!range.end) return startStr;
    const endStr = range.end.toLocaleDateString('en-US', opts);
    const days = getRangeDays();
    return `${startStr} → ${endStr} (${days} day${days !== 1 ? 's' : ''})`;
  }, [range, getRangeDays]);

  return {
    range,
    hoverDate,
    mode,
    selectDate,
    setHoverDate,
    clearRange,
    isInRange,
    isStart,
    isEnd,
    isHovering,
    getRangeDays,
    formatRangeLabel,
  };
}
