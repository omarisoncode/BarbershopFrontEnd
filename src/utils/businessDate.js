export const BUSINESS_TIMEZONE = 'Asia/Kuwait';

export const getBusinessDateParts = (date, timeZone = BUSINESS_TIMEZONE) => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const parts = formatter.formatToParts(date);
  const year = Number(parts.find((part) => part.type === 'year')?.value || 0);
  const month = Number(parts.find((part) => part.type === 'month')?.value || 0);
  const day = Number(parts.find((part) => part.type === 'day')?.value || 0);

  return {
    year,
    month,
    day,
    key: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
  };
};

export const getBusinessDateKey = (date, timeZone = BUSINESS_TIMEZONE) =>
  getBusinessDateParts(date, timeZone).key;

export const isPastBusinessDate = (dateString, now = new Date(), timeZone = BUSINESS_TIMEZONE) => {
  if (!dateString) return false;
  return String(dateString) < getBusinessDateKey(now, timeZone);
};
