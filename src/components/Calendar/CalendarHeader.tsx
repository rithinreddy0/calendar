import React from 'react';
import type { MonthTheme } from '../../data/monthThemes';

interface CalendarHeaderProps {
  theme: MonthTheme;
  year: number;
  onPrev: () => void;
  onNext: () => void;
  isFlipping: boolean;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ theme, year, onPrev, onNext, isFlipping }) => {
  return (
    <div className="cal-header" style={{ '--accent': theme.accent } as React.CSSProperties}>
      <button
        className="nav-btn"
        onClick={onPrev}
        disabled={isFlipping}
        aria-label="Previous month"
        id="btn-prev-month"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="header-center">
        <div className="header-month-name" style={{ color: theme.accent }}>
          {theme.name}
        </div>
        <div className="header-year">{year}</div>
      </div>

      <button
        className="nav-btn"
        onClick={onNext}
        disabled={isFlipping}
        aria-label="Next month"
        id="btn-next-month"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
};

export default CalendarHeader;
