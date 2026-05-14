/* eslint-disable no-unused-vars */
import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getBusinessDateParts } from '../utils/businessDate';

const Calendar = ({ onSelectDate, lang, bookedDates = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [direction, setDirection] = useState(0);

  const isRTL = lang === 'ar';

  const daysShort = useMemo(
    () =>
      isRTL
        ? ['???', '???', '???', '???', '???', '???', '???']
        : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    [isRTL],
  );

  const months = useMemo(
    () =>
      isRTL
        ? [
            'يناير',
            'فبراير',
            'مارس',
            'أبريل',
            'مايو',
            'يونيو',
            'يوليو',
            'أغسطس',
            'سبتمبر',
            'أكتوبر',
            'نوفمبر',
            'ديسمبر',
          ]
        : [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ],
    [isRTL],
  );

  const kuwaitToday = useMemo(() => {
    return getBusinessDateParts(new Date());
  }, []);

  const isViewingCurrentMonth =
    currentDate.getMonth() + 1 === kuwaitToday.month &&
    currentDate.getFullYear() === kuwaitToday.year;

  const nextMonth = () => {
    setDirection(1);
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  const prevMonth = () => {
    if (isViewingCurrentMonth) {
      return;
    }

    setDirection(-1);
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  const daysGrid = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const days = [];

    for (let index = 0; index < firstDayOfMonth; index += 1) {
      days.push({ day: '', isCurrentMonth: false, key: `empty-${index}` });
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const dateObj = new Date(year, month, day);
      const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isPast = key < kuwaitToday.key;

      if (isPast) {
        days.push({
          day: '',
          isCurrentMonth: false,
          isPast: true,
          key: `past-${key}`,
        });
        continue;
      }

      days.push({
        day,
        dateObj,
        isCurrentMonth: true,
        isPast: false,
        isToday: key === kuwaitToday.key,
        isBooked: bookedDates.includes(key),
        key,
      });
    }

    return days;
  }, [bookedDates, currentDate, kuwaitToday.key]);

  const handleDateClick = (dayObj) => {
    if (!dayObj.isCurrentMonth || dayObj.isPast || dayObj.isBooked) {
      return;
    }

    setSelectedDate(dayObj.dateObj);

    const year = dayObj.dateObj.getFullYear();
    const month = String(dayObj.dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dayObj.dateObj.getDate()).padStart(2, '0');
    onSelectDate(`${year}-${month}-${day}`);
  };

  const slideVariants = {
    enter: (dir) => ({ x: isRTL ? -dir * 40 : dir * 40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: isRTL ? dir * 40 : -dir * 40, opacity: 0 }),
  };

  return (
    <div className='mx-auto w-full max-w-full overflow-hidden rounded-2xl border border-gray-100 bg-white p-3 shadow-2xl dark:border-gray-700 dark:bg-gray-800 sm:max-w-md sm:p-6'>
      <div className='relative mb-5 flex items-center justify-between sm:mb-6 sm:h-8'>
        <button
          onClick={prevMonth}
          disabled={isViewingCurrentMonth}
          className={`z-10 min-h-11 min-w-11 rounded-xl p-2 transition-all ${
            isViewingCurrentMonth
              ? 'opacity-20 cursor-not-allowed'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-brand-gold'
          }`}
        >
          {isRTL ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>

        <AnimatePresence mode='wait'>
          <motion.h3
            key={`${currentDate.getMonth()}-${currentDate.getFullYear()}`}
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -5, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='pointer-events-none absolute left-12 right-12 text-center text-base font-bold text-gray-900 dark:text-white sm:left-0 sm:right-0 sm:text-lg'
          >
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </motion.h3>
        </AnimatePresence>

        <button
          onClick={nextMonth}
          className='z-10 min-h-11 min-w-11 rounded-xl p-2 text-gray-600 hover:bg-gray-100 hover:text-brand-gold dark:text-gray-300 dark:hover:bg-gray-700'
        >
          {isRTL ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <div className='mb-2 grid grid-cols-7 gap-0.5 sm:gap-1.5'>
        {daysShort.map((day) => (
          <div
            key={day}
            className='py-2 text-center text-[8px] font-bold uppercase tracking-tight text-gray-400 dark:text-gray-500 sm:text-[10px]'
          >
            {day}
          </div>
        ))}
      </div>

      <div className='relative min-h-[18.5rem] sm:min-h-65'>
        <AnimatePresence initial={false} custom={direction} mode='popLayout'>
          <motion.div
            key={`${currentDate.getMonth()}-${currentDate.getFullYear()}`}
            custom={direction}
            variants={slideVariants}
            initial='enter'
            animate='center'
            exit='exit'
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            className='grid grid-cols-7 gap-0.5 sm:gap-1.5'
          >
            {daysGrid.map((dayObj) => {
              const isSelected =
                selectedDate &&
                dayObj.dateObj &&
                selectedDate.toDateString() === dayObj.dateObj.toDateString();
              const isDisabled =
                !dayObj.isCurrentMonth || dayObj.isPast || dayObj.isBooked;

              return (
                <button
                  key={dayObj.key}
                  type='button'
                  disabled={isDisabled}
                  onClick={() => handleDateClick(dayObj)}
                  aria-label={dayObj.day ? `Select ${dayObj.key}` : 'Unavailable date'}
                  className={`relative flex h-11 items-center justify-center rounded-xl text-sm font-medium transition-all sm:h-10 ${
                    !dayObj.isCurrentMonth || dayObj.isPast ? 'invisible pointer-events-none' : ''
                  } ${
                    dayObj.isPast
                      ? 'cursor-not-allowed text-gray-300 dark:text-gray-600'
                      : dayObj.isBooked
                        ? 'cursor-not-allowed text-red-300 line-through dark:text-red-900/50'
                        : 'cursor-pointer text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                  } ${
                    isDisabled ? 'disabled:cursor-not-allowed' : ''
                  }`}
                >
                  {dayObj.isToday && !isSelected && (
                    <span className='absolute bottom-1.5 w-1 h-1 bg-brand-gold rounded-full' />
                  )}

                  {isSelected && (
                    <motion.div
                      layoutId='activeDay'
                      className='absolute inset-0 bg-brand-gold rounded-xl shadow-lg z-0'
                    />
                  )}

                  <span
                    className={`relative z-10 ${
                      isSelected
                        ? 'text-black font-bold'
                        : dayObj.isToday
                          ? 'text-brand-gold font-bold'
                          : ''
                    }`}
                  >
                    {dayObj.day}
                  </span>
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Calendar;
