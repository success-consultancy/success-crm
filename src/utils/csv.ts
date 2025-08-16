export function arrayToCSV(data: any[]): string {
  if (!data || data.length === 0) {
    throw new Error('No data provided for CSV export');
  }

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','), // header row
    ...data.map((row) =>
      headers
        .map((field) => {
          const value = row[field] ?? '';
          // Escape quotes and wrap in quotes if contains comma, quote, or newline
          const escaped = String(value).replace(/"/g, '""');
          return /[",\n\r]/.test(escaped) ? `"${escaped}"` : escaped;
        })
        .join(','),
    ),
  ];

  return csvRows.join('\n');
}
