import { object, string } from "yup";

export type FormValues = {
  name: string;
  email: string;
  password: string;
};

export const defaultValues: FormValues = {
  name: "",
  email: "",
  password: "",
};

export const schema = object({
  name: string().required("Pole wymagane"),
  email: string().required("Pole wymagane").email("Email jest niepoprawny"),
  password: string().required("Pole wymagane").min(8, "Minimum 8 znaków"),
});
