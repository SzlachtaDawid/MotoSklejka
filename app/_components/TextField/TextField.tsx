import { Controller, useFormContext } from "react-hook-form";
import clsx from "clsx";

type Props = {
  name: string;
  label: string;
};

const TextField = ({ name, label }: Props) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { invalid, error } }) => (
        <>
          <label htmlFor={name} className="label">
            {label}
          </label>
          <input
            type="email"
            id={name}
            className={clsx("input", invalid && "input-error")}
            placeholder={label}
            {...field}
          />
          {invalid && <p className={clsx("label", invalid && "text-error")}>{error?.message}</p>}
        </>
      )}
    />
  );
};

export default TextField;
