import { Controller, useFormContext } from "react-hook-form";
import clsx from "clsx";

type Option = { value: string; label: string };

type Props = {
  name: string;
  label: string;
  options: readonly Option[];
};

const CheckboxGroup = ({ name, label, options }: Props) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { invalid, error } }) => {
        const selected: string[] = field.value ?? [];
        const toggle = (value: string) => {
          field.onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
        };

        return (
          <div className="flex flex-col gap-1">
            <span className="label">{label}</span>
            <div className="flex flex-wrap gap-3">
              {options.map((option) => (
                <label key={option.value} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className={clsx("checkbox checkbox-sm", invalid && "checkbox-error")}
                    checked={selected.includes(option.value)}
                    onChange={() => toggle(option.value)}
                  />
                  {option.label}
                </label>
              ))}
            </div>
            {invalid && <p className="label text-error">{error?.message}</p>}
          </div>
        );
      }}
    />
  );
};

export default CheckboxGroup;
