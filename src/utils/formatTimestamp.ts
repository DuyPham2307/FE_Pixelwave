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

export function formatRelativeTime(timestamp: string | Date): string {
  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = now.getTime() - time.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 60) {
    return `${diffMinutes} phút trước`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} giờ trước`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return `${diffDays} ngày trước`;
  }

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffDays < 60) { // tức dưới 2 tháng
    return `${diffWeeks} tuần trước`;
  }

  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths} tháng trước`;
}

