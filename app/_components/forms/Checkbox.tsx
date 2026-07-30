import { Controller, useFormContext } from "react-hook-form";

type Props = {
  name: string;
  label: string;
};

const Checkbox = ({ name, label }: Props) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <label className="label flex items-center gap-2">
          <input
            type="checkbox"
            className="checkbox checkbox-sm"
            checked={field.value ?? false}
            onChange={(e) => field.onChange(e.target.checked)}
          />
          {label}
        </label>
      )}
    />
  );
};

export default Checkbox;
