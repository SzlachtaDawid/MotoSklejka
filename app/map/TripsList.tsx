import DirectionButton from "../_components/DirectionButton";
import { TripForMap } from "./page";

type Props = {
  trips: TripForMap[];
};

const TripsList = ({ trips }: Props) => {
  return (
    <div className="flex flex-row flex-wrap justify-center gap-4">
      {trips.map(
        ({
          id,
          user,
          destination,
          startDateTime,
          groupSize,
          estimatedDistanceKm,
          estimatedDuration,
          motorcycleTypes,
          ridingStyle,
          returnToStart,
          lat,
          lng,
        }) => (
          <div key={id} className="bg-base-300 rounded-box w-full max-w-sm shrink-0 p-4 shadow-md">
            <p className="mb-4 text-2xl">{user.name}</p>
            <p className="text-xs font-semibold uppercase opacity-60">{destination}</p>
            <p>{startDateTime.toLocaleString("pl-PL", { dateStyle: "full", timeStyle: "short" })}</p>
            <p>Grupa: {groupSize} osób</p>
            <p>Czas trwania: {estimatedDuration}</p>
            <p>Dystans: {estimatedDistanceKm} km</p>
            <p>Motocykle: {motorcycleTypes.join(", ")}</p>
            <p>Styl jazdy: {ridingStyle.join(", ")}</p>
            <p>Powrót do punktu startu: {returnToStart ? "Tak" : "Nie"}</p>
            <DirectionButton lat={lat} lng={lng} />
          </div>
        )
      )}
    </div>
  );
};

export default TripsList;
