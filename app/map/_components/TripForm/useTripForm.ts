import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, SubmitHandler } from "react-hook-form";
import { createTrip } from "../../actions";
import { FormValues, defaultValues, schema } from "./schema";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Location } from "../../types";

type Props = {
  location: Location;
  onSuccess: () => void;
};

export const useTripForm = ({ location, onSuccess }: Props) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const methods = useForm<FormValues>({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setServerError(null);
    const result = await createTrip({ ...data, location });
    if (result?.error) {
      setServerError(result.error);
      return;
    }
    router.refresh();
    methods.reset();
    onSuccess();
  };

  return {
    serverError,
    methods,
    handleSubmit: methods.handleSubmit(onSubmit),
  };
};
