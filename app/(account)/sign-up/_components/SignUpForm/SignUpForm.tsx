"use client";
import { FormProvider } from "react-hook-form";
import TextField from "@/app/_components/forms/TextField";
import { useSignUpForm } from "./useSignUpForm";

const SignUpForm = () => {
  const { handleSubmit, methods } = useSignUpForm();

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit}>
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box mt-10 w-xs border p-4">
          <legend className="fieldset-legend">Rejestracja</legend>
          <TextField name="name" label="Twoja nazwa" />
          <TextField name="email" label="Email" type="email" />
          <TextField name="password" label="Hasło" type="password" />
          <button className="btn btn-neutral mt-4 w-full" disabled={methods.formState.isSubmitting}>
            {methods.formState.isSubmitting ? "Rejestruję..." : "Załóż konto"}
          </button>
        </fieldset>
      </form>
    </FormProvider>
  );
};

export default SignUpForm;
