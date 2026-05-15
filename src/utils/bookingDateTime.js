const getSafeDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const getSafeBusinessDate = (businessDate) => {
  if (!businessDate) return null;
  return getSafeDate(`${businessDate}T12:00:00`);
};

export const getBookingDisplayDate = (booking) => {
  if (booking?.businessDate) {
    const businessDate = getSafeBusinessDate(booking.businessDate);
    if (businessDate) {
      return businessDate;
    }
  }

  return getSafeDate(booking?.scheduledAt || booking?.date || '');
};

export const formatBookingDateLabel = (booking, lang) => {
  const date = getBookingDisplayDate(booking);
  if (!date) return '';

  return date.toLocaleDateString(lang === 'ar' ? 'ar-KW' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const getBookingDateTimeValue = (booking) => {
  const scheduledAt = getSafeDate(booking?.scheduledAt || booking?.date || '');
  if (scheduledAt) {
    return scheduledAt.getTime();
  }

  if (booking?.businessDate) {
    const fallback = getSafeDate(
      `${booking.businessDate}T${booking.time || '00:00'}`,
    );
    return fallback ? fallback.getTime() : Number.POSITIVE_INFINITY;
  }

  return Number.POSITIVE_INFINITY;
};

export const getBookingDateInputValue = (bookingOrDate, businessDate = '') => {
  if (
    bookingOrDate &&
    typeof bookingOrDate === 'object' &&
    !Array.isArray(bookingOrDate)
  ) {
    if (bookingOrDate.businessDate) {
      return bookingOrDate.businessDate;
    }

    return getBookingDateInputValue(
      bookingOrDate.scheduledAt || bookingOrDate.date || '',
    );
  }

  if (businessDate) {
    return businessDate;
  }

  const date = getSafeDate(bookingOrDate);
  if (!date) {
    return '';
  }

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
};

export const formatBookingDateTime = (
  dateOrBooking,
  time,
  lang,
  businessDate = '',
) => {
  const date =
    dateOrBooking && typeof dateOrBooking === 'object'
      ? getBookingDisplayDate(dateOrBooking)
      : businessDate
        ? getSafeBusinessDate(businessDate)
        : getSafeDate(dateOrBooking);

  if (!date) return time || '';

  return `${date.toLocaleDateString(lang === 'ar' ? 'ar-KW' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })} • ${time}`;
};
