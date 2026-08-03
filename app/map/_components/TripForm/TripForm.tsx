import Checkbox from "@/app/_components/forms/Checkbox";
import CheckboxGroup from "@/app/_components/forms/CheckboxGroup";
import TextField from "@/app/_components/forms/TextField";
import { MOTORCYCLE_TYPES, RIDING_STYLES } from "@/app/lib/tripOptions";
import { FormProvider } from "react-hook-form";
import { Location } from "../../types";
import { useTripForm } from "./useTripForm";

type Props = {
  location: Location;
  onSuccess: () => void;
};

const TripForm = ({ location, onSuccess }: Props) => {
  const { handleSubmit, serverError, methods } = useTripForm({ location, onSuccess });

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
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
        <button type="submit" className="btn btn-primary mt-4 w-full" disabled={methods.formState.isSubmitting}>
          Zaplanuj
        </button>
      </form>
    </FormProvider>
  );
};

export default TripForm;
