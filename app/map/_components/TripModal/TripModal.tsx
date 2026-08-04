"use client";

import { useEffect, useRef } from "react";
import TripForm from "../TripForm/TripForm";

type Location = {
  lat: number;
  lng: number;
};

type Props = {
  location: Location | null;
  isOpen: boolean;
  onClose: () => void;
};

const TripModal = ({ location, isOpen, onClose }: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  return (
    <dialog ref={dialogRef} className="modal" onClose={onClose}>
      <div className="modal-box max-h-[90vh]">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute top-2 right-2"
          aria-label="Zamknij dialog"
          onClick={onClose}
        >
          ✕
        </button>
        <h3 className="text-lg font-bold">Zaplanuj wyjazd</h3>
        {location && (
          <>
            <p className="text-base-content/60 py-2 text-sm">
              Współrzędne startu: ({location.lat.toFixed(5)}, {location.lng.toFixed(5)})
            </p>
            <TripForm location={location} onSuccess={onClose} />
          </>
        )}
      </div>
    </dialog>
  );
};

export default TripModal;
