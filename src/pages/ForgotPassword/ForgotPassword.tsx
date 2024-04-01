import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  ForgotPasswordSchema,
  LoginForm,
  LoginFormFields,
  RequestPasswordResetSchema,
  ResendVerificationCodeSchema,
} from '@/Forms';
import Logo from '@/assets/Logo';
import LogoWithText from '@/assets/LogoWithText';
import { axiosInstance } from '@/utils';

import '../Login/login.scss';

type FormData = {
  username: string;
  password: string;
  verificationCode?: number;
};
export const ForgotPassword = () => {
  const location = useLocation();
  const nav = useNavigate();

  // requestPasswordReset = default form to request a password reset
  const [requestPasswordReset, setRequestPasswordReset] = useState(true);
  const [onSubmitError, setOnSubmitError] = useState<string | undefined>(
    undefined
  );
  const [fields, setFields] = useState<
    Pick<
      LoginFormFields,
      'username' | 'verificationCode' | 'password' | 'secondaryButton'
    >
  >({
    username: true,
    verificationCode: false,
    password: false,
    secondaryButton: true,
  });

  const useFormRequestPasswordReset = useForm<FormData>({
    resolver: zodResolver(RequestPasswordResetSchema),
    defaultValues: {
      username: location.state?.username || '',
    },
  });

  const useFormSetNewPassword = useForm<FormData>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      username: location.state?.username || '',
    },
  });

  const {
    setValue: setValueNewPassword,
    formState: { errors },
  } = useFormSetNewPassword;

  const onRequestedNewCode = (data: Partial<FormData>) => {
    setOnSubmitError(undefined);

    axiosInstance
      .post(
        '/api/auth/forgot-password',
        {
          username: data.username,
        },
        {
          withCredentials: true,
        }
      )
      .then(() => {
        setValueNewPassword('username', data.username as string);
        setValueNewPassword('password', '');
        setRequestPasswordReset(false);
        setFields({
          ...fields,
          verificationCode: true,
          password: true,
          secondaryButton: false,
        });
      })
      .catch((err) => {
        const error = err;
        if (isAxiosError(error)) {
          setOnSubmitError(
            `${error.response?.data.message}. Please try again.`
          );
        } else {
          setOnSubmitError(
            'Unable to resend verification code. Please try again later.'
          );
        }
      });
  };

  const onSetNewPassword = (data: Partial<FormData>) => {
    setOnSubmitError(undefined);

    axiosInstance
      .post(
        `/api/auth/forgot-password/confirm`,
        {
          username: data.username,
          password: data.password,
          code: data.verificationCode,
        },
        {
          withCredentials: true,
        }
      )
      .then(() => {
        nav('/login#signin', {
          state: { username: data.username, password: data.password },
        });
      })
      .catch((err) => {
        const error = err;
        if (isAxiosError(error)) {
          setOnSubmitError(error.response?.data.message);
        } else {
          setOnSubmitError('Unable to reset password. Please try again later.');
        }
      });
  };

  return (
    <div className="relative dark:bg-slate-700 min-h-screen background">
      <div className="min-h-screen flex items-center">
        <div className="flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 lg:max-w-4xl">
          <div className="relative hidden lg:block lg:w-1/2 overflow-hidden">
            <Logo
              className={`transform scale-[2.0] absolute left-[-30%] opacity-50 ${
                errors?.verificationCode ? 'top-[9.35%]' : 'top-[6.3%]'
              }`}
            />
            <LogoWithText
              className={`absolute z-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/3 ${
                requestPasswordReset ? 'top-[59.7%]' : 'top-[39%]'
              }`}
            />

            <div className="absolute top-0 left-0 w-full h-full z-10 gradient"></div>
          </div>

          <div className="w-full px-6 py-8 md:px-8 lg:w-1/2 bg-white-500">
            <p className="mt-3 text-xl text-center text-gray-600 dark:text-gray-200">
              {requestPasswordReset
                ? 'Request a password reset'
                : 'Reset your password'}
            </p>
            <p className="mt-3 text-sm text-center text-gray-600 dark:text-gray-200">
              {requestPasswordReset
                ? 'Please enter your username below'
                : 'Please check your inbox for your verification code. This will expire in 1 hour.'}
            </p>
            <div className="flex items-center justify-between mt-4">
              <span className="w-1/5 border-b dark:border-gray-600 lg:w-1/4"></span>

              <div className="text-xs text-center text-gray-500 uppercase dark:text-gray-400">
                Enter your{' '}
                {requestPasswordReset
                  ? 'username'
                  : 'verification code & new password'}
              </div>

              <span className="w-1/5 border-b dark:border-gray-400 lg:w-1/4"></span>
            </div>
            <FormProvider
              {...(requestPasswordReset
                ? useFormRequestPasswordReset
                : useFormSetNewPassword)}
            >
              <LoginForm
                onSubmit={
                  requestPasswordReset ? onRequestedNewCode : onSetNewPassword
                }
                schema={
                  requestPasswordReset
                    ? ResendVerificationCodeSchema
                    : ForgotPasswordSchema
                }
                fields={fields}
                handleResendVerificationCode={() => {
                  setRequestPasswordReset(true);
                  setValueNewPassword('username', '');
                  setValueNewPassword('password', '');
                  setValueNewPassword('verificationCode', undefined);
                  setFields({
                    ...fields,
                    username: true,
                    verificationCode: false,
                    password: false,
                  });
                }}
                submitButtonText={
                  requestPasswordReset ? 'Request Reset' : 'Reset password'
                }
                secondaryButtonText={requestPasswordReset ? 'Back' : undefined}
                onSecondaryButtonClick={() => {
                  if (requestPasswordReset) {
                    nav('/login#signin');
                  }
                }}
                onSubmitErrorMessage={onSubmitError}
              />
            </FormProvider>
          </div>
        </div>
      </div>
    </div>
  );
};
