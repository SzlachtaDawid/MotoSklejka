"use server";
import { auth } from "@/auth";
import { prisma } from "@/app/lib/db";
import { MOTORCYCLE_TYPES, RIDING_STYLES, DAILY_TRIP_LIMIT, MAX_TRIPS_CREATED_PER_DAY } from "@/app/lib/tripOptions";

type Location = {
  lat: number;
  lng: number;
};

type CreateTripInput = {
  startDateTime: string;
  destination: string;
  groupSize: string;
  estimatedDuration: string;
  estimatedDistanceKm: string;
  returnToStart: boolean;
  motorcycleTypes: string[];
  ridingStyle: string[];
  location: Location | null;
};

const MOTORCYCLE_TYPE_VALUES = MOTORCYCLE_TYPES.map((t) => t.value);
const RIDING_STYLE_VALUES = RIDING_STYLES.map((s) => s.value);

const startOfDay = (date: Date) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

const startOfNextDay = (date: Date) => {
  const result = startOfDay(date);
  result.setDate(result.getDate() + 1);
  return result;
};

export async function createTrip(data: CreateTripInput) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Musisz być zalogowany, aby zaplanować wyjazd" };
  }

  const location = data.location;
  const startDateTime = new Date(data.startDateTime);
  const groupSize = Number(data.groupSize);
  const estimatedDistanceKm = Number(data.estimatedDistanceKm);

  const isValid =
    Boolean(data.destination) &&
    Boolean(data.estimatedDuration) &&
    !Number.isNaN(startDateTime.getTime()) &&
    Number.isFinite(groupSize) &&
    groupSize > 0 &&
    Number.isFinite(estimatedDistanceKm) &&
    estimatedDistanceKm > 0 &&
    data.motorcycleTypes.length > 0 &&
    data.motorcycleTypes.every((type) => MOTORCYCLE_TYPE_VALUES.includes(type as (typeof MOTORCYCLE_TYPE_VALUES)[number])) &&
    data.ridingStyle.length > 0 &&
    data.ridingStyle.every((style) => RIDING_STYLE_VALUES.includes(style as (typeof RIDING_STYLE_VALUES)[number])) &&
    location !== null &&
    Number.isFinite(location.lat) &&
    Number.isFinite(location.lng);

  if (!isValid || !location) {
    return { error: "Nieprawidłowe dane formularza" };
  }

  try {
    const tripsOnSameDate = await prisma.trip.count({
      where: {
        userId: session.user.id,
        startDateTime: { gte: startOfDay(startDateTime), lt: startOfNextDay(startDateTime) },
      },
    });
    if (tripsOnSameDate >= DAILY_TRIP_LIMIT) {
      return { error: "Możesz zaplanować maksymalnie 2 wyjazdy na ten dzień" };
    }

    const now = new Date();
    const tripsCreatedToday = await prisma.trip.count({
      where: {
        userId: session.user.id,
        createdAt: { gte: startOfDay(now), lt: startOfNextDay(now) },
      },
    });
    if (tripsCreatedToday >= MAX_TRIPS_CREATED_PER_DAY) {
      return { error: "Możesz dodać maksymalnie 5 wyjazdów dziennie" };
    }

    await prisma.trip.create({
      data: {
        userId: session.user.id,
        startDateTime,
        destination: data.destination,
        groupSize,
        estimatedDuration: data.estimatedDuration,
        estimatedDistanceKm,
        returnToStart: data.returnToStart,
        motorcycleTypes: data.motorcycleTypes,
        ridingStyle: data.ridingStyle,
        lat: location.lat,
        lng: location.lng,
      },
    });

    return { success: true };
  } catch {
    return { error: "Nie udało się zapisać wyjazdu, spróbuj ponownie" };
  }
}
