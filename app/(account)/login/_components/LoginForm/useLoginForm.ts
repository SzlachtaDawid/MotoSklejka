import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, SubmitHandler } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormValues, defaultValues, schema } from "./schema";

export const useLoginForm = () => {
  const router = useRouter();

  const methods = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<FormValues> = async ({ email, password }) => {
    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) {
      methods.setError("password", { message: "Nieprawidłowy email lub hasło" });
    } else {
      router.push("/");
    }
  };

  return {
    methods,
    handleSubmit: methods.handleSubmit(onSubmit),
  };
};
