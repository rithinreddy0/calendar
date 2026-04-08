export interface Holiday {
  date: string; // YYYY-MM-DD
  name: string;
  emoji: string;
  color: string;
}

export const holidays2026: Holiday[] = [
  // January
  { date: "2026-01-01", name: "New Year's Day", emoji: "🎆", color: "#facc15" },
  { date: "2026-01-14", name: "Makar Sankranti", emoji: "🪁", color: "#f97316" },
  { date: "2026-01-26", name: "Republic Day", emoji: "🇮🇳", color: "#f97316" },
  // February
  { date: "2026-02-14", name: "Valentine's Day", emoji: "💖", color: "#f472b6" },
  { date: "2026-02-19", name: "Chhatrapati Shivaji Jayanti", emoji: "⚔️", color: "#fb923c" },
  // March
  { date: "2026-03-08", name: "International Women's Day", emoji: "👩", color: "#c084fc" },
  { date: "2026-03-20", name: "Holi", emoji: "🎨", color: "#f472b6" },
  // April
  { date: "2026-04-01", name: "April Fools' Day", emoji: "🃏", color: "#facc15" },
  { date: "2026-04-14", name: "Dr. Ambedkar Jayanti", emoji: "📚", color: "#38bdf8" },
  { date: "2026-04-14", name: "Tamil New Year", emoji: "🌅", color: "#34d399" },
  // May
  { date: "2026-05-01", name: "Labour Day", emoji: "⚒️", color: "#a3e635" },
  { date: "2026-05-09", name: "Rabindranath Tagore Jayanti", emoji: "📜", color: "#c084fc" },
  // June
  { date: "2026-06-21", name: "International Yoga Day", emoji: "🧘", color: "#34d399" },
  // August
  { date: "2026-08-15", name: "Independence Day", emoji: "🇮🇳", color: "#f97316" },
  { date: "2026-08-15", name: "Raksha Bandhan", emoji: "🧣", color: "#f472b6" },
  // September
  { date: "2026-09-05", name: "Teachers' Day", emoji: "🍎", color: "#f97316" },
  // October
  { date: "2026-10-02", name: "Gandhi Jayanti", emoji: "☮️", color: "#34d399" },
  { date: "2026-10-31", name: "Halloween", emoji: "🎃", color: "#f97316" },
  // November
  { date: "2026-11-14", name: "Children's Day", emoji: "👶", color: "#facc15" },
  // December
  { date: "2026-12-25", name: "Christmas", emoji: "🎄", color: "#34d399" },
  { date: "2026-12-31", name: "New Year's Eve", emoji: "🎉", color: "#facc15" },
];

export function getHolidaysForDate(dateStr: string): Holiday[] {
  return holidays2026.filter(h => h.date === dateStr);
}

export function getHolidaysForMonth(year: number, month: number): Map<string, Holiday[]> {
  const map = new Map<string, Holiday[]>();
  holidays2026.forEach(h => {
    const d = new Date(h.date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const key = h.date;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(h);
    }
  });
  return map;
}
