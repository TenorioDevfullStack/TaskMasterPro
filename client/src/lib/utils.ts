import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isToday, isTomorrow, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = parseISO(dateString);
  
  if (isToday(date)) {
    return "Hoje";
  }
  
  if (isTomorrow(date)) {
    return "Amanhã";
  }
  
  return format(date, "EEE, dd MMM", { locale: ptBR });
}

export function formatTime(timeString: string): string {
  return timeString;
}

export function formatTimeRange(startTime: string, endTime: string): string {
  return `${startTime} - ${endTime}`;
}

export function getCurrentDateString(): string {
  return format(new Date(), "EEEE, dd MMM", { locale: ptBR });
}

export function getTodayDateString(): string {
  return format(new Date(), "yyyy-MM-dd");
}
