"use client";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TextField from "@/app/_components/TextField/TextField";

const schema = object({
  email: string().required("Pole wymagane").email("Email jest niepoprawny"),
  password: string().required("Pole wymagane"),
});

type Inputs = {
  email: string;
  password: string;
};

const Login = () => {
  const router = useRouter();
  const methods = useForm<Inputs>({
    defaultValues: {
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

  const onSubmit: SubmitHandler<Inputs> = async ({ email, password }) => {
    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) {
      setError("password", { message: "Nieprawidłowy email lub hasło" });
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fieldset bg-base-200 border-base-300 rounded-box mt-10 mb-8 w-xs border p-4">
            <legend className="fieldset-legend">Logowanie</legend>
            <TextField name="email" label="Email" type="email" />
            <TextField name="password" label="Hasło" type="password" />
            <button className="btn btn-neutral mt-4 w-full" disabled={isSubmitting}>
              {isSubmitting ? "Loguję..." : "Zaloguj"}
            </button>
          </fieldset>
        </form>
      </FormProvider>
      <div role="alert" className="alert alert-info max-w-xs">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="h-6 w-6 shrink-0 stroke-current"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <p className="text-center">
          Nie posiadasz jeszcze konta? <br />
          Załóż je i zyskaj dostęp do wszystkich funkcji.
        </p>
      </div>
      <Link href="/sign-up" className="btn btn-outline btn-accent mt-6">
        Zarejestruj się
      </Link>
    </div>
  );
};

export default Login;
