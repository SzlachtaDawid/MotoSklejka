"use client";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";
import TextField from "@/app/_components/forms/TextField";
import { signUp } from "./actions";

const schema = object({
  name: string().required("Pole wymagane"),
  email: string().required("Pole wymagane").email("Email jest niepoprawny"),
  password: string().required("Pole wymagane").min(8, "Minimum 8 znaków"),
});

type Inputs = {
  name: string;
  email: string;
  password: string;
};

const SignUp = () => {
  const methods = useForm<Inputs>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    resolver: yupResolver(schema),
  });
  const {
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = methods;

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const result = await signUp(data);
    if (result?.error) {
      setError("email", { message: result.error });
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="flex flex-1 items-center justify-center">
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fieldset bg-base-200 border-base-300 rounded-box mt-10 w-xs border p-4">
            <legend className="fieldset-legend">Rejestracja</legend>
            <TextField name="name" label="Twoja nazwa" />
            <TextField name="email" label="Email" type="email" />
            <TextField name="password" label="Hasło" type="password" />
            <button className="btn btn-neutral mt-4 w-full" disabled={isSubmitting}>
              {isSubmitting ? "Rejestruję..." : "Załóż konto"}
            </button>
          </fieldset>
        </form>
      </div>
    </FormProvider>
  );
};

export default SignUp;
