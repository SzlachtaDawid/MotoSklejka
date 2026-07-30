"use client";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { array, boolean, object, string } from "yup";
import { useRouter } from "next/navigation";
import TextField from "@/app/_components/forms/TextField";
import Checkbox from "@/app/_components/forms/Checkbox";
import CheckboxGroup from "@/app/_components/forms/CheckboxGroup";
import { MOTORCYCLE_TYPES, RIDING_STYLES } from "@/app/lib/tripOptions";
import { createTrip } from "./actions";

type Location = {
  lat: number;
  lng: number;
};

type Props = {
  location: Location | null;
};

const schema = object({
  startDateTime: string().required("Pole wymagane"),
  destination: string().required("Pole wymagane"),
  groupSize: string().required("Pole wymagane"),
  estimatedDuration: string().required("Pole wymagane"),
  estimatedDistanceKm: string().required("Pole wymagane"),
  returnToStart: boolean().required(),
  motorcycleTypes: array().of(string().required()).min(1, "Wybierz przynajmniej jeden typ").required(),
  ridingStyle: array().of(string().required()).min(1, "Wybierz przynajmniej jeden styl").required(),
});

type Inputs = {
  startDateTime: string;
  destination: string;
  groupSize: string;
  estimatedDuration: string;
  estimatedDistanceKm: string;
  returnToStart: boolean;
  motorcycleTypes: string[];
  ridingStyle: string[];
};

const TripModal = forwardRef<HTMLDialogElement, Props>(({ location }, ref) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useImperativeHandle(ref, () => dialogRef.current as HTMLDialogElement);
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const methods = useForm<Inputs>({
    defaultValues: {
      startDateTime: "",
      destination: "",
      groupSize: "",
      estimatedDuration: "",
      estimatedDistanceKm: "",
      returnToStart: false,
      motorcycleTypes: [],
      ridingStyle: [],
    },
    resolver: yupResolver(schema),
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setServerError(null);
    const result = await createTrip({ ...data, location });
    if (result?.error) {
      setServerError(result.error);
      return;
    }
    methods.reset();
    dialogRef.current?.close();
    router.refresh();
  };

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box max-h-[90vh]">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute top-2 right-2" aria-label="Zamknij">
            ✕
          </button>
        </form>
        <h3 className="text-lg font-bold">Zaplanuj wyjazd</h3>
        {location && (
          <p className="text-base-content/60 py-2 text-sm">
            Współrzędne startu: ({location.lat.toFixed(5)}, {location.lng.toFixed(5)})
          </p>
        )}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
            <fieldset className="fieldset gap-3">
              <TextField name="startDateTime" label="Data i godzina startu" type="datetime-local" />
              <TextField name="destination" label="Cel podróży" />
              <TextField name="estimatedDuration" label="Szacowany czas trwania (np. weekend, 3 dni)" />
              <TextField name="estimatedDistanceKm" label="Planowany dystans (km)" type="number" />
              <Checkbox name="returnToStart" label="Powrót do punktu startu" />
              <TextField name="groupSize" label="Liczebność grupy" type="number" />
              <CheckboxGroup name="motorcycleTypes" label="Typy motocykli" options={MOTORCYCLE_TYPES} />
              <CheckboxGroup name="ridingStyle" label="Styl jazdy" options={RIDING_STYLES} />
            </fieldset>
            {serverError && (
              <div role="alert" className="alert alert-error">
                <span>{serverError}</span>
              </div>
            )}
            <button type="submit" className="btn btn-primary mt-4 w-full" disabled={isSubmitting}>
              Zaplanuj
            </button>
          </form>
        </FormProvider>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>Zamknij</button>
      </form>
    </dialog>
  );
});

TripModal.displayName = "TripModal";

export default TripModal;
