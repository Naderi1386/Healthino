import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { DailyLog } from '../../../core/db/types';

export interface CalendarGridProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  allLogs: DailyLog[];
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  selectedDate,
  onDateSelect,
  allLogs,
}) => {
  const [viewDate, setViewDate] = useState<Date>(new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  // Generate calendar days
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDayOfWeek = new Date(year, month, 1).getDay();

  const dayCells: React.ReactNode[] = [];

  // Empty cells for alignment before first day of month
  for (let i = 0; i < startDayOfWeek; i++) {
    dayCells.push(<div key={`empty-${i}`} className="h-11 w-full" />);
  }

  // Days of month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayStr = String(day).padStart(2, '0');
    const monthStr = String(month + 1).padStart(2, '0');
    const dateKey = `${year}-${monthStr}-${dayStr}`;

    const log = allLogs.find((l) => l.date === dateKey);
    const greenCount = log?.tags.filter((t) => t.includes('🟢')).length ?? 0;
    const redCount = log?.tags.filter((t) => t.includes('🔴')).length ?? 0;

    // Ambient status background styling
    let bgStyle = 'bg-background hover:bg-text-primary/5 text-text-primary/80';
    if (log && (log.waterGlasses > 0 || log.tags.length > 0)) {
      if (greenCount > redCount) {
        bgStyle = 'bg-accent-primary/15 text-accent-primary hover:bg-accent-primary/25';
      } else if (redCount > greenCount) {
        bgStyle = 'bg-alert/15 text-alert hover:bg-alert/25';
      }
    }

    const isSelected = dateKey === selectedDate;
    const isToday = new Date().toISOString().split('T')[0] === dateKey;

    dayCells.push(
      <motion.button
        key={`day-${day}`}
        type="button"
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        onClick={() => onDateSelect(dateKey)}
        className={`h-11 w-full rounded-xl flex flex-col items-center justify-center text-sm font-semibold select-none transition-all duration-200 cursor-pointer ${bgStyle} ${
          isSelected
            ? 'ring-2 ring-accent-primary ring-offset-2 scale-105 z-10 font-bold'
            : isToday
            ? 'border border-accent-secondary/50 font-bold'
            : ''
        }`}
        title={`${dateKey}${log ? ` (Water: ${log.waterGlasses}, Tags: ${log.tags.length})` : ''}`}
      >
        <span>{day}</span>
        {log && (log.waterGlasses > 0 || log.tags.length > 0) && (
          <span className="w-1.5 h-1.5 rounded-full bg-current mt-0.5" />
        )}
      </motion.button>
    );
  }

  return (
    <div className="font-sans select-none">
      {/* Month Navigation Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-text-primary">
          {MONTH_NAMES[month]} {year}
        </h3>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="w-11 h-11 flex items-center justify-center rounded-xl border border-text-primary/5 bg-card-bg hover:bg-text-primary/5 cursor-pointer transition-colors"
            aria-label="Previous Month"
          >
            <ChevronLeft className="w-5 h-5 text-text-primary" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="w-11 h-11 flex items-center justify-center rounded-xl border border-text-primary/5 bg-card-bg hover:bg-text-primary/5 cursor-pointer transition-colors"
            aria-label="Next Month"
          >
            <ChevronRight className="w-5 h-5 text-text-primary" />
          </button>
        </div>
      </div>

      {/* Weekdays Row */}
      <div className="grid grid-cols-7 gap-1.5 mb-2 text-center text-xs font-bold uppercase tracking-wider text-text-primary/40">
        {WEEKDAYS.map((day) => (
          <div key={day} className="py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {dayCells}
      </div>
    </div>
  );
};
