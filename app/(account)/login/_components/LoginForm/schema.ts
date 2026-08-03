import { object, string } from "yup";

export type FormValues = {
  email: string;
  password: string;
};

export const defaultValues: FormValues = {
  email: "",
  password: "",
};

export const schema = object({
  email: string().required("Pole wymagane").email("Email jest niepoprawny"),
  password: string().required("Pole wymagane"),
});
