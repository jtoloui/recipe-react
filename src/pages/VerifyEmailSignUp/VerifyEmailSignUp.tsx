import { zodResolver } from '@hookform/resolvers/zod';
import axios, { isAxiosError } from 'axios';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  LoginForm,
  LoginFormFields,
  ResendVerificationCodeSchema,
  VerificationCodeSchema,
} from '@/Forms';
import Logo from '@/assets/Logo';
import LogoWithText from '@/assets/LogoWithText';

type FormData = {
  verificationCode: number;
  username: string;
};

export const VerifyEmailSignUp = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [fields, setFields] = useState<
    Pick<LoginFormFields, 'username' | 'verificationCode' | 'secondaryButton'>
  >({
    username: true,
    verificationCode: true,
    secondaryButton: true,
  });

  const [requestedNewCode, setRequestedNewCode] = useState(false);

  const [onSubmitError, setOnSubmitError] = useState<string | undefined>(
    undefined
  );

  const useFormVerificationCode = useForm<FormData>({
    resolver: zodResolver(VerificationCodeSchema),
    defaultValues: {
      username: location.state?.username || '',
    },
  });

  const useFormResendVerificationCode = useForm<FormData>({
    resolver: zodResolver(ResendVerificationCodeSchema),
    defaultValues: {
      username: location.state?.username || '',
    },
  });

  const {
    formState: { errors },
    setValue: setVerificationCodeValue,
    clearErrors: clearVerificationCodeErrors,
  } = useFormVerificationCode;

  const formSubmit = (data: Partial<FormData>) => {
    setOnSubmitError(undefined);
    axios
      .post(
        `${import.meta.env.VITE_API_URI}/api/auth/verify/email`,
        {
          username: data.username,
          code: `${data.verificationCode}`,
        },
        {
          withCredentials: true,
        }
      )
      .then(() => {
        navigate('/login#signin', {
          state: { username: data.username },
        });
      })
      .catch((err) => {
        const error = err;
        if (isAxiosError(error)) {
          setOnSubmitError(error.response?.data.error.error);
        } else {
          setOnSubmitError('Unable to verify email. Please try again later.');
        }
      });
  };

  const handleFormSubmitResendCode = (data: Partial<FormData>) => {
    setOnSubmitError(undefined);
    axios
      .post(
        `${import.meta.env.VITE_API_URI}/api/auth/resend/verification-code`,
        {
          username: data.username,
        },
        {
          withCredentials: true,
        }
      )
      .then(() => {
        setVerificationCodeValue(
          'verificationCode',
          undefined as unknown as number
        );
        setVerificationCodeValue('username', data.username || '');
        setRequestedNewCode(false);
        setFields({ ...fields, verificationCode: true });
      })
      .catch((err) => {
        const error = err;
        if (isAxiosError(error)) {
          setOnSubmitError(error.response?.data.error.error);
        } else {
          setOnSubmitError(
            'Unable to resend verification code. Please try again later.'
          );
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
                errors.verificationCode ? 'top-[9.35%]' : 'top-[6.3%]'
              }`}
            />
            <LogoWithText className="absolute top-1/2 z-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/3" />

            <div className="absolute top-0 left-0 w-full h-full z-10 gradient"></div>
          </div>

          <div className="w-full px-6 py-8 md:px-8 lg:w-1/2 bg-white-500">
            <p className="mt-3 text-xl text-center text-gray-600 dark:text-gray-200">
              {requestedNewCode ? 'Request new code' : 'Confirm your email'}
            </p>
            <p className="mt-3 text-sm text-center text-gray-600 dark:text-gray-200">
              {requestedNewCode
                ? 'Please enter your username below'
                : 'Please check your inbox for your verification code.'}
            </p>
            <div className="flex items-center justify-between mt-4">
              <span className="w-1/5 border-b dark:border-gray-600 lg:w-1/4"></span>

              <div className="text-xs text-center text-gray-500 uppercase dark:text-gray-400">
                Enter your {requestedNewCode ? 'username' : 'verification code'}
              </div>

              <span className="w-1/5 border-b dark:border-gray-400 lg:w-1/4"></span>
            </div>
            <FormProvider
              {...(requestedNewCode
                ? useFormResendVerificationCode
                : useFormVerificationCode)}
            >
              <LoginForm
                onSubmit={
                  requestedNewCode ? handleFormSubmitResendCode : formSubmit
                }
                schema={
                  requestedNewCode
                    ? ResendVerificationCodeSchema
                    : VerificationCodeSchema
                }
                fields={fields}
                handleResendVerificationCode={() => {
                  setRequestedNewCode(true);
                  setFields({
                    ...fields,
                    username: true,
                    verificationCode: false,
                  });
                }}
                submitButtonText={requestedNewCode ? 'Resend code' : 'Verify'}
                secondaryButtonText={requestedNewCode ? 'Back' : 'login page'}
                onSecondaryButtonClick={() => {
                  if (requestedNewCode) {
                    setRequestedNewCode(false);
                    clearVerificationCodeErrors([
                      'username',
                      'verificationCode',
                    ]);
                    setVerificationCodeValue(
                      'verificationCode',
                      undefined as unknown as number
                    );
                    setFields({
                      ...fields,
                      username: true,
                      verificationCode: true,
                      secondaryButton: true,
                    });
                  } else {
                    navigate('/');
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
