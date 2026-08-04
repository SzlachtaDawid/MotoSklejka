import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, SubmitHandler } from "react-hook-form";
import { signUp } from "../../actions";
import { FormValues, defaultValues, schema } from "./schema";

export const useSignUpForm = () => {
  const methods = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const result = await signUp(data);
    if (result?.error) {
      methods.setError("email", { message: result.error });
    }
  };

  return {
    methods,
    handleSubmit: methods.handleSubmit(onSubmit),
  };
};
