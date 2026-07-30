"use client";

import { useMemo, useRef, useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
  useMapsLibrary,
  type MapMouseEvent,
} from "@vis.gl/react-google-maps";
import TripModal from "./TripModal";
import type { TripForMap } from "./page";
import TripMarker from "./TripMarker";

type SelectedLocation = {
  lat: number;
  lng: number;
};

type Props = {
  trips: TripForMap[];
};

const MapView = ({ trips }: Props) => {
  const [clickedPoint, setClickedPoint] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
  const [openTripId, setOpenTripId] = useState<string | null>(null);
  const [markerRef, marker] = useAdvancedMarkerRef();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const geocodingLib = useMapsLibrary("geocoding");
  const geocoder = useMemo(() => (geocodingLib ? new geocodingLib.Geocoder() : null), [geocodingLib]);

  const handleMapClick = (ev: MapMouseEvent) => {
    const latLng = ev.detail.latLng;
    if (!latLng) return;
    setClickedPoint(latLng);

    if (!geocoder) {
      setSelectedLocation({ lat: latLng.lat, lng: latLng.lng });
      return;
    }
  };

  const handleCloseInfoWindow = () => {
    setClickedPoint(null);
    setSelectedLocation(null);
  };

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY_DEMO!}>
      <div className="m-auto">
        <Map
          mapId="DEMO_MAP_ID"
          defaultCenter={{ lat: 52.0693, lng: 19.4803 }}
          defaultZoom={6}
          clickableIcons={false}
          onClick={handleMapClick}
          style={{ height: "500px", width: "500px" }}
        >
          {trips.map((trip) => (
            <TripMarker
              key={trip.id}
              trip={trip}
              isOpen={openTripId === trip.id}
              onOpen={() => setOpenTripId(trip.id)}
              onClose={() => setOpenTripId(null)}
            />
          ))}
          {clickedPoint && <AdvancedMarker ref={markerRef} position={clickedPoint} />}
          {selectedLocation && marker && (
            <InfoWindow anchor={marker} headerDisabled onCloseClick={() => setSelectedLocation(null)}>
              <div className="relative flex flex-col gap-2 p-1 pr-6">
                <button
                  className="btn btn-xs btn-circle btn-ghost absolute top-0 right-2 text-neutral-600"
                  aria-label="Zamknij"
                  onClick={handleCloseInfoWindow}
                >
                  ✕
                </button>
                <p className="font-semibold text-neutral-800">
                  To będzie <br />
                  twój punkt zbiórki <br />
                  Wybierz bezpiecznie, <br />
                  ogólno dostępne miejsce.
                </p>
                <p className="text-neutral-800">Współrzędne:</p>
                <p className="text-neutral-800">
                  {selectedLocation.lat.toFixed(5)}, {selectedLocation.lng.toFixed(5)}
                </p>
                <button className="btn btn-primary btn-sm" onClick={() => dialogRef.current?.showModal()}>
                  Zaplanuj wyjazd
                </button>
              </div>
            </InfoWindow>
          )}
        </Map>
      </div>
      <TripModal ref={dialogRef} location={selectedLocation} />
    </APIProvider>
  );
};

export default MapView;
