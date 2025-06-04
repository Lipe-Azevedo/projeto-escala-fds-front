'use client';

import React, { useMemo } from 'react';

interface Day {
  date: Date;
  isCurrentMonth: boolean;
  isDayOff?: boolean;
  dayOfMonth: number;
}

interface CalendarViewProps {
  year: number;
  month: number; // 0 = Janeiro, 1 = Fevereiro, ...
  workInfo?: {
    weekday_off: string; // ex: "monday", "tuesday", etc. (minúsculo)
    // weekend_day_off não será mais uma string fixa, mas podemos manter para outros usos ou remover
    // weekend_day_off_saturday: boolean; // Ou uma configuração para qual dia começa a alternância
  };
}

const dayNameToIndex: { [key: string]: number } = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

export default function CalendarView({ year, month, workInfo }: CalendarViewProps) {
  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay(); // 0 (Dom) - 6 (Sáb)

  // Função para obter o número da semana DENTRO DO MÊS ATUAL (1 a 5/6)
  // Considerando que a semana começa no Domingo (índice 0)
  const getWeekOfMonth = (date: Date): number => {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstSundayOfMonth = new Date(firstDayOfMonth);
    // Ajusta para o primeiro domingo do mês ou antes dele que inicia a semana no calendário
    firstSundayOfMonth.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay());

    const diffInTime = date.getTime() - firstSundayOfMonth.getTime();
    const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));
    return Math.floor(diffInDays / 7) + 1;
  };


  const generateCalendarGrid = (): Day[] => {
    const daysArray: Day[] = [];
    const numDaysThisMonth = getDaysInMonth(year, month);
    const firstDayIndex = getFirstDayOfMonth(year, month); // Dia da semana do primeiro dia do mês (0=Dom)

    const prevMonth = month === 0 ? 11 : month - 1;
    const prevMonthYear = month === 0 ? year - 1 : year;
    const numDaysPrevMonth = getDaysInMonth(prevMonthYear, prevMonth);

    // Dias do mês anterior
    for (let i = 0; i < firstDayIndex; i++) {
      const day = numDaysPrevMonth - firstDayIndex + 1 + i;
      const date = new Date(prevMonthYear, prevMonth, day);
      daysArray.push({ date, dayOfMonth: day, isCurrentMonth: false });
    }

    // Dias do mês atual
    for (let i = 1; i <= numDaysThisMonth; i++) {
      const date = new Date(year, month, i);
      let isDayOff = false;
      const dayOfWeek = date.getDay(); // 0 para Domingo, ..., 6 para Sábado

      if (workInfo) {
        // Verifica folga da semana (weekday_off)
        if (workInfo.weekday_off && dayNameToIndex[workInfo.weekday_off.toLowerCase()] === dayOfWeek) {
          isDayOff = true;
        }

        // Lógica para folga de fim de semana alternada
        // Assumindo que a alternância é: Semana Ímpar do Mês = Domingo, Semana Par = Sábado
        // Ou você pode ter um campo no WorkInfo para indicar qual dia é a folga "base" do fim de semana.
        // Por simplicidade, vamos usar o número da semana dentro do mês.
        if (!isDayOff) { // Só verifica folga de fds se já não for a folga da semana
          const weekOfMonth = getWeekOfMonth(date);
          if (weekOfMonth % 2 !== 0) { // Semana Ímpar (1, 3, 5) - Folga no Domingo
            if (dayOfWeek === dayNameToIndex.sunday) {
              isDayOff = true;
            }
          } else { // Semana Par (2, 4, 6) - Folga no Sábado
            if (dayOfWeek === dayNameToIndex.saturday) {
              isDayOff = true;
            }
          }
        }
      }
      daysArray.push({ date, dayOfMonth: i, isCurrentMonth: true, isDayOff });
    }

    const nextMonth = month === 11 ? 0 : month + 1;
    const nextMonthYear = month === 11 ? year + 1 : year;
    const cellsSoFar = daysArray.length;
    const remainingCells = 42 - cellsSoFar;

    for (let i = 1; i <= remainingCells; i++) {
      const date = new Date(nextMonthYear, nextMonth, i);
      daysArray.push({ date, dayOfMonth: i, isCurrentMonth: false });
    }
    return daysArray.slice(0, 42);
  };

  const calendarGrid = useMemo(() => generateCalendarGrid(), [year, month, workInfo]);
  const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="calendar-container bg-gray-800 p-4 rounded-lg shadow-lg">
      <div className="grid grid-cols-7 gap-px text-center text-xs sm:text-sm mb-2 text-gray-400">
        {weekdays.map((day) => (
          <div key={day} className="font-medium py-2">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px">
        {calendarGrid.map((dayCell, index) => (
          <div
            key={`${dayCell.date.toISOString()}-${index}`}
            className={`
              p-1 sm:p-2 h-20 sm:h-24 border border-gray-700 
              flex flex-col items-center justify-start
              ${dayCell.isCurrentMonth ? 'bg-gray-700 text-white' : 'bg-gray-850 text-gray-500'}
              ${dayCell.isDayOff && dayCell.isCurrentMonth ? 'bg-green-700 hover:bg-green-600 font-semibold' : dayCell.isCurrentMonth ? 'hover:bg-gray-600' : ''}
              rounded-sm transition-colors duration-150
            `}
          >
            <span className={`text-sm sm:text-base ${dayCell.isCurrentMonth ? '' : 'opacity-60'}`}>
              {dayCell.dayOfMonth}
            </span>
            {dayCell.isDayOff && dayCell.isCurrentMonth && (
              <span className="mt-1 text-xs text-green-300 bg-green-900 px-1.5 py-0.5 rounded">Folga</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}