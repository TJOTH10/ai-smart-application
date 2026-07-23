import dayjs from 'dayjs'

export function formatTime(date?: string | number, format = 'YYYY-MM-DD HH:mm:ss'): string {
  if (!date) return '-'
  return dayjs(date).format(format)
}
