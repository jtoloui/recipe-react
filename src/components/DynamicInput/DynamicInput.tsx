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
    <div className="mb-1 w-full">
      <label
        htmlFor={id}
        className={`mb-1 block text-xs font-medium ${
          errorObj
            ? 'text-red-500'
            : 'text-brownishGrey-600 dark:text-white-600'
        }`}
      >
        {label}
      </label>
      <input
        type={type}
        {...register(name, {
          setValueAs: setValueAs,
        })}
        className={cn(
          inputProps.className,
          `block w-full rounded-md border bg-white-500 px-2.5 py-2 text-sm text-black-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 dark:bg-slate-700 dark:text-white-500`,
          {
            'border-red-500': errorObj,
            'border-gray2-500 focus:border-green-500 dark:border-slate-600':
              !errorObj,
          }
        )}
        id={id}
        {...inputProps}
      />
      {errorObj?.message && (
        <p className="mt-1 text-xs text-red-500">{errorObj?.message}</p>
      )}
    </div>
  );
};
