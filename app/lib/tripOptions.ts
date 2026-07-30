export const MOTORCYCLE_TYPES = [
  { value: "naked", label: "Naked" },
  { value: "turystyk", label: "Turystyk" },
  { value: "sport", label: "Sport" },
  { value: "adventure", label: "Adventure" },
  { value: "enduro", label: "Enduro" },
  { value: "cruiser", label: "Cruiser" },
  { value: "chopper", label: "Chopper" },
  { value: "skuter", label: "Skuter" },
] as const;

export const RIDING_STYLES = [
  { value: "spokojny", label: "Spokojny" },
  { value: "sportowy", label: "Sportowy" },
  { value: "turystyczny", label: "Turystyczny" },
  { value: "offroad", label: "Offroad" },
  { value: "miejski", label: "Miejski" },
] as const;

// Max tripów na tę samą datę wyjazdu (startDateTime) dla jednego użytkownika.
export const DAILY_TRIP_LIMIT = 2;

// Max tripów dodanych (createdAt) przez jednego użytkownika w jednym dniu kalendarzowym — anty-spam.
export const MAX_TRIPS_CREATED_PER_DAY = 5;
