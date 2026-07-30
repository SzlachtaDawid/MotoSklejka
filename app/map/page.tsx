import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/app/lib/db";
import MapView from "./MapView";
import TripsList from "./TripsList";

const tripSelect = {
  id: true,
  startDateTime: true,
  destination: true,
  groupSize: true,
  estimatedDuration: true,
  estimatedDistanceKm: true,
  returnToStart: true,
  motorcycleTypes: true,
  ridingStyle: true,
  lat: true,
  lng: true,
  user: true,
} satisfies Prisma.TripSelect;

export type TripForMap = Prisma.TripGetPayload<{ select: typeof tripSelect }>;

const Map = async () => {
  const trips = await prisma.trip.findMany({
    where: { startDateTime: { gte: new Date() } },
    select: tripSelect,
    orderBy: { startDateTime: "asc" },
  });

  return (
    <div className="flex flex-col gap-6 py-10">
      <h1 className="text-center text-3xl font-bold">Mapa oraz lista Sklejek</h1>
      <MapView trips={trips} />
      <TripsList trips={trips} />
    </div>
  );
};

export default Map;
