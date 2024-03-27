import { useFormContext } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { ZodType, z } from 'zod';

import { Button } from '@/components/Button';

export type FormData = {
  username: string;
  password: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  verificationCode?: number;
};

export type LoginFormFields = {
  username?: boolean;
  password?: boolean;
  forgotPassword?: boolean;
  email?: boolean;
  firstName?: boolean;
  lastName?: boolean;
  verificationCode?: boolean;
  secondaryButton?: boolean;
};

type Props = {
  schema: ZodType<Partial<FormData>>;
  onSubmit: (data: Partial<FormData>) => void;
  fields: LoginFormFields;
  overrideFieldErrors?: {
    username?: boolean;
    password?: boolean;
    email?: boolean;
    firstName?: boolean;
    lastName?: boolean;
    verificationCode?: boolean;
  };
  secondaryButtonText?: string;
  submitButtonText?: string;
  onSubmitErrorMessage?: string;
  handleResendVerificationCode?: () => void;
  onSecondaryButtonClick?: () => void;
};

export const LoginForm = ({
  onSubmit,
  fields,
  submitButtonText = 'Submit',
  onSubmitErrorMessage,
  overrideFieldErrors,
  schema,
  handleResendVerificationCode,
  secondaryButtonText = 'button',
  onSecondaryButtonClick,
}: Props) => {
  type LoginFormData = z.infer<typeof schema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useFormContext<LoginFormData>();

  const formSubmit = handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <form onSubmit={formSubmit}>
      {fields.username && (
        <div className="mt-4">
          <label
            className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200"
            htmlFor="username"
          >
            Username
          </label>
          <input
            id="username"
            className={`block w-full px-4 py-2 text-gray-700 bg-white border-b border-brownishGrey-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-green-500  dark:focus:border-blue-300 focus:outline-none ${
              (errors.username || overrideFieldErrors?.username) &&
              'border-red-500'
            }`}
            type="text"
            placeholder="Username"
            {...register('username')}
          />
          {errors.username && (
            <p className="text-red-500 text-xs italic">
              {errors.username.message}
            </p>
          )}
        </div>
      )}
      {fields.email && (
        <div className="mt-4">
          <label
            className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            className={`block w-full px-4 py-2 text-gray-700 bg-white border-b border-brownishGrey-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-green-500  dark:focus:border-blue-300 focus:outline-none ${
              errors.email && 'border-red-500'
            }`}
            type="text"
            placeholder="Email"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-red-500 text-xs italic">
              {errors.email.message}
            </p>
          )}
        </div>
      )}

      {fields.firstName && (
        <div className="mt-4">
          <label
            className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200"
            htmlFor="firstName"
          >
            First Name
          </label>
          <input
            id="firstName"
            className={`block w-full px-4 py-2 text-gray-700 bg-white border-b border-brownishGrey-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-green-500  dark:focus:border-blue-300 focus:outline-none ${
              errors.firstName && 'border-red-500'
            }`}
            type="text"
            placeholder="First Name"
            {...register('firstName')}
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs italic">
              {errors.firstName.message}
            </p>
          )}
        </div>
      )}
      {fields.lastName && (
        <div className="mt-4">
          <label
            className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200"
            htmlFor="lastName"
          >
            Last Name
          </label>
          <input
            id="lastName"
            className={`block w-full px-4 py-2 text-gray-700 bg-white border-b border-brownishGrey-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-green-500  dark:focus:border-blue-300 focus:outline-none ${
              errors.lastName && 'border-red-500'
            }`}
            type="text"
            placeholder="Last Name"
            {...register('lastName')}
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs italic">
              {errors.lastName.message}
            </p>
          )}
        </div>
      )}

      {fields.verificationCode && (
        <div className="mt-4">
          <div className="flex justify-between">
            <label
              className={`block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200`}
              htmlFor="verificationCode"
            >
              Verify Email Code
            </label>
            <a
              href="#"
              className="text-xs text-gray-500 dark:text-gray-300 hover:underline"
              onClick={handleResendVerificationCode}
            >
              Resend Verification Code?
            </a>
          </div>
          <input
            id="code"
            className={`block w-full px-4 py-2 text-gray-700 bg-white border-b border-brownishGrey-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-green-500  dark:focus:border-blue-300 focus:outline-none ${
              (errors.verificationCode ||
                overrideFieldErrors?.verificationCode) &&
              'border-red-500'
            }`}
            type="number"
            placeholder="e.g. 123456"
            {...register('verificationCode', {
              setValueAs: (value) => Number(value),
            })}
          />
          {errors.verificationCode && (
            <p className="text-red-500 text-xs italic">
              {errors.verificationCode.message}
            </p>
          )}
        </div>
      )}
      {fields.password && (
        <div className="mt-4">
          <div className="flex justify-between">
            <label
              className={`block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200`}
              htmlFor="password"
            >
              Password
            </label>
            {fields.forgotPassword && (
              <Link
                to="/reset-password"
                state={{
                  username: getValues().username,
                }}
                className="text-xs text-gray-500 dark:text-gray-300 hover:underline"
              >
                Forget Password?
              </Link>
            )}
          </div>

          <input
            id="password"
            className={`block w-full px-4 py-2 text-gray-700 bg-white border-b border-brownishGrey-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-green-500  dark:focus:border-blue-300 focus:outline-none ${
              (errors.password || overrideFieldErrors?.password) &&
              'border-red-500'
            }`}
            type="password"
            placeholder="Password"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-red-500 text-xs italic">
              {errors.password.message}
            </p>
          )}
        </div>
      )}

      <div className="mt-6">
        <div className="flex justify-center gap-3">
          {fields.secondaryButton && (
            <Button
              type="button"
              variant="secondary"
              onClick={onSecondaryButtonClick}
              text={secondaryButtonText}
              buttonClassName=" sm:w-auto md:w-[100%] px-6 py-3"
            />
          )}
          <Button
            type="submit"
            variant="primary"
            text={submitButtonText}
            buttonClassName="sm:w-[100%] md:w-[100%] px-6 py-3"
          />
          {/* <button
            className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white-500 capitalize transition-colors duration-300 transform bg-green-500 rounded-lg hover:text-black-500 hover:bg-white-500 hover:border-green-500 hover:border focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
            type="submit"
          >
            {submitButtonText}
          </button> */}
        </div>
        {onSubmitErrorMessage && (
          <p className="mt-2 text-xs text-red-500 italic">
            {onSubmitErrorMessage}
          </p>
        )}
      </div>
    </form>
  );
};
