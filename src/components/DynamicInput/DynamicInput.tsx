import cn from 'classnames';
import { HTMLInputTypeAttribute, HTMLProps } from 'react';
import {
  FieldError,
  FieldErrors,
  FieldValues,
  Path,
  useFormContext,
} from 'react-hook-form';

function getNestedError<TFormValues extends FieldValues>(
  errors: FieldErrors<TFormValues>,
  path: Path<TFormValues>
): FieldError | undefined {
  // Split the path into segments for nested objects
  const segments = path.split('.');

  // Reduce the segments to access the deeply nested error message
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = errors;
  for (const segment of segments) {
    if (current[segment] === undefined || current[segment] === null) {
      return undefined; // Path is broken, return undefined
    }
    current = current[segment];
  }

  // If we have a FieldError object, return its message
  return typeof current === 'object' && 'message' in current
    ? current
    : undefined;
}

export type DynamicInputProps<TFormValues extends FieldValues> =
  HTMLProps<HTMLInputElement> & {
    id: Path<TFormValues>;
    name: Path<TFormValues>; // Adjusted to allow dot notation for nested properties
    label: string;
    type?: HTMLInputTypeAttribute;
    setValueAs?: (v: string) => number | undefined; // Adjust as necessary for your use case
  };

export const DynamicInput = <TFormValues extends FieldValues>({
  id,
  name,
  label,
  type = 'text',
  setValueAs,
  ...inputProps
}: DynamicInputProps<TFormValues>) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<TFormValues>();

  const errorObj = getNestedError(errors, name);

  return (
    <div className="relative mb-2 mt-4 w-full">
      <input
        type={type}
        {...register(name, {
          setValueAs: setValueAs,
        })}
        className={cn(
          inputProps.className,
          `block w-full px-0 pt-4 pb-1 border-0 border-b focus:ring-0 focus:border-black`,
          {
            'border-red-500': errorObj,
            'border-green-500': !errorObj,
          }
        )}
        id={id}
        {...inputProps}
      />
      <label
        htmlFor={id}
        className={`absolute top-0 mt-2 transition-all duration-300 origin-0 ${
          errorObj ? 'text-red-500' : ''
        }`}
      >
        {label}
      </label>
      {errorObj?.message && (
        <p className="text-sm text-red-500">{errorObj?.message}</p>
      )}
    </div>
  );
};
