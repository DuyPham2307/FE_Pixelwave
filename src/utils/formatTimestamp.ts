export function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);

  const pad = (n: number): string => n < 10 ? '0' + n : n.toString();

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1); // Months are zero-indexed
  const year = date.getFullYear();

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${day}-${month}-${year} ${hours}:${minutes}`;
}
