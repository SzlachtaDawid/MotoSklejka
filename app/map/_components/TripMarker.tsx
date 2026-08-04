import { AdvancedMarker, InfoWindow, useAdvancedMarkerRef } from "@vis.gl/react-google-maps";
import { TripForMap } from "../page";
import { Rocket } from "lucide-react";
import DirectionButton from "../../_components/DirectionButton";

type TripMarkerProps = {
  trip: TripForMap;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

const TripMarker = ({ trip, isOpen, onOpen, onClose }: TripMarkerProps) => {
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <>
      <AdvancedMarker ref={markerRef} position={{ lat: trip.lat, lng: trip.lng }} onClick={onOpen}>
        <div className="btn-soft flex h-8 w-8 items-center justify-center rounded-full bg-[#605dff86]">
          <Rocket size={20} color="black" />
        </div>
      </AdvancedMarker>
      {isOpen && marker && (
        <InfoWindow anchor={marker} headerDisabled onCloseClick={onClose}>
          <div className="relative flex flex-col gap-1 p-1 pr-6">
            <button
              className="btn btn-xs btn-circle btn-ghost absolute top-0 right-2 text-neutral-600"
              aria-label="Zamknij"
              onClick={onClose}
            >
              ✕
            </button>
            <p className="font-semibold text-neutral-800">{trip.destination}</p>
            <p className="text-neutral-800">{trip.startDateTime.toLocaleString("pl-PL")}</p>
            <p className="text-neutral-800">Grupa: {trip.groupSize} osób</p>
            <p className="text-neutral-800">Czas trwania: {trip.estimatedDuration}</p>
            <p className="text-neutral-800">Dystans: {trip.estimatedDistanceKm} km</p>
            <p className="text-neutral-800">Motocykle: {trip.motorcycleTypes.join(", ")}</p>
            <p className="text-neutral-800">Styl jazdy: {trip.ridingStyle.join(", ")}</p>
            {trip.returnToStart && <p className="text-neutral-800">Powrót do punktu startu</p>}
            <DirectionButton lat={trip.lat} lng={trip.lng} />
          </div>
        </InfoWindow>
      )}
    </>
  );
};

export default TripMarker;
