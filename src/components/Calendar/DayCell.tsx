import React, { memo } from 'react';
import type { Holiday } from '../../data/holidays';

interface DayCellProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isStart: boolean;
  isEnd: boolean;
  isInRange: boolean;
  isHovering: boolean;
  holidays: Holiday[];
  accent: string;
  accentGlow: string;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  isFirstInRow: boolean;
  isLastInRow: boolean;
}

const DayCell: React.FC<DayCellProps> = memo(({
  date,
  isCurrentMonth,
  isToday,
  isStart,
  isEnd,
  isInRange,
  isHovering,
  holidays,
  accent,
  accentGlow,
  onClick,
  onMouseEnter,
  onMouseLeave,
  isFirstInRow,
  isLastInRow,
}) => {
  const day = date.getDate();
  const isSelected = isStart || isEnd;
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;

  const cellClasses = [
    'day-cell',
    !isCurrentMonth && 'day-other-month',
    isToday && 'day-today',
    isStart && 'day-start',
    isEnd && 'day-end',
    isInRange && 'day-in-range',
    isHovering && !isSelected && 'day-hover',
    isWeekend && isCurrentMonth && 'day-weekend',
    isFirstInRow && (isInRange || isEnd) && 'range-row-start',
    isLastInRow && (isInRange || isStart) && 'range-row-end',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cellClasses}
      onClick={isCurrentMonth ? onClick : undefined}
      onMouseEnter={isCurrentMonth ? onMouseEnter : undefined}
      onMouseLeave={isCurrentMonth ? onMouseLeave : undefined}
      role={isCurrentMonth ? 'button' : undefined}
      aria-label={isCurrentMonth ? `${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}${isToday ? ', today' : ''}${isStart ? ', range start' : ''}${isEnd ? ', range end' : ''}` : undefined}
      tabIndex={isCurrentMonth ? 0 : undefined}
      id={isCurrentMonth ? `day-${date.toISOString().split('T')[0]}` : undefined}
      style={{
        '--accent': accent,
        '--accent-glow': accentGlow,
      } as React.CSSProperties}
    >
      {/* Range background pill */}
      {(isInRange || isStart || isEnd) && (
        <div className="range-bg" />
      )}

      {/* Day number */}
      <div className={`day-number ${isSelected ? 'selected-num' : ''}`}>
        {day}
      </div>

      {/* Today dot */}
      {isToday && <div className="today-dot" style={{ background: accent }} />}

      {/* Holiday markers */}
      {holidays.length > 0 && (
        <div className="holiday-strip">
          {holidays.slice(0, 2).map((h, i) => (
            <span
              key={i}
              className="holiday-emoji"
              title={h.name}
              aria-label={h.name}
            >
              {h.emoji}
            </span>
          ))}
        </div>
      )}
    </div>
  );
});

DayCell.displayName = 'DayCell';
export default DayCell;
