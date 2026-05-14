export const escapeCSVValue = (value) => {
  const normalized = String(value ?? '');

  // Quote fields that would otherwise break the CSV shape in spreadsheet apps.
  if (/[",\n]/.test(normalized)) {
    return `"${normalized.replace(/"/g, '""')}"`;
  }

  return normalized;
};

export const buildBookingsCSV = (bookings = []) => {
  if (!bookings.length) return '';

  const headers = [
    'Customer Name',
    'Email',
    'Phone',
    'Service',
    'Date',
    'Time',
    'Status',
  ];

  const rows = bookings.map((b) => [
    b.user?.name || '',
    b.user?.email || '',
    b.user?.phone || '',
    b.service || '',
    b.date || '',
    b.time || '',
    b.status || '',
  ]);

  return [headers, ...rows]
    .map((row) => row.map((value) => escapeCSVValue(value)).join(','))
    .join('\n');
};

export const exportBookingsToCSV = (bookings) => {
  const csvContent = buildBookingsCSV(bookings);
  if (!csvContent) return;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');

  link.setAttribute('href', url);
  link.setAttribute('download', 'bookings.csv');

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
