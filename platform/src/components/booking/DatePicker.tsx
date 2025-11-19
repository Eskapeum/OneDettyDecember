/**
 * Date Picker Component
 * Custom date picker with availability checking
 * Sprint 3 - Booking Flow
 * Developer: Tobi (Frontend)
 */

'use client';

import { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay,
  addMonths,
  subMonths,
  startOfDay,
  isBefore
} from 'date-fns';

interface DatePickerProps {
  packageId: string;
  startDate: Date;
  endDate: Date;
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

export function DatePicker({
  packageId,
  startDate,
  endDate,
  selectedDate,
  onDateSelect,
}: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availability, setAvailability] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  // Fetch availability for current month
  useEffect(() => {
    fetchAvailability();
  }, [currentMonth, packageId]);

  const fetchAvailability = async () => {
    setLoading(true);
    try {
      const monthStart = startOfMonth(currentMonth);
      const monthEnd = endOfMonth(currentMonth);

      const response = await fetch(
        `/api/availability/calendar/${packageId}?startDate=${monthStart.toISOString()}&endDate=${monthEnd.toISOString()}`
      );

      const data = await response.json();
      
      if (data.success) {
        const availabilityMap: Record<string, boolean> = {};
        data.data.days.forEach((day: any) => {
          availabilityMap[day.date] = day.available;
        });
        setAvailability(availabilityMap);
      }
    } catch (error) {
      console.error('Failed to fetch availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const isDateAvailable = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return availability[dateStr] !== false;
  };

  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date());
    return (
      isBefore(date, today) ||
      isBefore(date, startOfDay(startDate)) ||
      isBefore(endOfDay(endDate), date) ||
      !isDateAvailable(date)
    );
  };

  const handleDateClick = (date: Date) => {
    if (!isDateDisabled(date)) {
      onDateSelect(date);
    }
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  return (
    <div className="border rounded-lg p-4">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-600 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isDisabled = isDateDisabled(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);

          return (
            <button
              key={index}
              onClick={() => handleDateClick(day)}
              disabled={isDisabled}
              className={`
                aspect-square p-2 text-sm rounded-lg transition-colors
                ${!isCurrentMonth && 'text-gray-300'}
                ${isSelected && 'bg-blue-600 text-white font-semibold'}
                ${!isSelected && !isDisabled && isCurrentMonth && 'hover:bg-gray-100'}
                ${isDisabled && 'text-gray-300 cursor-not-allowed line-through'}
              `}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Loading availability...
        </div>
      )}
    </div>
  );
}

function endOfDay(date: Date): Date {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end;
}

