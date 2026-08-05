"use server";
import { auth } from "@/auth";
import { prisma } from "@/app/lib/db";
import { DAILY_TRIP_LIMIT, MAX_TRIPS_CREATED_PER_DAY } from "@/app/lib/tripOptions";
import { revalidatePath } from "next/cache";

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
  location: Location;
};

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

  const startDateTime = new Date(data.startDateTime);
  const groupSize = Number(data.groupSize);
  const estimatedDistanceKm = Number(data.estimatedDistanceKm);

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
        lat: data.location.lat,
        lng: data.location.lng,
      },
    });

    revalidatePath("/map");
    return { success: true };
  } catch {
    return { error: "Nie udało się zapisać wyjazdu, spróbuj ponownie" };
  }
}
