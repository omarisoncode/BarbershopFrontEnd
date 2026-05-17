export const escapeCSVValue = (value) => {
  const normalized = String(value ?? '');

  // Quote fields that would otherwise break the CSV shape in spreadsheet apps.
  if (/[",\n]/.test(normalized)) {
    return `"${normalized.replace(/"/g, '""')}"`;
  }

  return normalized;
};

const getServiceLabel = (booking) => {
  if (typeof booking?.service === 'string') {
    return booking.service;
  }

  if (booking?.service?.name) {
    return booking.service.name;
  }

  if (booking?.service?.nameAr) {
    return booking.service.nameAr;
  }

  return booking?.serviceName || '';
};

const getBarberLabel = (booking) => {
  if (booking?.barber?.name) {
    return booking.barber.name;
  }

  if (booking?.barber?.nameAr) {
    return booking.barber.nameAr;
  }

  return booking?.barberName || '';
};

const getPhoneLabel = (booking) => {
  const countryCode = booking?.user?.countryCode || '';
  const phone = booking?.user?.phone || '';

  if (!phone) return '';
  return `${countryCode}${phone}`.trim();
};

export const buildBookingsCSV = (bookings = []) => {
  if (!bookings.length) return '';

  const headers = [
    'Customer Name',
    'Email',
    'Phone',
    'Service',
    'Barber',
    'Date',
    'Time',
    'Status',
  ];

  const rows = bookings.map((b) => [
    b.user?.name || '',
    b.user?.email || '',
    getPhoneLabel(b),
    getServiceLabel(b),
    getBarberLabel(b),
    b.businessDate || b.date || '',
    b.time || '',
    b.status || '',
  ]);

  return [headers, ...rows]
    .map((row) => row.map((value) => escapeCSVValue(value)).join(','))
    .join('\n');
};

export const exportBookingsToCSV = (bookings, filename = 'bookings.csv') => {
  const csvContent = buildBookingsCSV(bookings);
  if (!csvContent) return;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');

  link.setAttribute('href', url);
  link.setAttribute('download', filename);

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
