import { FormProvider } from "react-hook-form";
import TextField from "@/app/_components/forms/TextField";
import { useLoginForm } from "./useLoginForm";

const LoginForm = () => {
  const { handleSubmit, methods } = useLoginForm();

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit}>
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box mt-6 mb-8 w-xs border p-4">
          <legend className="fieldset-legend">Logowanie</legend>
          <TextField name="email" label="Email" type="email" />
          <TextField name="password" label="Hasło" type="password" />
          <button className="btn btn-neutral mt-4 w-full" disabled={methods.formState.isSubmitting}>
            {methods.formState.isSubmitting ? "Loguję..." : "Zaloguj"}
          </button>
        </fieldset>
      </form>
    </FormProvider>
  );
};

export default LoginForm;
