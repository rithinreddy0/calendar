import { useState, useCallback } from 'react';
import { monthThemes } from '../data/monthThemes';

export function useCalendar() {
  const now = new Date();
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev' | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);

  const theme = monthThemes[currentMonth];

  const navigate = useCallback((direction: 'next' | 'prev') => {
    if (isFlipping) return;
    setFlipDirection(direction);
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentMonth(prev => {
        if (direction === 'next') {
          if (prev === 11) { setCurrentYear(y => y + 1); return 0; }
          return prev + 1;
        } else {
          if (prev === 0) { setCurrentYear(y => y - 1); return 11; }
          return prev - 1;
        }
      });
      setIsFlipping(false);
      setFlipDirection(null);
    }, 350);
  }, [isFlipping]);

  const getDaysInMonth = useCallback((year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  }, []);

  const getFirstDayOfMonth = useCallback((year: number, month: number) => {
    return new Date(year, month, 1).getDay(); // 0=Sun
  }, []);

  const getCalendarCells = useCallback(() => {
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const daysInPrevMonth = getDaysInMonth(currentYear, currentMonth - 1);

    const cells: Array<{ date: Date; isCurrentMonth: boolean }> = [];

    // Previous month padding
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      cells.push({
        date: new Date(currentYear, currentMonth - 1, day),
        isCurrentMonth: false,
      });
    }

    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({
        date: new Date(currentYear, currentMonth, d),
        isCurrentMonth: true,
      });
    }

    // Next month padding (fill to 6 rows × 7 = 42)
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) {
      cells.push({
        date: new Date(currentYear, currentMonth + 1, d),
        isCurrentMonth: false,
      });
    }

    return cells;
  }, [currentYear, currentMonth]);

  const isToday = useCallback((date: Date) => {
    return date.toDateString() === now.toDateString();
  }, []);

  const monthKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;

  return {
    currentYear,
    currentMonth,
    theme,
    flipDirection,
    isFlipping,
    navigate,
    getCalendarCells,
    isToday,
    monthKey,
    today: now,
  };
}
