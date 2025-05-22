export function formatTimestamp(isoString?: string): string {
  if (!isoString || typeof isoString !== 'string') {
    return "Invalid date";
  }

  // Chuẩn hóa chuỗi ISO: cắt bớt microseconds nếu cần
  const trimmedIsoString = isoString.replace(
    /\.(\d{3})\d*(Z|[+-]\d{2}:\d{2})?$/,
    '.$1$2'
  );

  const date = new Date(trimmedIsoString);

  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  const pad = (n: number): string => (n < 10 ? '0' + n : n.toString());

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${day}-${month}-${year} ${hours}:${minutes}`;
}
