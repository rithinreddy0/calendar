import React from 'react';
import DayCell from './DayCell';
import type { MonthTheme } from '../../data/monthThemes';
import type { Holiday } from '../../data/holidays';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface CalendarGridProps {
  cells: Array<{ date: Date; isCurrentMonth: boolean }>;
  theme: MonthTheme;
  isToday: (d: Date) => boolean;
  isStart: (d: Date) => boolean;
  isEnd: (d: Date) => boolean;
  isInRange: (d: Date) => boolean;
  isHovering: (d: Date) => boolean;
  holidayMap: Map<string, Holiday[]>;
  onDayClick: (d: Date) => void;
  onDayHover: (d: Date | null) => void;
  isFlipping: boolean;
  flipDirection: 'next' | 'prev' | null;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  cells,
  theme,
  isToday,
  isStart,
  isEnd,
  isInRange,
  isHovering,
  holidayMap,
  onDayClick,
  onDayHover,
  isFlipping,
  flipDirection,
}) => {
  return (
    <div className={`calendar-grid-wrapper ${isFlipping ? `flip-grid-${flipDirection}` : ''}`}>
      {/* Day of week headers */}
      <div className="day-labels" role="row">
        {DAY_LABELS.map((label, i) => (
          <div
            key={label}
            className={`day-label ${i === 0 || i === 6 ? 'weekend-label' : ''}`}
            role="columnheader"
            aria-label={label}
            style={{ '--accent': theme.accent } as React.CSSProperties}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Calendar cells grid */}
      <div className="calendar-grid" role="grid">
        {cells.map((cell, index) => {
          const dateStr = cell.date.toISOString().split('T')[0];
          const holidays = holidayMap.get(dateStr) ?? [];
          const colIndex = index % 7;

          return (
            <DayCell
              key={dateStr + (cell.isCurrentMonth ? '' : '-g')}
              date={cell.date}
              isCurrentMonth={cell.isCurrentMonth}
              isToday={isToday(cell.date)}
              isStart={isStart(cell.date)}
              isEnd={isEnd(cell.date)}
              isInRange={isInRange(cell.date)}
              isHovering={isHovering(cell.date)}
              holidays={cell.isCurrentMonth ? holidays : []}
              accent={theme.accent}
              accentGlow={theme.accentGlow}
              onClick={() => onDayClick(cell.date)}
              onMouseEnter={() => onDayHover(cell.date)}
              onMouseLeave={() => onDayHover(null)}
              isFirstInRow={colIndex === 0}
              isLastInRow={colIndex === 6}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
