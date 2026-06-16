"use client";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";
import TextField from "@/app/_components/TextField/TextField";

const schema = object({
  name: string().required("Pole wymagane"),
  email: string().required("Pole wymagane").email("Email jest nie poprawny"),
  password: string().required("Pole wymagane"),
});

type Inputs = {
  name: string;
  email: string;
  password: string;
};

const SignUp = () => {
  const methods = useForm<Inputs>({
    defaultValues: { email: "" },
    resolver: yupResolver(schema),
  });
  const { handleSubmit } = methods;
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box mt-16 w-xs border p-4">
          <legend className="fieldset-legend">Rejestracja</legend>
          <TextField name="name" label="Twoja nazwa" />
          <TextField name="email" label="Email" />
          <TextField name="password" label="Hasło" />
          <button className="btn btn-neutral mt-4">Wyślij</button>
        </fieldset>
      </form>
    </FormProvider>
  );
};

export default SignUp;
