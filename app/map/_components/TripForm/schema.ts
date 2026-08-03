import { object, string, boolean, array } from "yup";

export type FormValues = {
  startDateTime: string;
  destination: string;
  groupSize: string;
  estimatedDuration: string;
  estimatedDistanceKm: string;
  returnToStart: boolean;
  motorcycleTypes: string[];
  ridingStyle: string[];
};

export const defaultValues: FormValues = {
  startDateTime: "",
  destination: "",
  groupSize: "",
  estimatedDuration: "",
  estimatedDistanceKm: "",
  returnToStart: false,
  motorcycleTypes: [],
  ridingStyle: [],
};

export const schema = object({
  startDateTime: string().required("Pole wymagane"),
  destination: string().required("Pole wymagane"),
  groupSize: string().required("Pole wymagane"),
  estimatedDuration: string().required("Pole wymagane"),
  estimatedDistanceKm: string().required("Pole wymagane"),
  returnToStart: boolean().required(),
  motorcycleTypes: array().of(string().required()).min(1, "Wybierz przynajmniej jeden typ").required(),
  ridingStyle: array().of(string().required()).min(1, "Wybierz przynajmniej jeden styl").required(),
});
