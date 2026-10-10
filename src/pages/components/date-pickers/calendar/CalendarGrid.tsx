import React from 'react';
import { WEEKDAYS, WEEKDAYS_LONG, dateKey, monthMatrix } from '../utils/dateMath';
import { DayCell, type DayState } from './DayCell';

export type CellDensity = 'default' | 'narrow' | 'fluid';

interface CalendarGridProps {
  month: Date;
  labelId: string;
  hideOutside: boolean;
  touch: boolean;
  density: CellDensity;
  getState: (d: Date, inMonth: boolean) => DayState;
  onSelect: (d: Date) => void;
  onKey: (e: React.KeyboardEvent, d: Date) => void;
  onHover: (d: Date | null) => void;
}

/** One month as an ARIA grid: Monday-first weekday row + 6 weeks of day cells. */
export const CalendarGrid: React.FC<CalendarGridProps> = ({ month, labelId, hideOutside, touch, density, getState, onSelect, onKey, onHover }) => {
  const fluid = touch || density === 'fluid';
  const tdClass = `${touch ? 'h-11' : 'h-10'} ${fluid ? '' : density === 'narrow' ? 'w-9' : 'w-10'}`;
  return (
    <table role="grid" aria-labelledby={labelId} className={`border-collapse ${fluid ? 'w-full table-fixed' : ''}`}>
      <thead>
        <tr data-part="weekdays">
          {WEEKDAYS.map((w, i) => (
            <th key={w} scope="col" className="h-8 p-0 text-center text-[11px] leading-4 font-medium tracking-[0.08em] text-[#6B7485]">
              <span aria-hidden="true">{w}</span>
              <span className="sr-only">{WEEKDAYS_LONG[i]}</span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody onMouseLeave={() => onHover(null)}>
        {monthMatrix(month).map((week) => (
          <tr key={dateKey(week[0])}>
            {week.map((d) => {
              const inMonth = d.getMonth() === month.getMonth();
              if (!inMonth && hideOutside) return <td key={dateKey(d)} role="gridcell" className={`p-0 ${tdClass}`} />;
              return (
                <DayCell
                  key={dateKey(d)}
                  state={getState(d, inMonth)}
                  touch={touch}
                  tdClass={tdClass}
                  onSelect={onSelect}
                  onKey={onKey}
                  onHover={onHover}
                />
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
